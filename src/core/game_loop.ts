import { Air } from '../blocks/air'
import { ConcretePowder, GravityMotion } from '../blocks/concrete_powder'
import { Vec2 } from '../containers/vec2'
import { Canvas } from '../rendering/canvas'
import { areObjectsEqual, sleep } from '../utils/general'
import { Block, BlockContainer, BlockType, isBlock } from './block'
import { clearFallingBlocksRequested } from './commands'
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
    let lastTimeMilliseconds = Math.floor(performance.now())
    while (!this.stopRequested) {
      const currentTimeMilliseconds = Math.floor(performance.now())
      const deltaMilliseconds = currentTimeMilliseconds - lastTimeMilliseconds
      if (deltaMilliseconds > this.targetFramePeriodMilliseconds) {
        const overshoot = deltaMilliseconds - this.targetFramePeriodMilliseconds

        this.callback(deltaMilliseconds)
        lastTimeMilliseconds = currentTimeMilliseconds - overshoot
        await sleep(0)
      } else {
        const remainingTimeMilliseconds =
          this.targetFramePeriodMilliseconds - deltaMilliseconds

        await sleep(Math.max(remainingTimeMilliseconds - 5, 0))
      }
    }
    this.isRunning = false
  }
}

export const subUpdateBlocks = (blocks: BlockContainer) => {
  let anyBlocksUpdated = false

  const innerFunction = (block: Block, v: Vec2) => {
    const newBlock: Block = block.subupdate(v, blocks)
    if (!areObjectsEqual(block, newBlock)) {
      anyBlocksUpdated = true
    }
    return newBlock
  }

  const newBlocks: BlockContainer = blocks.map(innerFunction)
  blocks.clone(newBlocks)

  return anyBlocksUpdated
}

export const updateBlocks = (blocks: BlockContainer) => {
  const clearFallingSand = clearFallingBlocksRequested.get()

  const newBlocks: BlockContainer = blocks.map((block: Block, v: Vec2) => {
    const newBlock: Block = block.update(v, blocks)
    if (
      clearFallingSand &&
      isBlock<ConcretePowder>(newBlock, BlockType.ConcretePowder) &&
      newBlock.gravityMotion === GravityMotion.Falling
    ) {
      return new Air({})
    }
    return newBlock
  })

  if (clearFallingBlocksRequested.get()) {
    clearFallingBlocksRequested.set(false)
  }

  blocks.clone(newBlocks)
}

export const updateCanvasBlocks = (blocks: BlockContainer, canvas: Canvas) => {
  const gridImages = blocks.mapToDict2D((block: Block, v: Vec2) => {
    return block.getTextureName(v, blocks)
  })
  canvas.setGridImages(gridImages)
}

export const createLogicLoop1 = (blocks: BlockContainer, canvas: Canvas) => {
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

  // console.log({
  //   x: 'sub',
  //   updateQueue,
  //   newUpdateQueue
  // })

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

  // console.log({
  //   x: 'full',
  //   updateQueue,
  //   newUpdateQueue
  // })

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

  console.log('queues', queues)

  setInterval(() => {
    actualTicksPerSecondState.set(elapsedTicksInSecond)
    actualSubticksPerSecondState.set(elapsedSubticksInSecond)
    elapsedTicksInSecond = 0
    elapsedSubticksInSecond = 0
  }, 1000)

  // queue items from a tick need to go to next tick and subtick
  // queue items from a subtick become the next subtick queue AND need to be appended to tick quue

  const processLogic = () => {
    if (viewSubTicksState.get()) {
      // process one subtick or one tick before updating canvas blocks
      if (queues.subtick.size > 0) {
        // while there are subticks process them
        queues.subtick = subUpdateBlocksWithQueue(blocks, queues.subtick)
        appendSet(queues.tick, queues.subtick)
        subtick += 1
        elapsedSubticksInSecond += 1
        subtickState.set(subtick)
      } else {
        const combinedUpdateQueue = new Set([...queues.subtick, ...queues.tick])
        queues.subtick = updateBlocksWithQueue(blocks, combinedUpdateQueue)
        queues.tick = new Set([...queues.subtick])

        elapsedTicksInSecond += 1
        tick += 1
        tickState.set(tick)
        subtick = 0
      }
    } else {
      // process all subticks without updating canvas
      queues.subtick = subUpdateBlocksWithQueue(blocks, queues.subtick)
      appendSet(queues.tick, queues.subtick)
      subtick += 1
      elapsedSubticksInSecond += 1
      while (queues.subtick.size > 0) {
        queues.subtick = subUpdateBlocksWithQueue(blocks, queues.subtick)
        appendSet(queues.tick, queues.subtick)
        subtick += 1
        elapsedSubticksInSecond += 1
      }

      subtickState.set(subtick)
      tickState.set(tick)

      const combinedUpdateQueue = new Set([...queues.subtick, ...queues.tick])
      queues.subtick = updateBlocksWithQueue(blocks, combinedUpdateQueue)
      queues.tick = new Set([...queues.subtick])

      subtick = 0
      tick += 1
      elapsedTicksInSecond += 1
    }

    // console.log(
    //   'queues',
    //   queues.tick.size,
    //   Object.keys(blocks.chunks).length * 256
    // )
    updateCanvasBlocks(blocks, canvas)
  }
  return {
    processLogic,
    addToTickQueue: (v: Vec2) => {
      addToUpdateQueue(queues.tick, v)
    },
    fillUpdateQueue
  }
}
