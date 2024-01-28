import { BUILD_TIME } from '../utils/build_time'
import { formatDate, invisibleRightPad } from '../utils/general'
import { LocalStorageVariable } from '../utils/save'
import { convertObjectToString } from './globals'
import {
  actualFramesPerSecondState,
  actualSubticksPerSecondState,
  actualTicksPerSecondState,
  framesPerSecondState,
  selectedBlockState,
  subtickState,
  tickState,
  updatesPerSecondState,
  viewSubTicksState
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

const buildTime: string = formatDate(BUILD_TIME)

export const updateDebugInfo = () => {
  debugPanel.innerHTML = ''
  const varWidth = 20

  const targetTicksPerSecond = viewSubTicksState.get()
    ? ''
    : ` [${updatesPerSecondState.get()}]`

  const targetSubticksPerSecond = viewSubTicksState.get()
    ? ` [${updatesPerSecondState.get()}]`
    : ''

  const variables = [
    `${invisibleRightPad('Build', varWidth)} ${buildTime}`,
    `${invisibleRightPad('Selected', varWidth - 2)} ${convertObjectToString(
      (selectedBlockState.get() as unknown) as Record<string, string>
    )}`,
    `${invisibleRightPad('Tick', varWidth + 2)} ${tickState.get()}`,
    `${invisibleRightPad('Subtick', varWidth - 2)} ${subtickState.get()}`,
    `${invisibleRightPad(
      'Ticks/s',
      varWidth - 1
    )} ${actualTicksPerSecondState.get()}${targetTicksPerSecond}`,
    `${invisibleRightPad(
      'Subicks/s',
      varWidth - 3
    )} ${actualSubticksPerSecondState.get()}${targetSubticksPerSecond}`,
    `${invisibleRightPad(
      'Frames/s',
      varWidth - 3
    )} ${actualFramesPerSecondState.get()} [${framesPerSecondState.get()}]`
  ]

  variables.forEach(value => {
    const item = document.createElement('div')
    item.textContent = String(value)
    debugPanel.appendChild(item)
  })
}
