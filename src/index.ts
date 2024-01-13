import { Air } from './blocks/air'
import { GlassBlock } from './blocks/glass_block'
import { Piston } from './blocks/piston'
import { RedstoneBlock } from './blocks/redstone_block'
import { RedstoneLamp } from './blocks/redstone_lamp'
import { RedstoneTorch } from './blocks/redstone_torch'
import { ChunkContainer, Dict2D, StringDict } from './containers/array2d'
import { Vec2, vec2Apply, vec2Subtract, vec2Zero } from './containers/vec2'
import { Block, BlockContainer, BlockType } from './core/block'
import {
  CommandManager,
  initCommandLineEventListeners
} from './core/command_line'
import { Direction } from './core/direction'
import { Canvas } from './rendering/canvas'
import { loadImages } from './rendering/image_loader'
import { createBlock } from './utils/create_block'

// dom

const debugPanel = document.getElementById('debug-panel') as HTMLButtonElement

const canvasElement = document.getElementById('canvas') as HTMLCanvasElement

const resizeCanvas = () => {
  const context = canvasElement.getContext('2d')!
  const pixelRatio = window.devicePixelRatio || 1
  console.log(pixelRatio)
  canvasElement.width = canvasElement.clientWidth * pixelRatio
  canvasElement.height = canvasElement.clientHeight * pixelRatio
  context.imageSmoothingEnabled = false
}
resizeCanvas()

let resizeTimeout: NodeJS.Timeout
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    resizeCanvas()
  }, 200)
})

// main

interface GlobalValue<T> {
  set: (value: T) => void
  get: () => T
  display: () => string
}

const createGlobalValue = <T>(name: string, initialValue: T) => {
  let currentValue: T = initialValue
  const set = (value: T) => {
    currentValue = value
  }
  const get = () => {
    return currentValue
  }
  const display = () => `${name}: ${currentValue}`

  const state: GlobalValue<T> = { get, set, display }
  return state
}

const debounce = (callback: () => void, delay: number): (() => void) => {
  let timeoutId: NodeJS.Timeout
  let isPending = false

  return function () {
    if (isPending) {
      return
    }

    clearTimeout(timeoutId)

    isPending = true

    timeoutId = setTimeout(() => {
      callback()
      isPending = false
    }, delay)
  }
}

const GLOBALS: StringDict<GlobalValue<any>> = {
  build: createGlobalValue('BUILD', process.env.BUILD_TIME?.replace(',', '')),
  tick: createGlobalValue('TICK', 0),
  subtick: createGlobalValue('SUBTICK', 0)
}

const debouncedUpdateDebugInfo = debounce(() => {
  updateDebugInfo()
}, 500)

const setGlobal = (name: string, value: any) => {
  GLOBALS[name].set(value)
  debouncedUpdateDebugInfo()
}

const updateDebugInfo = () => {
  debugPanel.innerHTML = ''

  Object.values(GLOBALS).forEach(globalValue => {
    const item = document.createElement('div')
    item.textContent = globalValue.display()

    debugPanel.appendChild(item)
  })
}

const logBlocks = (blocks: BlockContainer) => {
  console.log(blocks)
}

const subUpdateBlocks = (blocks: BlockContainer) => {
  setGlobal('subtick', (GLOBALS.subtick.get() + 1) % 16)
  const newBlocks: BlockContainer = blocks.map((block: Block, v: Vec2) =>
    block.subupdate(v, blocks)
  )
  blocks.clone(newBlocks)
}

const updateBlocks = (blocks: BlockContainer) => {
  setGlobal('tick', GLOBALS.tick.get() + 1)
  const newBlocks: BlockContainer = blocks.map((block: Block, v: Vec2) =>
    block.update(v, blocks)
  )
  blocks.clone(newBlocks)
  const blocksForStorage: Dict2D<Block> = blocks.mapToDict2D(
    (block: Block, v: Vec2) => {
      return block
    }
  )
  localStorage.setItem('chunks', JSON.stringify(blocksForStorage.items))
  // logBlocks(blocks)
}

type ClickCallback = () => void

const addClickHandlerWithDragCheck = (
  element: HTMLElement,
  clickCallback: ClickCallback
): void => {
  let isDragging = false

  const mouseDownHandler = (_downEvent: MouseEvent) => {
    isDragging = false

    const mouseMoveHandler = (_moveEvent: MouseEvent) => {
      isDragging = true
    }

    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler)
      document.removeEventListener('mouseup', mouseUpHandler)

      if (!isDragging) {
        // Invoke the callback for a regular click
        clickCallback()
      }
    }

    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
  }

  element.addEventListener('mousedown', mouseDownHandler)
}

const loadChunksFromStorage = async (
  allowLocalStorage: boolean = true,
  allowWorldDemos: boolean = true
) => {
  const chunksRaw = localStorage.getItem('chunks')

  const blocks: BlockContainer = new ChunkContainer<Block>(
    16,
    () => new Air({}),
    (block: Block) => block.type === BlockType.Air,
    true
  )

  // console.log('chunksRaw', chunksRaw)

  const loadChunks = (chunks: StringDict<Block>) => {
    const chunkDict = new Dict2D(chunks)
    console.log(chunkDict)

    chunkDict.map((block: Block, v: Vec2) => {
      blocks.setValue(v, createBlock(block.type, block))
    })
  }

  if (chunksRaw && allowLocalStorage) {
    const chunks = JSON.parse(chunksRaw) as StringDict<Block>
    loadChunks(chunks)
  } else if (allowWorldDemos) {
    const chunks = (await loadWorldSave()) as StringDict<Block>
    loadChunks(chunks)
  }

  placeAllBlocks(blocks)

  return blocks
}

const main = async () => {
  console.log('main')

  const blocks = await loadChunksFromStorage()

  const canvas = new Canvas(
    canvasElement,
    await loadImages(),
    40,
    1.05,
    vec2Zero()
  )

  const updateCanvas = () => {
    const gridImages = blocks.mapToDict2D((block: Block, v: Vec2) => {
      return block.getTextureName(v, blocks)
    })
    canvas.setGridImages(gridImages)
    canvas.render()
  }

  let selectedBlockType: BlockType = BlockType.Air
  let previousSelectedBlockType: BlockType = BlockType.Air
  const placeBlock = () => {
    const p = canvas.getMouseWorldPosition()
    const pi = vec2Apply(p, Math.floor)

    const getPlacementDirection = (v: Vec2) => {
      if (Math.abs(v.x - 0.5) > Math.abs(v.y - 0.5)) {
        return v.x > 0.5 ? Direction.Right : Direction.Left
      } else {
        return v.y > 0.5 ? Direction.Up : Direction.Down
      }
    }

    const direction: Direction = getPlacementDirection(vec2Subtract(p, pi))

    const block = blocks.getValue(pi)

    if (block.type === BlockType.Air) {
      const newBlock = createBlock(selectedBlockType, { direction })
      blocks.setValue(pi, newBlock)
      blocks.setValue(pi, newBlock.update(pi, blocks))
      updateCanvas()
    } else {
      if (block.type != selectedBlockType) {
        previousSelectedBlockType = selectedBlockType
      }
      selectedBlockType = block.type
    }
    // console.log(p, pi, block)
  }
  addClickHandlerWithDragCheck(canvasElement, placeBlock)
  // canvasElement.addEventListener('click')

  canvasElement.addEventListener('dblclick', function (e: MouseEvent) {
    e.preventDefault()
    const p = canvas.getMouseWorldPosition()
    const pi = vec2Apply(p, Math.floor)
    blocks.setValue(pi, new Air({}))
    // on double click we also perform the single click action of selecting the
    // block we just deleted. Revert the selection
    selectedBlockType = previousSelectedBlockType
    updateCanvas()
  })

  document.addEventListener('keydown', event => {
    if (event.key === 'e') {
      const p = canvas.getMouseWorldPosition()
      const pi = vec2Apply(p, Math.floor)
      console.log(blocks.getValue(pi))
    }
  })

  // Updates Per Second

  const processUpdatesPerSecondInput = (value: string) => {
    const speed = Number(value)
    game.setUpdatesPerSecond(speed)
  }

  const updatesPerSecondValue = localStorage.getItem('updatesPerSecond') ?? 5

  // Sub-Updates Per Second
  const subUpdatesPerSecondValue =
    localStorage.getItem('subUpdatesPerSecond') ?? 1000

  let subUpdatesPerSecond: number = Number(subUpdatesPerSecondValue)
  let subUpdateTimeStep =
    subUpdatesPerSecond > 0 ? 1000 / subUpdatesPerSecond : 0
  let canSubUpdate = false

  const setSubUpdatesPerSecond = (x: number) => {
    subUpdatesPerSecond = Number(x)
    subUpdateTimeStep = subUpdatesPerSecond > 0 ? 1000 / subUpdatesPerSecond : 0
    localStorage.setItem('subUpdatesPerSecond', String(x))
  }

  const game = new Game(Number(updatesPerSecondValue), () => {
    let lastUpdateTime = 0

    let iteration = 0
    // console.log('help', { canSubUpdate, subUpdateTimeStep })

    if (subUpdateTimeStep < 10) {
      // if subUpdateTimeStep very fast then just loop through subupdates
      // as quickly as possible

      for (let i = 0; i < 16; ++i) {
        subUpdateBlocks(blocks)
      }
      updateBlocks(blocks)
      updateCanvas()
      game.setUpdateComplete()
      return
    }

    const runSubUpdate = (currentTime: number) => {
      let deltaTime = currentTime - lastUpdateTime

      if (
        canSubUpdate ||
        (subUpdateTimeStep > 0 && deltaTime >= subUpdateTimeStep)
      ) {
        canSubUpdate = false
        subUpdateBlocks(blocks)

        if (subUpdateTimeStep === 0) {
          // only update the canvas if we are viewing subupdates
          updateCanvas()
        }
        lastUpdateTime = currentTime - (deltaTime % subUpdateTimeStep)
        if (isNaN(lastUpdateTime)) {
          lastUpdateTime = 0
        }

        iteration += 1
        if (iteration < 16) {
          // console.log('subupdate', iteration)
        } else {
          // console.log('update')
          updateBlocks(blocks)
          updateCanvas()
          game.setUpdateComplete()
          return
        }
      }
      requestAnimationFrame(runSubUpdate)
    }
    requestAnimationFrame(runSubUpdate)
  })

  logBlocks(blocks)
  updateCanvas()

  // load commands

  const commandManager = new CommandManager()

  commandManager.createCommand('/load_world {name:string}', async input => {
    blocks.chunks = (await loadChunksFromStorage(false, true)).chunks
    updateCanvas()
    return `loaded world ${input.name}`
  })
  commandManager.createCommand('/clear_world', async () => {
    blocks.chunks = (await loadChunksFromStorage(false, false)).chunks
    updateCanvas()
    return `cleared world`
  })
  commandManager.createCommand('/step tick', async () => {
    // updatesPerSecondInput.value = '0'
    game.setUpdatesPerSecond(0)
    game.allowTimeStep()
    return `stepped tick to ${GLOBALS.subtick.get()}`
  })
  commandManager.createCommand('/step subtick', async () => {
    // subUpdatesPerSecondInput.value = '0'
    setSubUpdatesPerSecond(0)
    canSubUpdate = true
    return `stepped subtick to ${GLOBALS.subtick.get()}`
  })
  commandManager.createCommand(
    '/set updates per second {ups:float}',
    async input => {
      processUpdatesPerSecondInput(input.ups)
      return `set updates per second ${input.ups}`
    }
  )
  commandManager.createCommand(
    '/set subupdates_per_second {sups:float}',
    async input => {
      const sups = Number(input.sups)
      if (!isNaN(sups)) {
        setSubUpdatesPerSecond(sups)
        return `set subupdates per second ${sups}`
      } else {
        return `subupdates per second was not a number`
      }
    }
  )
  commandManager.createCommand('/toggle debug_window', async input => {
    if (debugPanel.style.display == 'none') {
      debugPanel.style.display = ''
      return 'debug window displayed'
    } else {
      debugPanel.style.display = 'none'
      return 'debug window hidden'
    }
  })

  initCommandLineEventListeners(commandManager)

  game.startGameLoop()
}

const placeAllBlocks = (blocks: BlockContainer) => {
  blocks.setValue({ x: 0, y: 0 }, new RedstoneBlock({}))

  blocks.setValue({ x: 2, y: 0 }, new RedstoneTorch({}))

  blocks.setValue({ x: 4, y: 0 }, new RedstoneLamp({}))

  blocks.setValue({ x: 6, y: 0 }, new Piston({}))

  blocks.setValue({ x: 8, y: 0 }, new GlassBlock({}))
}

const loadWorldSave = async () => {
  try {
    const response = await fetch('saves/world1.json')

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const jsonData = await response.json()
    console.log('JSON data:', jsonData)
    return jsonData
  } catch (error) {
    console.error('Error fetching JSON:', error)
  }
}

class Game {
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

main()
