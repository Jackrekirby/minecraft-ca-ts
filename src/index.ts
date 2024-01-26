import { Air } from './blocks/air'
import { ChunkContainer, Dict2D, StringDict } from './containers/array2d'
import { Vec2, vec2Zero } from './containers/vec2'
import { Block, BlockContainer, BlockState, BlockType } from './core/block'
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
import {
  convertObjectToString,
  convertStringToObject,
  GLOBALS
} from './core/globals'
import {
  initBlockEventListeners,
  initCanvasResizeListener
} from './core/user_input'
import { loadChunks, loadWorldSave, placeAllBlocks } from './core/world_loading'
import { Canvas } from './rendering/canvas'
import { loadImages } from './rendering/image_loader'
import { areObjectsEqual, debounce, isEnum } from './utils/general'
import {
  compressObject,
  decompressObject,
  LocalStorageVariable
} from './utils/save'

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
  // const blocksForStorage: Dict2D<Block> = blocks.mapToDict2D(
  //   (block: Block, v: Vec2) => {
  //     return block
  //   }
  // )
  // localStorage.setItem('chunks', JSON.stringify(blocksForStorage.items))
  // logBlocks(blocks)
}

const createEmptyBlockContainer = () => {
  const blocks: BlockContainer = new ChunkContainer<Block>(
    16,
    () => new Air({}),
    (block: Block) => block.type === BlockType.Air,
    true
  )
  return blocks
}

const main = async () => {
  setGlobal('tick', 0)
  // const blocks = await loadChunksFromStorage()

  const createDemoWorld = async () => {
    const blocks: BlockContainer = createEmptyBlockContainer()
    const chunks = (await loadWorldSave()) as StringDict<Block>
    loadChunks(chunks, blocks)

    placeAllBlocks(blocks)
    return blocks
  }

  const createEmptyWorld = async () => {
    const blocks: BlockContainer = createEmptyBlockContainer()
    placeAllBlocks(blocks)
    return blocks
  }

  const blockStorage = new LocalStorageVariable<BlockContainer>({
    localStorageKey: 'world',
    defaultValue: await createDemoWorld(),
    valueToStorage: (blocks: BlockContainer) => {
      const blocksForStorage: Dict2D<Block> = blocks.mapToDict2D(
        (block: Block, v: Vec2) => {
          return block
        }
      )

      return compressObject(blocksForStorage.items)
    },
    storageToValue: (storage: string) => {
      const blocks: BlockContainer = createEmptyBlockContainer()
      const chunks = decompressObject(storage) as StringDict<Block>
      loadChunks(chunks, blocks)
      return blocks
    }
    // saveCallback: (value, storedValue) => {
    //   const valueMemory = JSON.stringify(value).length
    //   const storageMemory = storedValue.length
    //   console.log('saved chunks', {
    //     value,
    //     valueMemory: `${valueMemory / 1000} KB`,
    //     storageMemory: `${storageMemory / 1000} KB`,
    //     compression: `${Math.round((storageMemory / valueMemory) * 1000) / 10}%`
    //   })
    // }
  })

  const blocks = blockStorage.get()

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

  let subUpdateTimeStep = 0
  let canSubUpdate = true

  const game = new Game(0, () => {
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

        if (subUpdateTimeStep > 50 || subUpdateTimeStep === 0) {
          // only update the canvas if timestep > 50ms per frame (20fps)
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

  const updatesPerSecondState = new LocalStorageVariable<number>({
    defaultValue: 5,
    localStorageKey: 'updates-per-second',
    saveInterval: 0,
    setCallback: (ups: number) => {
      game.setUpdatesPerSecond(ups)
    }
  })

  // const updatesPerSecondState = createState<number>(
  //   5,
  //   'updates-per-second',
  //   (ups: number) => {
  //     game.setUpdatesPerSecond(ups)
  //   }
  // )

  const subupdatesPerSecondState = new LocalStorageVariable<number>({
    defaultValue: 100,
    localStorageKey: 'subupdates-per-second',
    saveInterval: 0,
    setCallback: (sups: number) => {
      subUpdateTimeStep = sups > 0 ? 1000 / sups : 0
    }
  })

  // const subupdatesPerSecondState = createState<number>(
  //   1000,
  //   'subupdates-per-second',
  //   (sups: number) => {
  //     subUpdateTimeStep = sups > 0 ? 1000 / sups : 0
  //   }
  // )

  logBlocks(blocks)
  updateCanvas()

  initBlockEventListeners(canvas, blocks, updateCanvas, setGlobal)
  initCanvasResizeListener(updateCanvas)

  // load commands

  const commandManager = new CommandManager()

  commandManager.createCommand('/world load {name:string}', async input => {
    blocks.clone(await createDemoWorld())
    // blocks.chunks = (await loadChunksFromStorage(false, true)).chunks
    updateCanvas()
    return commandSuccess(`loaded world ${input.name}`)
  })
  commandManager.createCommand('/world clear', async () => {
    // blocks.chunks = (await loadChunksFromStorage(false, false)).chunks
    blocks.clone(await createEmptyWorld())
    updateCanvas()
    return commandSuccess(`cleared world`)
  })
  commandManager.createCommand('/step tick', async () => {
    game.setUpdatesPerSecond(0)
    game.allowTimeStep()

    subupdatesPerSecondState.set(1000)
    canSubUpdate = true
    return commandSuccess(
      `stepped tick to ${GLOBALS.tick.get()}.${GLOBALS.subtick.get()}`
    )
  })
  commandManager.createCommand('/step subtick', async () => {
    game.setUpdatesPerSecond(0)
    game.allowTimeStep()
    subupdatesPerSecondState.set(0)
    canSubUpdate = true
    return commandSuccess(
      `substepped tick to ${GLOBALS.tick.get()}.${GLOBALS.subtick.get()}`
    )
  })

  document.addEventListener('keydown', event => {
    if (event.key === 'z') {
      game.setUpdatesPerSecond(0)
      game.allowTimeStep()
      subupdatesPerSecondState.set(0)
      canSubUpdate = true
    } else if (event.key === 'x') {
      game.setUpdatesPerSecond(0)
      game.allowTimeStep()
      subupdatesPerSecondState.set(1000)
      canSubUpdate = true
    } else if (event.key === 'c') {
      game.setUpdatesPerSecond(5)
      game.allowTimeStep()
      subupdatesPerSecondState.set(1000)
      canSubUpdate = true
    }
  })

  commandManager.createCommand(
    '/set updates_per_second {ups:float}',
    async input => {
      updatesPerSecondState.set(Number(input.ups))
      return commandSuccess(`set updates per second ${input.ups}`)
    }
  )
  commandManager.createCommand(
    '/set subupdates_per_second {sups:float}',
    async input => {
      const sups = Number(input.sups)
      if (!isNaN(sups)) {
        subupdatesPerSecondState.set(sups)
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
    const block = (convertStringToObject(input.type) as unknown) as BlockState
    if (isEnum<BlockType>(block.type as BlockType, Object.values(BlockType))) {
      setGlobal('selectedBlock', block)
      return commandSuccess(
        `picked block ${convertObjectToString(
          (block as unknown) as Record<string, string>
        )}`
      )
    } else {
      return commandFailure(
        `cannot pick invalid block ${convertObjectToString(
          (block as unknown) as Record<string, string>
        )}`
      )
    }
  })

  commandManager.createCommand(
    '/block pick {type:string} {meta:string}',
    async input => {
      const block = (convertStringToObject(
        `${input.type} ${input.meta}`
      ) as unknown) as BlockState
      console.log(block)
      if (
        isEnum<BlockType>(block.type as BlockType, Object.values(BlockType))
      ) {
        setGlobal('selectedBlock', block)
        return commandSuccess(
          `picked block ${convertObjectToString(
            (block as unknown) as Record<string, string>
          )}`
        )
      } else {
        return commandFailure(
          `cannot pick invalid block ${convertObjectToString(
            (block as unknown) as Record<string, string>
          )}`
        )
      }
    }
  )

  initCommandLineEventListeners(commandManager)

  game.startGameLoop()
}

const clearStorageOnVersionIncrease = () => {
  const latestVersion = 1
  const savedVersion = Number(localStorage.getItem('version'))

  if (isNaN(savedVersion) || savedVersion !== latestVersion) {
    console.log('cleared local storage', { latestVersion, savedVersion })
    localStorage.clear()
  }

  localStorage.setItem('version', JSON.stringify(latestVersion))
}

clearStorageOnVersionIncrease()

main()
