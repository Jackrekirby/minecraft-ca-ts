import { Vec2 } from '../containers/vec2'
import { Canvas } from '../rendering/canvas'
import { areObjectsEqual, sleep } from '../utils/general'
import { Block, BlockContainer } from './block'
import {
  actualSubticksPerSecondState,
  actualTicksPerSecondState,
  subtickState,
  tickState,
  viewSubTicksState
} from './storage'

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

export const startRenderLoop = (
  targetFrameRate: { get: () => number },
  callback: (deltaMilliseconds: number) => void
) => {
  let lastElapsedMilliseconds = 0
  let deltaMilliseconds = 0
  const fnc: FrameRequestCallback = (elapsedMilliseconds: number) => {
    deltaMilliseconds += elapsedMilliseconds - lastElapsedMilliseconds
    const targetFramePeriodMilliseconds = 1000 / targetFrameRate.get()
    if (deltaMilliseconds > targetFramePeriodMilliseconds) {
      callback(deltaMilliseconds)
      deltaMilliseconds = 0
    }
    lastElapsedMilliseconds = elapsedMilliseconds
    requestAnimationFrame(fnc)
  }
  requestAnimationFrame(fnc)
}

export const startLoop = async (
  targetFrameRate: { get: () => number },
  callback: (deltaMilliseconds: number) => void
) => {
  let lastTimeMilliseconds = performance.now()
  // let frames = 0
  // setInterval(() => {
  //   console.log({ frames })
  //   frames  0
  // }, 1000)

  while (true) {
    const currentTimeMilliseconds = performance.now()
    const deltaMilliseconds = currentTimeMilliseconds - lastTimeMilliseconds
    const targetFramePeriodMilliseconds = 1000 / targetFrameRate.get()
    if (deltaMilliseconds > targetFramePeriodMilliseconds) {
      callback(deltaMilliseconds)
      // frames += 1
      lastTimeMilliseconds = currentTimeMilliseconds
      await sleep(0)
    } else {
      await sleep(deltaMilliseconds)
    }
  }
}

export class RenderLoop {
  stopRequested: boolean
  targetFramePeriodMilliseconds: number
  callback: (deltaMilliseconds: number) => void
  isRunning: boolean

  constructor (
    frameRate: number,
    callback: (deltaMilliseconds: number) => void
  ) {
    this.stopRequested = false
    this.targetFramePeriodMilliseconds = 1000 / frameRate
    this.callback = callback
    this.isRunning = false
  }

  public stop () {
    this.stopRequested = true
  }

  public setFrameRate (frameRate: number) {
    this.targetFramePeriodMilliseconds = 1000 / frameRate
  }

  public async start () {
    if (this.isRunning) return
    this.isRunning = true
    this.stopRequested = false
    let lastElapsedMilliseconds = 0
    const fnc: FrameRequestCallback = (elapsedMilliseconds: number) => {
      if (this.stopRequested) {
        this.isRunning = false
      }
      const deltaMilliseconds = elapsedMilliseconds - lastElapsedMilliseconds
      if (deltaMilliseconds > this.targetFramePeriodMilliseconds) {
        this.callback(deltaMilliseconds)
        lastElapsedMilliseconds = elapsedMilliseconds
      }

      requestAnimationFrame(fnc)
    }

    requestAnimationFrame(fnc)
  }
}

export class ProcessLoop {
  stopRequested: boolean
  targetFramePeriodMilliseconds: number
  callback: (deltaMilliseconds: number) => void
  isRunning: boolean

  constructor (
    frameRate: number,
    callback: (deltaMilliseconds: number) => void
  ) {
    this.stopRequested = false
    this.targetFramePeriodMilliseconds = 1000 / frameRate
    this.callback = callback
    this.isRunning = false
  }

  public stop () {
    this.stopRequested = true
  }

  public setFrameRate (frameRate: number) {
    this.targetFramePeriodMilliseconds = 1000 / frameRate
  }

  public async start () {
    if (this.isRunning) return
    this.isRunning = true
    this.stopRequested = false
    let lastTimeMilliseconds = performance.now()
    while (!this.stopRequested) {
      const currentTimeMilliseconds = performance.now()
      const deltaMilliseconds = currentTimeMilliseconds - lastTimeMilliseconds
      if (deltaMilliseconds > this.targetFramePeriodMilliseconds) {
        this.callback(deltaMilliseconds)
        lastTimeMilliseconds = currentTimeMilliseconds
        await sleep(0)
      } else {
        await sleep(deltaMilliseconds)
      }
    }
    this.isRunning = false
  }
}

export const subUpdateBlocks = (blocks: BlockContainer) => {
  let anyBlocksUpdated = false
  const newBlocks: BlockContainer = blocks.map((block: Block, v: Vec2) => {
    const newBlock: Block = block.subupdate(v, blocks)
    if (!areObjectsEqual(block, newBlock)) {
      anyBlocksUpdated = true
    }
    return newBlock
  })

  blocks.clone(newBlocks)

  return anyBlocksUpdated
}

export const updateBlocks = (blocks: BlockContainer) => {
  const newBlocks: BlockContainer = blocks.map((block: Block, v: Vec2) => {
    const newBlock: Block = block.update(v, blocks)
    return newBlock
  })

  blocks.clone(newBlocks)
}

export const updateCanvasBlocks = (blocks: BlockContainer, canvas: Canvas) => {
  const gridImages = blocks.mapToDict2D((block: Block, v: Vec2) => {
    return block.getTextureName(v, blocks)
  })
  canvas.setGridImages(gridImages)
}

export const createLogicLoop = (blocks: BlockContainer, canvas: Canvas) => {
  let subtick = 0
  let tick = 0
  let elapsedTicksInSecond = 0
  let elapsedSubticksInSecond = 0
  let didSubUpdate = true

  setInterval(() => {
    actualTicksPerSecondState.set(elapsedTicksInSecond)
    actualSubticksPerSecondState.set(elapsedSubticksInSecond)
    elapsedTicksInSecond = 0
    elapsedSubticksInSecond = 0
  }, 1000)

  const processLogic = () => {
    if (viewSubTicksState.get()) {
      // process one subtick or one tick before updating canvas blocks
      if (didSubUpdate) {
        // while there are subticks process them
        didSubUpdate = subUpdateBlocks(blocks)
        subtick += 1
        elapsedSubticksInSecond += 1
        subtickState.set(subtick)
      } else {
        updateBlocks(blocks)
        didSubUpdate = true
        elapsedTicksInSecond += 1
        tick += 1
        tickState.set(tick)
        subtick = 0
      }
    } else {
      // process all subticks without updating canvas
      let didSubUpdate = subUpdateBlocks(blocks)
      subtick += 1
      elapsedSubticksInSecond += 1
      while (didSubUpdate) {
        didSubUpdate = subUpdateBlocks(blocks)
        subtick += 1
        elapsedSubticksInSecond += 1
      }

      subtickState.set(subtick)
      tickState.set(tick)

      updateBlocks(blocks)

      subtick = 0
      tick += 1
      elapsedTicksInSecond += 1
    }

    updateCanvasBlocks(blocks, canvas)
  }
  return processLogic
}
