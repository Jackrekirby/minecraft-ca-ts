import { Air } from '../blocks/air'
import { ConcretePowder, GravityMotion } from '../blocks/concrete_powder'
import { Dict2D } from '../containers/array2d'
import { Vec2 } from '../containers/vec2'
import { Canvas, CanvasGridItem } from '../rendering/canvas'
import { areObjectsEqual, now, sleep } from '../utils/general'
import { Block, BlockContainer, BlockType, isBlock } from './block'
import { clearFallingBlocksRequested } from './commands'
import { storage } from './storage'

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
    const fnc: FrameRequestCallback = async (elapsedMilliseconds: number) => {
      if (this.stopRequested) {
        this.isRunning = false
      }
      const deltaMilliseconds = elapsedMilliseconds - lastElapsedMilliseconds
      if (deltaMilliseconds > this.targetFramePeriodMilliseconds) {
        const overshoot = deltaMilliseconds - this.targetFramePeriodMilliseconds
        this.callback(deltaMilliseconds)
        lastElapsedMilliseconds = elapsedMilliseconds - overshoot
      } else {
        const remainingTimeMilliseconds =
          this.targetFramePeriodMilliseconds - deltaMilliseconds

        await sleep(Math.max(remainingTimeMilliseconds - 5, 0))
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
    this.targetFramePeriodMilliseconds = Math.floor(1000 / frameRate)
    this.callback = callback
    this.isRunning = false
  }

  public stop () {
    this.stopRequested = true
  }

  public setFrameRate (frameRate: number) {
    this.targetFramePeriodMilliseconds = Math.floor(1000 / frameRate)
  }

  public async start () {
    if (this.isRunning) return

    this.isRunning = true
    this.stopRequested = false
    let lastSleepTime = now()
    let lastTimeMilliseconds = now()
    while (!this.stopRequested) {
      const currentTimeMilliseconds = now()
      const deltaMilliseconds = currentTimeMilliseconds - lastTimeMilliseconds
      if (deltaMilliseconds > this.targetFramePeriodMilliseconds) {
        const overshoot = Math.min(
          deltaMilliseconds - this.targetFramePeriodMilliseconds,
          this.targetFramePeriodMilliseconds
        ) // set max overshoot to frame period so overshoot does not elapse
        this.callback(deltaMilliseconds)
        lastTimeMilliseconds = currentTimeMilliseconds - overshoot

        const timeSinceLastSlept = now() - lastSleepTime
        const framePeriod = 1000 / storage.framesPerSecondState.get()
        if (timeSinceLastSlept > framePeriod) {
          await sleep(0)
          lastSleepTime = now()
        }
      } else {
        const remainingTimeMilliseconds =
          this.targetFramePeriodMilliseconds - deltaMilliseconds
        await sleep(Math.max(remainingTimeMilliseconds - 5, 0))
        lastSleepTime = now()
      }
    }
    this.isRunning = false
  }
}

export const updateCanvasBlocks = (blocks: BlockContainer, canvas: Canvas) => {
  const gridImages: Dict2D<CanvasGridItem> = blocks.mapToDict2D(
    (block: Block, v: Vec2) => {
      return block.getTextureName(v, blocks)
    }
  )
  canvas.setGridImages(gridImages)
}

const vecToStr = (v: Vec2): string => `${v.x} ${v.y}`
const strToVec = (v: string): Vec2 => {
  let [x, y] = v.split(' ')
  return { x: Number(x), y: Number(y) }
}

const addToUpdateQueue = (queue: Set<string>, v: Vec2) => {
  queue.add(vecToStr(v))
  queue.add(vecToStr({ x: v.x + 1, y: v.y }))
  queue.add(vecToStr({ x: v.x - 1, y: v.y }))
  queue.add(vecToStr({ x: v.x, y: v.y + 1 }))
  queue.add(vecToStr({ x: v.x, y: v.y - 1 }))
}

type BlockVec = { v: Vec2; block: Block }
export const subUpdateBlocksWithQueue = (
  blocks: BlockContainer,
  updateQueue: Set<string>
) => {
  const newUpdateQueue = new Set<string>()

  const innerFunction = (block: Block, v: Vec2) => {
    // console.log('subUpdate', block, v)
    const newBlock: Block = block.subupdate(v, blocks)
    if (!areObjectsEqual(block, newBlock)) {
      // console.log('adding to queue', v)
      addToUpdateQueue(newUpdateQueue, v)
    }
    return newBlock
  }

  const newBlocks: BlockVec[] = []
  for (const vs of updateQueue) {
    const v: Vec2 = strToVec(vs)
    const oldblock: Block = blocks.getValue(v)
    const block: Block = innerFunction(oldblock, v)
    newBlocks.push({ v, block })
  }

  for (const { v, block } of newBlocks) {
    blocks.setValue(v, block)
  }

  return newUpdateQueue
}

export const updateBlocksWithQueue = (
  blocks: BlockContainer,
  updateQueue: Set<string>
) => {
  const newUpdateQueue = new Set<string>()
  const clearFallingSand = clearFallingBlocksRequested.get()

  const innerFunction = (block: Block, v: Vec2) => {
    let newBlock: Block = block.update(v, blocks)
    if (
      clearFallingSand &&
      isBlock<ConcretePowder>(newBlock, BlockType.ConcretePowder) &&
      newBlock.gravityMotion === GravityMotion.Falling
    ) {
      newBlock = new Air({})
    }

    if (!areObjectsEqual(block, newBlock)) {
      addToUpdateQueue(newUpdateQueue, v)
    }
    return newBlock
  }

  const newBlocks: BlockVec[] = []
  for (const vs of updateQueue) {
    const v: Vec2 = strToVec(vs)
    const oldblock: Block = blocks.getValue(v)
    const block: Block = innerFunction(oldblock, v)
    newBlocks.push({ v, block })
  }

  if (clearFallingBlocksRequested.get()) {
    clearFallingBlocksRequested.set(false)
  }

  for (const { v, block } of newBlocks) {
    blocks.setValue(v, block)
  }

  return newUpdateQueue
}

const appendSet = <T>(set1: Set<T>, set2: Set<T>) => {
  for (const element of set2) {
    set1.add(element)
  }
}

export const createLogicLoop = (blocks: BlockContainer, canvas: Canvas) => {
  let subtick = 0
  let tick = 0
  let elapsedTicksInSecond = 0
  let elapsedSubticksInSecond = 0

  let elapsedUpdatesInSecond = 0

  const queues = {
    tick: new Set<string>(),
    subtick: new Set<string>()
  }

  const fillUpdateQueue = () => {
    ;(queues.tick = new Set<string>()), (queues.subtick = new Set<string>())
    for (const v of blocks.getPositions()) {
      queues.tick.add(vecToStr(v))
      queues.subtick.add(vecToStr(v))
    }
  }

  fillUpdateQueue()

  console.log('queue', queues)

  setInterval(() => {
    storage.actualTicksPerSecondState.set(elapsedTicksInSecond)
    storage.actualSubticksPerSecondState.set(elapsedSubticksInSecond)
    storage.actualUpdatesPerSecondState.set(elapsedUpdatesInSecond)
    elapsedTicksInSecond = 0
    elapsedSubticksInSecond = 0
    elapsedUpdatesInSecond = 0
  }, 1000)

  // queue items from a tick need to go to next tick and subtick
  // queue items from a subtick become the next subtick queue AND need to be appended to tick quue

  const processLogic = () => {
    let combinedUpdateQueue: Set<string>
    if (storage.viewSubTicksState.get()) {
      // process one subtick or one tick before updating canvas blocks
      if (queues.subtick.size > 0) {
        // while there are subticks process them
        elapsedUpdatesInSecond += queues.subtick.size
        combinedUpdateQueue = queues.subtick
        queues.subtick = subUpdateBlocksWithQueue(blocks, queues.subtick)

        appendSet(queues.tick, queues.subtick)
        subtick += 1
        elapsedSubticksInSecond += 1
        storage.subtickState.set(subtick)
      } else {
        // TODO: combinedUpdateQueue can just be made from tick queue as tick queue
        // already has subtick queue appended
        combinedUpdateQueue = new Set([...queues.subtick, ...queues.tick])
        elapsedUpdatesInSecond += combinedUpdateQueue.size
        queues.subtick = updateBlocksWithQueue(blocks, combinedUpdateQueue)
        queues.tick = new Set([...queues.subtick])

        elapsedTicksInSecond += 1
        tick += 1
        storage.tickState.set(tick)
        subtick = 0
      }
    } else {
      // process all subticks without updating canvas
      elapsedUpdatesInSecond += queues.subtick.size
      queues.subtick = subUpdateBlocksWithQueue(blocks, queues.subtick)
      appendSet(queues.tick, queues.subtick)
      elapsedUpdatesInSecond += queues.subtick.size
      subtick += 1
      elapsedSubticksInSecond += 1
      while (queues.subtick.size > 0) {
        elapsedUpdatesInSecond += queues.subtick.size
        queues.subtick = subUpdateBlocksWithQueue(blocks, queues.subtick)
        appendSet(queues.tick, queues.subtick)

        subtick += 1
        elapsedSubticksInSecond += 1
      }

      storage.subtickState.set(subtick)
      storage.tickState.set(tick)

      combinedUpdateQueue = new Set([...queues.subtick, ...queues.tick])
      elapsedUpdatesInSecond += combinedUpdateQueue.size
      queues.subtick = updateBlocksWithQueue(blocks, combinedUpdateQueue)
      queues.tick = new Set([...queues.subtick])

      subtick = 0
      tick += 1
      elapsedTicksInSecond += 1
    }

    // console.log(combinedUpdateQueue.size)
    // const updateCanvasBlocks2 = () => {
    //   for (const vs of combinedUpdateQueue) {
    //     const v: Vec2 = strToVec(vs)
    //     const block: Block = blocks.getValue(v)
    //     if (block.type !== BlockType.Air) {
    //       canvas.imageGrid.setValue(v, block.getTextureName(v, blocks))
    //     }
    //     // console.log(v, block)
    //   }
    // }
    // updateCanvasBlocks2()
    updateCanvasBlocks(blocks, canvas)
  }
  return {
    processLogic,
    addToTickQueue: (v: Vec2) => {
      addToUpdateQueue(queues.tick, v)
      addToUpdateQueue(queues.subtick, v)
    },
    fillUpdateQueue
  }
}
