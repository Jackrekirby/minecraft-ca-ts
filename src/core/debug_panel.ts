import { invisibleRightPad } from '../utils/general'
import { LocalStorageVariable } from '../utils/save'
import { storage } from './storage'
const debugPanel = document.getElementById('debug-panel') as HTMLButtonElement

export const initialiseDebugPanel = () => {
  storage.debugPanelState = new LocalStorageVariable<boolean>({
    defaultValue: true,
    localStorageKey: 'show-debug-panel',
    saveInterval: 0,
    setCallback: (showDebugPanel: boolean) => {
      debugPanel.style.display = showDebugPanel ? '' : 'none'
    }
  })
}

export const updateDebugInfo = () => {
  debugPanel.innerHTML = ''
  const varWidth = 20

  const targetTicksPerSecond = storage.viewSubTicksState.get()
    ? ''
    : ` [${storage.updatesPerSecondState.get()}]`

  const targetSubticksPerSecond = storage.viewSubTicksState.get()
    ? ` [${storage.updatesPerSecondState.get()}]`
    : ''

  const variables = [
    // `${invisibleRightPad('Selected', varWidth - 2)} ${convertObjectToString(
    //   (storage.selectedBlockState.get() as unknown) as Record<string, string>
    // )}`,
    `${invisibleRightPad('Tick', varWidth + 2)} ${storage.tickState.get()}`,
    `${invisibleRightPad(
      'Subtick',
      varWidth - 2
    )} ${storage.subtickState.get()}`,
    `${invisibleRightPad(
      'Ticks/s',
      varWidth - 1
    )} ${storage.actualTicksPerSecondState.get()}${targetTicksPerSecond}`,
    `${invisibleRightPad(
      'Subicks/s',
      varWidth - 3
    )} ${storage.actualSubticksPerSecondState.get()}${targetSubticksPerSecond}`,
    `${invisibleRightPad(
      'Frames/s',
      varWidth - 3
    )} ${storage.actualFramesPerSecondState.get()} [${storage.framesPerSecondState.get()}]`,
    `${invisibleRightPad(
      'Updates/s',
      varWidth - 3
    )} ${storage.actualUpdatesPerSecondState.get()}`
  ]

  variables.forEach(value => {
    const item = document.createElement('div')
    item.textContent = String(value)
    debugPanel.appendChild(item)
  })
}
