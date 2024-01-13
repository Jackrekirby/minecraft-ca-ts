import { Dict2D } from './containers/array2d'
import { Vec2, vec2Zero } from './containers/vec2'
import { Block, BlockContainer, BlockType } from './core/block'
import {
  commandLineVisibilityState,
  CommandManager,
  initCommandLineEventListeners
} from './core/command_line'
import { debugPanelState, updateDebugInfo } from './core/debug_panel'
import { Game } from './core/game_loop'
import { GLOBALS } from './core/globals'
import {
  initBlockEventListeners,
  initCanvasResizeListener
} from './core/user_input'
import { loadChunksFromStorage } from './core/world_loading'
import { Canvas } from './rendering/canvas'
import { loadImages } from './rendering/image_loader'
import { areObjectsEqual, debounce, isEnum } from './utils/general'

// dom

const canvasElement = document.getElementById('canvas') as HTMLCanvasElement

const debouncedUpdateDebugInfo = debounce(() => {
  updateDebugInfo()
}, 500)

const setGlobal = (name: string, value: any) => {
  GLOBALS[name].set(value)
  debouncedUpdateDebugInfo()
}

const logBlocks = (blocks: BlockContainer) => {
  console.log(blocks)
}

const subUpdateBlocks = (blocks: BlockContainer) => {
  setGlobal('subtick', (GLOBALS.subtick.get() + 1) % 16)

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

const updateBlocks = (blocks: BlockContainer) => {
  setGlobal('tick', GLOBALS.tick.get() + 1)

  const newBlocks: BlockContainer = blocks.map((block: Block, v: Vec2) => {
    const newBlock: Block = block.update(v, blocks)
    return newBlock
  })

  blocks.clone(newBlocks)
  const blocksForStorage: Dict2D<Block> = blocks.mapToDict2D(
    (block: Block, v: Vec2) => {
      return block
    }
  )
  localStorage.setItem('chunks', JSON.stringify(blocksForStorage.items))
  // logBlocks(blocks)
}

const main = async () => {
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

      for (let i = 0; i < 1000; ++i) {
        if (!subUpdateBlocks(blocks)) {
          // console.log('subupdates', i)
          // if subupdates complete break out
          break
        }
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

  initBlockEventListeners(canvas, blocks, updateCanvas, setGlobal)
  initCanvasResizeListener()

  // load commands

  const commandManager = new CommandManager()

  commandManager.createCommand('/world load {name:string}', async input => {
    blocks.chunks = (await loadChunksFromStorage(false, true)).chunks
    updateCanvas()
    return `loaded world ${input.name}`
  })
  commandManager.createCommand('/world clear', async () => {
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
    '/set updates_per_second {ups:float}',
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
    if (debugPanelState.get()) {
      debugPanelState.set(false)
      return 'debug window hidden'
    } else {
      debugPanelState.set(true)
      return 'debug window revealed'
    }
  })

  commandManager.createCommand(
    '/toggle command_line_visibility',
    async input => {
      if (commandLineVisibilityState.get()) {
        commandLineVisibilityState.set(false)
        return 'command line hidden'
      } else {
        commandLineVisibilityState.set(true)
        return 'command line revealed'
      }
    }
  )

  commandManager.createCommand('/block list', async _ => {
    const blockList = (Object.values(BlockType) as String[]).join(', ')
    return `blocks: ${blockList}`
  })

  commandManager.createCommand('/block pick {type:string}', async input => {
    if (isEnum<BlockType>(input.type as BlockType, Object.values(BlockType))) {
      setGlobal('selectedBlock', input.type)
      return `picked block '${input.type}'`
    } else {
      return `cannot pick invalid block '${input.type}'`
    }
  })

  initCommandLineEventListeners(commandManager)

  game.startGameLoop()
}

main()
