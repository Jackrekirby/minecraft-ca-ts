import { Dict2D } from './containers/array2d'
import { Vec2, vec2Zero } from './containers/vec2'
import { Block, BlockContainer, BlockType } from './core/block'
import {
  commandFailure,
  commandInfo,
  commandLineVisibilityState,
  CommandManager,
  commandSuccess,
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
  setGlobal('tick', 0)
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
  let canSubUpdate = true

  const setSubUpdatesPerSecond = (x: number) => {
    subUpdatesPerSecond = Number(x)
    subUpdateTimeStep = subUpdatesPerSecond > 0 ? 1000 / subUpdatesPerSecond : 0
    localStorage.setItem('subUpdatesPerSecond', String(x))
  }

  const game = new Game(Number(updatesPerSecondValue), () => {
    let lastUpdateTime = 0
    let subtick = 0

    const runSubUpdate = (currentTime: number) => {
      let deltaTime = currentTime - lastUpdateTime

      if (
        canSubUpdate ||
        (subUpdateTimeStep > 0 && deltaTime >= subUpdateTimeStep)
      ) {
        canSubUpdate = false
        const didSubUpdate = subUpdateBlocks(blocks)

        if (subUpdateTimeStep === 0) {
          // only update the canvas if we are viewing subupdates
          updateCanvas()
        }
        lastUpdateTime = currentTime - (deltaTime % subUpdateTimeStep)
        if (isNaN(lastUpdateTime)) {
          lastUpdateTime = 0
        }

        if (!didSubUpdate) {
          // once subupdates complete process updates
          // console.log('update')
          subtick = 0
          setGlobal('subtick', subtick)

          updateBlocks(blocks)
          updateCanvas()
          game.setUpdateComplete()
          return
        } else {
          // console.log('subupdate')
          setGlobal('subtick', subtick)
          subtick += 1
        }
      }
      requestAnimationFrame(runSubUpdate)
    }
    requestAnimationFrame(runSubUpdate)
  })

  logBlocks(blocks)
  updateCanvas()

  initBlockEventListeners(canvas, blocks, updateCanvas, setGlobal)
  initCanvasResizeListener(updateCanvas)

  // load commands

  const commandManager = new CommandManager()

  commandManager.createCommand('/world load {name:string}', async input => {
    blocks.chunks = (await loadChunksFromStorage(false, true)).chunks
    updateCanvas()
    return commandSuccess(`loaded world ${input.name}`)
  })
  commandManager.createCommand('/world clear', async () => {
    blocks.chunks = (await loadChunksFromStorage(false, false)).chunks
    updateCanvas()
    return commandSuccess(`cleared world`)
  })
  commandManager.createCommand('/step tick', async () => {
    // updatesPerSecondInput.value = '0'
    game.setUpdatesPerSecond(0)
    game.allowTimeStep()
    setSubUpdatesPerSecond(1000)
    canSubUpdate = true
    return commandSuccess(
      `stepped tick to ${GLOBALS.tick.get()}.${GLOBALS.subtick.get()}`
    )
  })
  commandManager.createCommand('/step subtick', async () => {
    // subUpdatesPerSecondInput.value = '0'
    game.setUpdatesPerSecond(0)
    game.allowTimeStep()
    setSubUpdatesPerSecond(0)
    canSubUpdate = true
    return commandSuccess(
      `substepped tick to ${GLOBALS.tick.get()}.${GLOBALS.subtick.get()}`
    )
  })
  commandManager.createCommand(
    '/set updates_per_second {ups:float}',
    async input => {
      processUpdatesPerSecondInput(input.ups)
      return commandSuccess(`set updates per second ${input.ups}`)
    }
  )
  commandManager.createCommand(
    '/set subupdates_per_second {sups:float}',
    async input => {
      const sups = Number(input.sups)
      if (!isNaN(sups)) {
        setSubUpdatesPerSecond(sups)
        return commandSuccess(`set subupdates per second ${sups}`)
      } else {
        return commandFailure(`subupdates per second was not a number`)
      }
    }
  )

  commandManager.createCommand('/toggle debug_window', async input => {
    if (debugPanelState.get()) {
      debugPanelState.set(false)
      return commandSuccess('debug window hidden')
    } else {
      debugPanelState.set(true)
      return commandSuccess('debug window revealed')
    }
  })

  commandManager.createCommand(
    '/toggle command_line_visibility',
    async input => {
      if (commandLineVisibilityState.get()) {
        commandLineVisibilityState.set(false)
        return commandSuccess('command line hidden')
      } else {
        commandLineVisibilityState.set(true)
        return commandSuccess('command line revealed')
      }
    }
  )

  commandManager.createCommand(
    '/toggle output_command_success',
    async input => {
      if (commandManager.outputSuccessMessages.get()) {
        commandManager.outputSuccessMessages.set(false)
        return commandSuccess('command success messages hidden')
      } else {
        commandManager.outputSuccessMessages.set(true)
        return commandSuccess('command success messages revealed')
      }
    }
  )

  commandManager.createCommand('/clear command_output', async input => {
    commandManager.outputs.set([])
    return commandSuccess('cleared command output history')
  })

  commandManager.createCommand('/block list', async _ => {
    const blockList = (Object.values(BlockType) as String[]).join(', ')
    return commandInfo(`blocks: ${blockList}`)
  })

  commandManager.createCommand('/block pick {type:string}', async input => {
    if (isEnum<BlockType>(input.type as BlockType, Object.values(BlockType))) {
      setGlobal('selectedBlock', input.type)
      return commandSuccess(`picked block '${input.type}'`)
    } else {
      return commandFailure(`cannot pick invalid block '${input.type}'`)
    }
  })

  initCommandLineEventListeners(commandManager)

  game.startGameLoop()
}

main()
