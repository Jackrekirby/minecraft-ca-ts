export class Game {
  private lastUpdateTime: number = 0
  private updateTimeStep: number
  private updateCallback: () => void
  private canTimeStep: boolean = false
  private hasUpdateCompleted: boolean = true

  constructor (updatesPerSecond: number, updateCallback: () => void) {
    this.updateTimeStep = 1000 / updatesPerSecond
    this.updateCallback = updateCallback
    this.canTimeStep = false
  }

  setUpdateComplete () {
    this.hasUpdateCompleted = true
  }

  allowTimeStep () {
    this.canTimeStep = true
  }

  setUpdatesPerSecond (updatesPerSecond: number) {
    if (updatesPerSecond <= 0) {
      this.updateTimeStep = 0
    } else {
      this.updateTimeStep = 1000 / updatesPerSecond
    }
  }

  private update = (currentTime: number) => {
    if (this.hasUpdateCompleted) {
      let deltaTime = currentTime - this.lastUpdateTime

      if (
        this.canTimeStep ||
        (this.updateTimeStep > 0 && deltaTime >= this.updateTimeStep)
      ) {
        this.canTimeStep = false
        this.hasUpdateCompleted = false
        this.updateCallback()
        this.lastUpdateTime = currentTime - (deltaTime % this.updateTimeStep)
        if (isNaN(this.lastUpdateTime)) {
          this.lastUpdateTime = 0
        }
      }
    }

    requestAnimationFrame(this.update)
  }

  public startGameLoop = () => {
    requestAnimationFrame(this.update)
  }
}
