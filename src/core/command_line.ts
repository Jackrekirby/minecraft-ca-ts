import { createState, zipArrays } from '../utils/general'

const commandLineElement = document.getElementById(
  'command-line'
) as HTMLInputElement
const commandListElement = document.getElementById(
  'command-list'
) as HTMLDivElement
const commandListWrapperElement = document.getElementById(
  'command-list-wrapper'
) as HTMLDivElement
const commandListHeadingElement = document.getElementById(
  'command-list-heading'
) as HTMLDivElement

export interface Command {
  pattern: string
  callback: (inputs: StringDict) => Promise<string>
}

type StringDict = { [key: string]: string }

export class CommandManager {
  public commands: Command[] = []
  public history: string[] = []
  public outputs: string[] = []

  public createCommand (
    pattern: string,
    callback: (inputs: StringDict) => Promise<string>
  ) {
    this.commands.push({ pattern, callback })
  }

  private addHistory (item: string) {
    const newHistory = this.history.filter(command => command !== item)
    this.history.length = 0
    this.history.push(item)
    this.history.push(...newHistory)
  }

  private ifCommandGetInputs (input: string, command: string) {
    const inputs: StringDict = {}
    const commandParts = command.split(' ')
    const inputParts = input.split(' ')
    for (const [commandPart, inputPart] of zipArrays(
      commandParts,
      inputParts
    )) {
      if (commandPart[0] != '{' && commandPart !== inputPart) {
        return null
      }

      const input_name = commandPart.split(':')[0].slice(1)
      const input_value = inputPart
      inputs[input_name] = input_value
    }
    return inputs
  }

  public isCommandPartialMatch (input: string, command: string) {
    if (input === '') return true
    const commandParts = command.split(' ')
    const inputParts = input.split(' ')
    const n = inputParts.length

    for (let i = 0; i < n - 1; i++) {
      const commandPart = commandParts[i]
      const inputPart = inputParts[i]
      if (commandPart[0] != '{' && commandPart !== inputPart) {
        return false
      }
    }

    const commandPart = commandParts[n - 1]
    const inputPart = inputParts[n - 1]
    if (commandPart[0] != '{' && !commandPart.startsWith(inputPart)) {
      return false
    }

    return true
  }

  public getNextHistoryItem (input: string): string {
    if (this.history.length === 0) return ''
    const currentCommandIndex = this.history.findIndex(item => item === input)
    let newCommand: string
    if (currentCommandIndex > 0) {
      newCommand = this.history[0]
    } else {
      newCommand = this.history[(currentCommandIndex + 1) % this.history.length]
    }

    return newCommand
  }

  public getNextHintItem (input: string): string {
    const viableCommands = this.commands.filter(command =>
      this.isCommandPartialMatch(input, command.pattern)
    )

    if (viableCommands.length === 0) return ''
    const currentCommandIndex = this.commands.findIndex(
      item => item.pattern === input
    )

    // console.log({ input, viableCommands, currentCommandIndex })
    let newCommand: Command
    if (currentCommandIndex > 0) {
      newCommand = viableCommands[0]
    } else {
      newCommand =
        viableCommands[(currentCommandIndex + 1) % this.history.length]
    }

    return replaceCommandPlaceholders(newCommand.pattern)
  }

  public async ifCommandExecute (input: string) {
    for (const command of this.commands) {
      const inputs = this.ifCommandGetInputs(input, command.pattern)
      // console.log({ inputs, input, cmd: command.pattern })
      if (inputs) {
        this.addHistory(input)
        const output: string = await command.callback(inputs)
        this.outputs.push(output)
        return
      }
    }

    this.outputs.push(`command '${input}' not recognised`)
  }
}

const replaceCommandPlaceholders = (input: string) => {
  // replaces anything in curley braces with a question mark
  return input.replace(/\{[^}]+\}/g, '?')
}

const focusEndOfCommandLine = () => {
  commandLineElement.focus()
  // Set cursor position at the end of the string
  const inputValueLength = commandLineElement.value.length
  commandLineElement.setSelectionRange(inputValueLength, inputValueLength)
}

export const buildCommandSuggestions = (cm: CommandManager) => {
  commandListElement.innerHTML = ''
  commandListHeadingElement.textContent = 'HINT'
  const input = commandLineElement.value

  const viableCommands = cm.commands.filter(command =>
    cm.isCommandPartialMatch(input, command.pattern)
  )

  viableCommands.sort((a, b) => a.pattern.localeCompare(b.pattern))

  viableCommands.forEach(command => {
    const commandItem = document.createElement('div')
    commandItem.classList.add('command-item')
    commandItem.textContent = command.pattern
    commandItem.onclick = () => {
      commandLineElement.value = replaceCommandPlaceholders(command.pattern)
      focusEndOfCommandLine()
    }
    commandListElement.appendChild(commandItem)
  })
}

const buildCommandHistory = (cm: CommandManager) => {
  commandListElement.innerHTML = ''
  commandListHeadingElement.textContent = 'HISTORY'

  if (cm.history.length === 0) {
    const commandItem = document.createElement('div')
    commandItem.classList.add('command-item')
    commandItem.textContent = 'no history'
    commandListElement.appendChild(commandItem)
  } else {
    cm.history.forEach(command => {
      const commandItem = document.createElement('div')
      commandItem.classList.add('command-item')
      commandItem.textContent = command
      commandItem.onclick = () => {
        commandLineElement.value = command
        focusEndOfCommandLine()
      }
      commandListElement.appendChild(commandItem)
    })
  }
}

const buildCommandOutput = (cm: CommandManager) => {
  commandListHeadingElement.textContent = 'OUTPUT'
  commandListElement.innerHTML = ''

  if (cm.outputs.length === 0) {
    const commandItem = document.createElement('div')
    commandItem.classList.add('command-item')
    commandItem.textContent = 'no outputs'
    commandListElement.appendChild(commandItem)
  } else {
    cm.outputs.forEach(command => {
      const commandItem = document.createElement('div')
      commandItem.classList.add('command-item')
      commandItem.textContent = command
      commandListElement.appendChild(commandItem)
    })
  }
}

export const initCommandLineEventListeners = (cm: CommandManager) => {
  document.addEventListener('keydown', event => {
    if (event.key === '/') {
      if (
        commandLineElement !== document.activeElement &&
        ['', '/'].includes(commandLineElement.value)
      ) {
        event.preventDefault()
      }

      focusEndOfCommandLine()
    }
  })

  let hintItemIndex = 0

  commandLineElement.addEventListener(
    'keydown',
    async (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        // on enter run command or exit command line
        const command = commandLineElement.value
        if (['', '/'].includes(command)) {
          commandListWrapperElement.style.display = 'none'
          commandLineElement.blur()
        } else {
          await cm.ifCommandExecute(command)
        }

        commandLineElement.value = ''
      } else if (event.key === 'Tab') {
        // on tab select the first suggested command
        // TODO add tabbing through all options not just first

        // commandLineElement.value = cm.getNextHintItem(commandBeforeTab)

        const firstCommandItem = commandListElement.children[
          hintItemIndex % commandListElement.children.length
        ] as HTMLButtonElement

        Array.from(commandListElement.children).forEach(item =>
          item.classList.remove('selected')
        )
        firstCommandItem.classList.add('selected')

        hintItemIndex += 1

        firstCommandItem.click()
        event.preventDefault()
      } else if (event.key === 'ArrowUp') {
        // on arrow up switch through commandHistory
        commandLineElement.value = cm.getNextHistoryItem(
          commandLineElement.value
        )
        setTimeout(() => {
          buildCommandHistory(cm)
          focusEndOfCommandLine()
        }, 0)
      }

      if (event.key !== 'Tab') {
        hintItemIndex = 0
      }

      setTimeout(() => {
        if (commandLineElement.value === '' && cm.outputs.length > 0) {
          buildCommandOutput(cm)
        } else if (!['ArrowUp', 'Tab', 'Enter'].includes(event.key)) {
          buildCommandSuggestions(cm)
        }
      }, 0)
    }
  )

  let commandLineExitTimeout: NodeJS.Timeout

  // on focus of the command line show suggestions
  commandLineElement.onfocus = () => {
    clearTimeout(commandLineExitTimeout)

    if (commandLineElement.value === '' && cm.outputs.length > 0) {
      buildCommandOutput(cm)
    } else {
      buildCommandSuggestions(cm)
    }

    commandListWrapperElement.style.display = ''
  }

  // on blur of the command line hide suggestions after delay
  commandLineElement.onblur = () => {
    commandLineExitTimeout = setTimeout(() => {
      if (commandLineElement !== document.activeElement) {
        commandListWrapperElement.style.display = 'none'
      }
    }, 100)
  }
}

export const commandLineVisibilityState = createState<boolean>(
  true,
  'show-command-line',
  (isCommandLineVisible: boolean) => {
    if (isCommandLineVisible) {
      commandLineElement.classList.remove('invisible-on-blur')
    } else {
      commandLineElement.classList.add('invisible-on-blur')
    }
  }
)
