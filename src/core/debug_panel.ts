import { createState } from '../utils/general'
import { GLOBALS } from './globals'

const debugPanel = document.getElementById('debug-panel') as HTMLButtonElement

export const debugPanelState = createState<boolean>(
  true,
  'show-debug-panel',
  (showDebugPanel: boolean) => {
    debugPanel.style.display = showDebugPanel ? '' : 'none'
  }
)

export const updateDebugInfo = () => {
  debugPanel.innerHTML = ''

  Object.values(GLOBALS).forEach(globalValue => {
    const item = document.createElement('div')
    item.textContent = globalValue.display()

    debugPanel.appendChild(item)
  })
}
