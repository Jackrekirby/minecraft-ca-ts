import { BUILD_TIME } from '../utils/build_time'
import { formatDate } from '../utils/general'

const guidePanel = document.getElementById('guide-panel') as HTMLButtonElement

const guideButton = document.getElementById('guide-button') as HTMLButtonElement

const buildDetails = document.getElementById(
  'build-details'
) as HTMLButtonElement

export const initialiseGuide = () => {
  const buildTime: string = formatDate(BUILD_TIME)
  buildDetails.textContent = `${buildTime}`

  guideButton.onclick = () => {
    guidePanel.classList.toggle('hide')
  }
}

export const showGuide = () => {
  guidePanel.classList.remove('hide')
}
