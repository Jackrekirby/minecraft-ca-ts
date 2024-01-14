import { createState, StateHandler, zipArrays } from '../utils/general'

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

enum CommandOutputType {
  Success = 'Success',
  Failure = 'Failure',
  Info = 'Info'
}
export interface CommandOutput {
  type: CommandOutputType
  message: string
}

function mapCommandOutputToEmoji (outputType: CommandOutputType): string {
  switch (outputType) {
    case CommandOutputType.Success:
      return '🟢'
    case CommandOutputType.Failure:
      return '🔴'
    case CommandOutputType.Info:
      return '🔵'
  }
}

export interface Command {
  pattern: string
  callback: (inputs: StringDict) => Promise<CommandOutput>
}

export const commandInfo = (message: string) => {
  return {
    type: CommandOutputType.Info,
    message
  }
}

export const commandSuccess = (message: string) => {
  return {
    type: CommandOutputType.Success,
    message
  }
}

export const commandFailure = (message: string) => {
  return {
    type: CommandOutputType.Failure,
    message
  }
}

type StringDict = { [key: string]: string }

export class CommandManager {
  public commands: Command[] = []
  public history: StateHandler<string[]> = createState(
    [] as string[],
    'command-history'
  )
  public outputs: StateHandler<CommandOutput[]> = createState(
    [] as CommandOutput[],
    'command-outputs'
  )

  public outputSuccessMessages: StateHandler<boolean> = createState(
    true,
    'output-command-success-messages'
  )

  public createCommand (
    pattern: string,
    callback: (inputs: StringDict) => Promise<CommandOutput>
  ) {
    this.commands.push({ pattern, callback })
  }

  private addHistory (item: string) {
    const newHistory = this.history.get().filter(command => command !== item)
    this.history.set([item, ...newHistory.slice(0, 50)])
    // only keep last 50 items in history
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

  public getVisibleOutputs () {
    return [...this.outputs.get()].reverse().filter(command => {
      return !(
        command.type === CommandOutputType.Success &&
        !this.outputSuccessMessages.get()
      )
    })
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

  public getNextHistoryIndex (input: string): number {
    const history = this.history.get()
    if (history.length === 0) return 0
    const currentCommandIndex = history.findIndex(item => item === input)
    let newCommand: string
    if (currentCommandIndex < 0) {
      return 0
    } else {
      return (currentCommandIndex + 1) % history.length
    }
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
        viableCommands[(currentCommandIndex + 1) % this.history.get().length]
    }

    return replaceCommandPlaceholders(newCommand.pattern)
  }

  private addOutput (output: CommandOutput) {
    // only store last 50 outputs
    this.outputs.set([output, ...this.outputs.get().slice(0, 50)])
  }

  public async ifCommandExecute (input: string) {
    for (const command of this.commands) {
      const inputs = this.ifCommandGetInputs(input, command.pattern)
      // console.log({ inputs, input, cmd: command.pattern })
      if (inputs) {
        this.addHistory(input)
        const output: CommandOutput = await command.callback(inputs)
        this.addOutput(output)

        return
      }
    }

    this.addOutput(commandFailure(`command '${input}' not recognised`))
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

const hideCommandListWrapperIfEmpty = () => {
  if (commandListElement.childElementCount === 0) {
    commandListWrapperElement.style.display = 'none'
  } else {
    commandListWrapperElement.style.display = ''
  }
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

  setTimeout(() => {
    hideCommandListWrapperIfEmpty()
    commandListElement.scrollTop = 0
  }, 0)
}

const buildCommandHistory = (cm: CommandManager) => {
  commandListElement.innerHTML = ''
  commandListHeadingElement.textContent = 'HISTORY'
  const history = cm.history.get()
  if (history.length === 0) {
    // const commandItem = document.createElement('div')
    // commandItem.classList.add('command-item')
    // commandItem.textContent = 'no history'
    // commandListElement.appendChild(commandItem)
  } else {
    ;[...history].reverse().forEach(command => {
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
  setTimeout(() => {
    hideCommandListWrapperIfEmpty()
    commandListElement.scrollTop = commandListElement.scrollHeight
  }, 0)
}

const buildCommandOutput = (cm: CommandManager) => {
  commandListHeadingElement.textContent = 'OUTPUT'
  commandListElement.innerHTML = ''
  const outputs = cm.getVisibleOutputs()
  console.log(outputs)
  if (outputs.length === 0) {
    // const commandItem = document.createElement('div')
    // commandItem.classList.add('command-item')
    // commandItem.textContent = 'no outputs'
    // commandListElement.appendChild(commandItem)
  } else {
    outputs.forEach(command => {
      const commandItem = document.createElement('div')
      commandItem.classList.add('command-item')
      commandItem.textContent = `${mapCommandOutputToEmoji(command.type)} ${
        command.message
      }`
      commandListElement.appendChild(commandItem)
    })
  }

  setTimeout(() => {
    hideCommandListWrapperIfEmpty()
    commandListElement.scrollTop = commandListElement.scrollHeight
  }, 0)
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

  const selectCommandListItem = (doClick: boolean = true) => {
    if (
      hintItemIndex < 0 ||
      hintItemIndex >= commandListElement.children.length
    ) {
      hintItemIndex = 0
    }

    const selectedCommandItem = commandListElement.children[
      hintItemIndex % commandListElement.children.length
    ] as HTMLButtonElement

    Array.from(commandListElement.children).forEach(item =>
      item.classList.remove('selected')
    )
    selectedCommandItem.classList.add('selected')
    if (doClick) selectedCommandItem.click()
    selectedCommandItem.scrollIntoView()
    return selectedCommandItem
  }

  const nextCommandListItem = (offset: number, isAbs: boolean) => {
    if (isAbs) {
      hintItemIndex += offset
    } else if (commandListHeadingElement.textContent === 'HISTORY') {
      hintItemIndex -= offset
    } else {
      hintItemIndex += offset
    }

    if (hintItemIndex < 0) {
      hintItemIndex = commandListElement.children.length - 1
    } else if (hintItemIndex >= commandListElement.children.length) {
      hintItemIndex = 0
    }

    console.log(hintItemIndex, commandListElement.children.length)

    selectCommandListItem()
    setTimeout(() => focusEndOfCommandLine(), 0)
  }

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
        nextCommandListItem(1, false)

        event.preventDefault()
      } else if (event.key === 'ArrowUp') {
        if (
          [''].includes(commandLineElement.value) &&
          commandListHeadingElement.textContent !== 'HISTORY'
        ) {
          commandLineElement.value = cm.history.get()[0]
          setTimeout(() => {
            buildCommandHistory(cm)
            focusEndOfCommandLine()
            hintItemIndex = commandListElement.children.length - 1
            selectCommandListItem()
          }, 0)
        } else {
          nextCommandListItem(-1, true)
        }
      } else if (event.key === 'ArrowDown') {
        nextCommandListItem(1, true)
      } else if (event.key === 'Tab' && event.shiftKey) {
        nextCommandListItem(-1, false)
        event.preventDefault()
      }

      if (!['ArrowUp', 'Tab', 'ArrowDown'].includes(event.key)) {
        hintItemIndex = -1
      }

      setTimeout(() => {
        if (commandLineElement.value === '' && cm.outputs.get().length > 0) {
          buildCommandOutput(cm)
        } else if (
          !['ArrowUp', 'Tab', 'Enter', 'ArrowDown'].includes(event.key)
        ) {
          buildCommandSuggestions(cm)

          setTimeout(() => {
            selectCommandListItem(false)
          }, 0)
        }
      }, 0)
    }
  )

  let commandLineExitTimeout: NodeJS.Timeout

  // on focus of the command line show suggestions
  commandLineElement.onfocus = () => {
    clearTimeout(commandLineExitTimeout)

    if (commandLineElement.value === '' && cm.outputs.get().length > 0) {
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
