import { LocalStorageVariable } from '../utils/save'
import { GLOBALS } from './globals'

const debugPanel = document.getElementById('debug-panel') as HTMLButtonElement

export const debugPanelState = new LocalStorageVariable<boolean>({
  defaultValue: true,
  localStorageKey: 'show-debug-panel',
  saveInterval: 0,
  setCallback: (showDebugPanel: boolean) => {
    debugPanel.style.display = showDebugPanel ? '' : 'none'
  }
})

export const updateDebugInfo = () => {
  debugPanel.innerHTML = ''

  Object.values(GLOBALS).forEach(globalValue => {
    const item = document.createElement('div')
    item.textContent = globalValue.display()

    debugPanel.appendChild(item)
  })
}
