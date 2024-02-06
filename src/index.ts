import { vec2Zero } from './containers/vec2'
import { initialiseCommands } from './core/commands'
import {
  CommandManager,
  initCommandLineEventListeners,
  initialiseCommandLine,
  isCommandLineCurrentlyVisible
} from './core/command_line'
import { initialiseDebugPanel, updateDebugInfo } from './core/debug_panel'
import {
  createLogicLoop,
  ProcessLoop,
  RenderLoop,
  updateCanvasBlocks
} from './core/game_loop'
import { initialiseGuide, showGuide } from './core/guide'
import { initialiseInventory } from './core/inventory'
import {
  clearStorageOnVersionIncrease,
  initialiseStorage,
  storage
} from './core/storage'
import {
  initBlockEventListeners,
  initCanvasResizeListener
} from './core/user_input'
import { createDemoWorld } from './core/world_loading'
import { Canvas } from './rendering/canvas'
import { loadImages } from './rendering/image_loader'

const createCanvas = async (textureAtlas: Map<string, HTMLImageElement>) => {
  const canvasElement = document.getElementById('canvas') as HTMLCanvasElement
  const canvas = new Canvas(canvasElement, textureAtlas, 40, 1.05, vec2Zero())

  return canvas
}

const main = async () => {
  const reset = clearStorageOnVersionIncrease()
  initialiseStorage()
  initialiseDebugPanel()
  initialiseCommandLine()
  initialiseGuide()

  const textureAtlas: Map<string, HTMLImageElement> = await loadImages()
  initialiseInventory(textureAtlas)

  const canvas: Canvas = await createCanvas(textureAtlas)
  const blocks = storage.blockStorage.get()
  // placeAllBlocks(blocks)

  if (reset) {
    blocks.clone(await createDemoWorld())
    showGuide()
  }

  console.log(blocks)

  setInterval(() => {
    updateDebugInfo()
  }, 500)

  const { processLogic, addToTickQueue, fillUpdateQueue } = createLogicLoop(
    blocks,
    canvas
  )

  initBlockEventListeners(canvas, blocks, addToTickQueue)
  initCanvasResizeListener()

  // load commands

  const commandManager = new CommandManager()

  initialiseCommands(commandManager, blocks, canvas, fillUpdateQueue)

  initCommandLineEventListeners(commandManager)

  // initialise render and processing loop

  let elapsedFramesInSecond = 0
  setInterval(() => {
    storage.actualFramesPerSecondState.set(elapsedFramesInSecond)
    elapsedFramesInSecond = 0
  }, 1000)
  const renderLoop = new RenderLoop(storage.framesPerSecondState.get(), () => {
    canvas.render()
    elapsedFramesInSecond += 1
  })

  const logicLoop = new ProcessLoop(
    storage.updatesPerSecondState.get(),
    processLogic
  )

  storage.framesPerSecondState.setCallback = (x: number) => {
    renderLoop.setFrameRate(x)
    renderLoop.start()
  }

  storage.updatesPerSecondState.setCallback = (x: number) => {
    logicLoop.setFrameRate(x)
    logicLoop.start()
  }

  document.addEventListener('keydown', event => {
    if (isCommandLineCurrentlyVisible()) {
      return
    }
    if (event.key === 'z') {
      storage.viewSubTicksState.set(!storage.viewSubTicksState.get())
    } else if (event.key === 'x') {
      logicLoop.stop()
      storage.updatesPerSecondState.set(0)
      processLogic()
    } else if (event.key === 'c') {
      storage.updatesPerSecondState.set(5)
    } else if (event.key === 'v') {
      storage.updatesPerSecondState.set(9999)
    }
  })
  // TODO: do not need to update canvas blocks unless rendering
  updateCanvasBlocks(blocks, canvas)
  renderLoop.start()

  if (storage.updatesPerSecondState.get() > 0) {
    logicLoop.start()
  }
}

main()
// webglCanvas3()
