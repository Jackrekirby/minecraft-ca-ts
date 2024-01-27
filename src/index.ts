import { vec2Zero } from './containers/vec2'
import { initialiseCommands } from './core/commands'
import {
  CommandManager,
  initCommandLineEventListeners
} from './core/command_line'
import { updateDebugInfo } from './core/debug_panel'
import { createLogicLoop, ProcessLoop, RenderLoop } from './core/game_loop'
import {
  blockStorage,
  clearStorageOnVersionIncrease,
  framesPerSecondState,
  updatesPerSecondState,
  viewSubTicksState
} from './core/storage'
import {
  initBlockEventListeners,
  initCanvasResizeListener
} from './core/user_input'
import { placeAllBlocks } from './core/world_loading'
import { Canvas } from './rendering/canvas'
import { loadImages } from './rendering/image_loader'

// dom
const createCanvas = async () => {
  const canvasElement = document.getElementById('canvas') as HTMLCanvasElement
  const canvas = new Canvas(
    canvasElement,
    await loadImages(),
    40,
    1.05,
    vec2Zero()
  )

  return canvas
}

setInterval(() => {
  updateDebugInfo()
}, 500)

const main = async () => {
  clearStorageOnVersionIncrease()
  const canvas: Canvas = await createCanvas()
  const blocks = blockStorage.get()
  placeAllBlocks(blocks)

  console.log(blocks)

  initBlockEventListeners(canvas, blocks)
  initCanvasResizeListener()

  // load commands

  const commandManager = new CommandManager()

  initialiseCommands(commandManager, blocks)

  initCommandLineEventListeners(commandManager)

  // initialise render and processing loop

  const renderLoop = new RenderLoop(framesPerSecondState.get(), () => {
    canvas.render()
  })

  const runLogicLoop = createLogicLoop(blocks, canvas)
  const logicLoop = new ProcessLoop(updatesPerSecondState.get(), runLogicLoop)

  framesPerSecondState.setCallback = (x: number) => {
    renderLoop.setFrameRate(x)
    renderLoop.start()
  }

  updatesPerSecondState.setCallback = (x: number) => {
    logicLoop.setFrameRate(x)
    logicLoop.start()
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'z') {
      viewSubTicksState.set(!viewSubTicksState.get())
    } else if (event.key === 'x') {
      logicLoop.stop()
      runLogicLoop()
    } else if (event.key === 'c') {
      updatesPerSecondState.set(5)
    } else if (event.key === 'v') {
      updatesPerSecondState.set(100)
    }
  })

  renderLoop.start()
  logicLoop.start()
}

main()
