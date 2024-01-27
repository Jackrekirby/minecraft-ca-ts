import { invisibleRightPad } from '../utils/general'
import { LocalStorageVariable } from '../utils/save'
import { convertObjectToString } from './globals'
import {
  actualFramesPerSecondState,
  actualSubticksPerSecondState,
  actualTicksPerSecondState,
  selectedBlockState,
  subtickState,
  tickState
} from './storage'
// import { GLOBALS } from './globals'

const debugPanel = document.getElementById('debug-panel') as HTMLButtonElement

export const debugPanelState = new LocalStorageVariable<boolean>({
  defaultValue: true,
  localStorageKey: 'show-debug-panel',
  saveInterval: 0,
  setCallback: (showDebugPanel: boolean) => {
    debugPanel.style.display = showDebugPanel ? '' : 'none'
  }
})
const BUILD = process.env.BUILD_TIME?.replace(',', '')

export const updateDebugInfo = () => {
  debugPanel.innerHTML = ''
  const varWidth = 20
  const variables = [
    `${invisibleRightPad('Build', varWidth)} ${BUILD}`,
    `${invisibleRightPad('Selected', varWidth - 2)} ${convertObjectToString(
      (selectedBlockState.get() as unknown) as Record<string, string>
    )}`,
    `${invisibleRightPad('Tick', varWidth + 2)} ${tickState.get()} `,
    `${invisibleRightPad('Subtick', varWidth - 2)} ${subtickState.get()}`,
    `${invisibleRightPad(
      'Ticks/s',
      varWidth - 1
    )} ${actualTicksPerSecondState.get()}`,
    `${invisibleRightPad(
      'Subicks/s',
      varWidth - 3
    )} ${actualSubticksPerSecondState.get()}`,
    `${invisibleRightPad(
      'Frames/s',
      varWidth - 3
    )} ${actualFramesPerSecondState.get()}`
  ]

  variables.forEach(value => {
    const item = document.createElement('div')
    item.textContent = String(value)
    debugPanel.appendChild(item)
  })
}
