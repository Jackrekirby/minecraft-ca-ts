import { LocalStorageVariable } from '../utils/save'
import { convertObjectToString } from './globals'
import { selectedBlockState, subtickState, tickState } from './storage'
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
  const variables = [
    `Build: ${BUILD}`,
    `Selected: ${convertObjectToString(
      (selectedBlockState.get() as unknown) as Record<string, string>
    )}`,
    `Tick: ${tickState.get()}`,
    `Subticks: ${subtickState.get()}`
  ]

  variables.forEach(value => {
    const item = document.createElement('div')
    item.textContent = String(value)
    debugPanel.appendChild(item)
  })
}
