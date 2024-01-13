import { zipArrays } from './general'

const commandLineElement = document.getElementById(
  'command-line'
) as HTMLInputElement
const commandListElement = document.getElementById(
  'command-list'
) as HTMLDivElement

export interface Command {
  pattern: string
  callback: (inputs: StringDict) => void
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
  const input = commandLineElement.value

  const viableCommands = cm.commands.filter(command =>
    cm.isCommandPartialMatch(input, command.pattern)
  )

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

export const initCommandLineEventListeners = (cm: CommandManager) => {
  commandLineElement.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      // on enter run command or exit command line
      const command = commandLineElement.value
      if (['', '/'].includes(command)) {
        commandListElement.style.display = 'none'
        commandLineElement.blur()
      }
      cm.ifCommandExecute(command)
      commandLineElement.value = ''
    } else if (event.key === 'Tab') {
      // on tab select the first suggested command
      // TODO add tabbing through all options not just first
      const firstCommandItem = commandListElement
        .children[0] as HTMLButtonElement
      firstCommandItem.click()
      event.preventDefault()
    }

    if (event.key === 'ArrowUp') {
      // on arrow up switch through commandHistory
      commandLineElement.value = cm.getNextHistoryItem(commandLineElement.value)
      setTimeout(() => {
        buildCommandHistory(cm)
        focusEndOfCommandLine()
      }, 0)
    } else {
      setTimeout(() => {
        buildCommandSuggestions(cm)
      }, 0)
    }
  })

  let commandLineExitTimeout: NodeJS.Timeout

  // on focus of the command line show suggestions
  commandLineElement.onfocus = () => {
    clearTimeout(commandLineExitTimeout)
    buildCommandSuggestions(cm)
    commandListElement.style.display = ''
  }

  // on blur of the command line hide suggestions after delay
  commandLineElement.onblur = () => {
    commandLineExitTimeout = setTimeout(() => {
      if (commandLineElement !== document.activeElement) {
        commandListElement.style.display = 'none'
      }
    }, 100)
  }
}

type StringDict = { [key: string]: string }

export class CommandManager {
  public commands: Command[] = []
  public history: string[] = []

  public createCommand (
    pattern: string,
    callback: (inputs: StringDict) => void
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
    const currentCommandIndex = this.history.findIndex(
      item => item === commandLineElement.value
    )
    let newCommand: string
    if (currentCommandIndex > 0) {
      newCommand = this.history[0]
    } else {
      newCommand = this.history[(currentCommandIndex + 1) % this.history.length]
    }

    return newCommand
  }

  public ifCommandExecute (input: string) {
    for (const command of this.commands) {
      const inputs = this.ifCommandGetInputs(input, command.pattern)
      console.log({ inputs, input, cmd: command.pattern })
      if (inputs) {
        this.addHistory(input)
        command.callback(inputs)
        return
      }
    }
  }
}
