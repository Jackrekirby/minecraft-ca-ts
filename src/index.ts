import { Block, BlockContainer, BlockType } from './block'
import { Air } from './blocks/air'
import { GlassBlock } from './blocks/glass_block'
import { Piston } from './blocks/piston'
import { PistonHead } from './blocks/piston_head'
import { RedstoneBlock } from './blocks/redstone_block'
import { RedstoneLamp } from './blocks/redstone_lamp'
import { RedstoneTorch } from './blocks/redstone_torch'
import { ChunkContainer, Dict2D, StringDict } from './containers/array2d'
import { Vec2, vec2Apply, vec2Subtract, vec2Zero } from './containers/vec2'
import { Direction } from './direction'
import { Canvas } from './rendering/canvas'
import { loadImages } from './rendering/image_loader'
import {
  CommandManager,
  initCommandLineEventListeners
} from './utils/command_line'
import { createBlock } from './utils/create_block'
import { zipArrays } from './utils/general'

// dom

// const debugButton = document.getElementById('debug-button') as HTMLButtonElement

const debugPanel = document.getElementById('debug-panel') as HTMLButtonElement

// debugButton.onclick = () => {
//   debugPanel.style.display = debugPanel.style.display == 'none' ? '' : 'none'
// }

const commandLine = document.getElementById('command-line') as HTMLInputElement
const commandList = document.getElementById('command-list') as HTMLDivElement

interface Command {
  pattern: string
  callback: (inputs: StringDict<string>) => void
}

const createCommand = (
  pattern: string,
  callback: (inputs: StringDict<string>) => void
) => {
  return { pattern, callback }
}

function replacePlaceholders (input: string) {
  return input.replace(/\{[^}]+\}/g, '?')
}

const commands: Command[] = []
const commandHistory: string[] = []

function parseCommand (input: string) {
  for (const command of commands) {
    const commandParts = command.pattern.split(' ')
    const inputParts = input.split(' ')

    const findCommandAndGetInputs = () => {
      const inputs: StringDict<string> = {}
      for (const [commandPart, inputPart] of zipArrays(
        commandParts,
        inputParts
      )) {
        if (commandPart[0] != '{') {
          if (commandPart !== inputPart) {
            return null
          }
        } else {
          const input_name = commandPart.split(':')[0].slice(1)
          const input_value = inputPart
          inputs[input_name] = input_value
        }
      }
      return inputs
    }

    const inputs = findCommandAndGetInputs()
    if (inputs) {
      console.log(command, inputs)
      const newCommandHistory = commandHistory.filter(item => item !== input)
      commandHistory.length = 0
      commandHistory.push(input)
      commandHistory.push(...newCommandHistory)
      console.log(commandHistory)
      command.callback(inputs)
    }
  }
}

function buildCommandItems () {
  commandList.innerHTML = ''

  const viableCommands = commands.filter(command => {
    if (commandLine.value !== '') {
      const commandParts = command.pattern.split(' ')
      const inputParts = commandLine.value.split(' ')

      for (let i = 0; i < inputParts.length - 1; i++) {
        const commandPart = commandParts[i]
        const inputPart = inputParts[i]
        if (commandPart[0] != '{') {
          if (commandPart !== inputPart) {
            return false
          }
        }
      }

      const commandPart = commandParts[inputParts.length - 1]
      const inputPart = inputParts[inputParts.length - 1]
      if (commandPart[0] != '{') {
        if (!commandPart.startsWith(inputPart)) {
          return false
        }
      }
    }
    return true
  })

  // console.log('buildCommandItems', commandLine.value, viableCommands)

  viableCommands.forEach(command => {
    const commandItem = document.createElement('div')
    commandItem.classList.add('command-item')
    commandItem.textContent = command.pattern
    commandItem.onclick = () => {
      commandLine.value = replacePlaceholders(command.pattern)
      // commandList.style.display = 'none'
      commandLine.focus()
      // Set cursor position at the end of the string
      const inputValueLength = commandLine.value.length
      commandLine.setSelectionRange(inputValueLength, inputValueLength)
    }
    commandList.appendChild(commandItem)
  })
}

function buildCommandHistory () {
  commandList.innerHTML = ''

  commandHistory.forEach(command => {
    const commandItem = document.createElement('div')
    commandItem.classList.add('command-item')
    commandItem.textContent = command
    commandItem.onclick = () => {
      commandLine.value = command
      // commandList.style.display = 'none'
      commandLine.focus()
      // Set cursor position at the end of the string
      const inputValueLength = commandLine.value.length
      commandLine.setSelectionRange(inputValueLength, inputValueLength)
    }
    commandList.appendChild(commandItem)
  })
}

commandLine.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    const command = commandLine.value
    if (command === '' || command === '/') {
      commandList.style.display = 'none'
      commandLine.blur()
    }
    parseCommand(command)
    commandLine.value = ''
  } else if (event.key === 'Tab') {
    ;(commandList.children[0] as HTMLButtonElement).click()
    event.preventDefault()
  }

  if (event.key === 'ArrowUp') {
    setTimeout(buildCommandHistory, 0)
    const newCommand = commandHistory.find(item => item !== commandLine.value)
    commandLine.value = newCommand ?? ''
    setTimeout(() => {
      // Set cursor position at the end of the string
      const inputValueLength = commandLine.value.length
      commandLine.setSelectionRange(inputValueLength, inputValueLength)
    }, 0)
  } else {
    setTimeout(buildCommandItems, 0)
  }
})

let commandLineExitTimeout: NodeJS.Timeout

commandLine.onfocus = () => {
  clearTimeout(commandLineExitTimeout)
  buildCommandItems()
  commandList.style.display = ''
}

commandLine.onblur = () => {
  commandLineExitTimeout = setTimeout(() => {
    if (commandLine !== document.activeElement) {
      console.log('blurring')
      commandList.style.display = 'none'
    }
  }, 100)
}

const tickStepButton = document.getElementById(
  'tickStepButton'
) as HTMLButtonElement

const subTickStepButton = document.getElementById(
  'subTickStepButton'
) as HTMLButtonElement

const resetButton = document.getElementById('reset-button') as HTMLButtonElement

const loadDemoButton = document.getElementById('load-demo') as HTMLButtonElement

const canvasElement = document.getElementById('canvas') as HTMLCanvasElement

const resizeCanvas = () => {
  const context = canvasElement.getContext('2d')!
  // Adjust the canvas resolution
  const pixelRatio = window.devicePixelRatio || 1
  console.log(pixelRatio)
  canvasElement.width = canvasElement.clientWidth * pixelRatio
  canvasElement.height = canvasElement.clientHeight * pixelRatio

  // // Scale the context to match the new resolution
  // context.scale(pixelRatio, pixelRatio)

  // Set imageSmoothingEnabled to false
  context.imageSmoothingEnabled = false
}
resizeCanvas()

document.addEventListener('keydown', event => {
  if (event.key === '/') {
    commandLine.focus()
  }
})

let resizeTimeout: NodeJS.Timeout
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    resizeCanvas()
  }, 200)
})

const updatesPerSecondInput = document.getElementById(
  'updatesPerSecondInput'
) as HTMLInputElement

const subUpdatesPerSecondInput = document.getElementById(
  'subUpdatesPerSecondInput'
) as HTMLInputElement

const builtTimeElement = document.getElementById(
  'built-time'
) as HTMLInputElement

const TickInfoElement = document.getElementById('tick-info') as HTMLInputElement

builtTimeElement.textContent = `BUILD ${process.env.BUILD_TIME?.replace(
  ',',
  ''
)}`
// main

const GLOBALS = {
  subtick: 0,
  tick: 0
}

const setTickInfo = () => {
  TickInfoElement.textContent = `TICK: ${GLOBALS.tick} SUBTICK ${GLOBALS.subtick}`
}

const logBlocks = (blocks: BlockContainer) => {
  // const x = blocks
  //   .map(block => block.toString())
  //   .toDictionary(block => block !== new Air({}).toString())
  // const y = blocks.toFormattedString(block => block.toString().padEnd(4))
  // console.log(Object.keys(blocks.chunks))
  console.log(blocks)
}

const subUpdateBlocks = (blocks: BlockContainer) => {
  GLOBALS.subtick = (GLOBALS.subtick + 1) % 16
  setTickInfo()
  const newBlocks: BlockContainer = blocks.map((block: Block, v: Vec2) =>
    block.subupdate(v, blocks)
  )
  blocks.clone(newBlocks)
}

const updateBlocks = (blocks: BlockContainer) => {
  // console.log('update')
  GLOBALS.tick += 1
  setTickInfo()
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

  // updatesPerSecondInput.addEventListener('change', () => {
  //   processUpdatesPerSecondInput()
  //   localStorage.setItem('updatesPerSecond', updatesPerSecondInput.value)
  // })

  const processUpdatesPerSecondInput = (value: string) => {
    const speed = Number(value)
    game.setUpdatesPerSecond(speed)
  }

  const updatesPerSecondValue = localStorage.getItem('updatesPerSecond') ?? 5

  // Sub-Updates Per Second
  const subUpdatesPerSecondValue =
    localStorage.getItem('subUpdatesPerSecond') ?? 1000
  // if (subUpdatesPerSecondValue) {
  //   subUpdatesPerSecondInput.value = subUpdatesPerSecondValue
  // }

  // subUpdatesPerSecondInput.addEventListener('change', () => {
  //   setSubUpdatesPerSecond(Number(subUpdatesPerSecondInput.value))
  //   localStorage.setItem('subUpdatesPerSecond', subUpdatesPerSecondInput.value)
  // })

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

  // manual tick stepping

  tickStepButton.onclick = () => {
    updatesPerSecondInput.value = '0'
    game.setUpdatesPerSecond(0)
    game.allowTimeStep()
  }

  subTickStepButton.onclick = () => {
    // console.log('canSubUpdate')
    subUpdatesPerSecondInput.value = '0'
    setSubUpdatesPerSecond(0)
    canSubUpdate = true
  }

  // processUpdatesPerSecondInput()

  resetButton.addEventListener('click', async () => {
    console.log('reset')
    blocks.chunks = (await loadChunksFromStorage(false, false)).chunks
    updateCanvas()
  })

  loadDemoButton.addEventListener('click', async () => {
    console.log('load demo')
    blocks.chunks = (await loadChunksFromStorage(false, true)).chunks
    updateCanvas()
  })

  logBlocks(blocks)
  updateCanvas()

  // load commands

  const commandManager = new CommandManager()

  commandManager.createCommand('/load_world {name:string}', async input => {
    console.log('loading world', input)
    blocks.chunks = (await loadChunksFromStorage(false, true)).chunks
    updateCanvas()
  })
  commandManager.createCommand('/clear_world', async () => {
    blocks.chunks = (await loadChunksFromStorage(false, false)).chunks
    updateCanvas()
  })
  commandManager.createCommand('/step tick', () => {
    updatesPerSecondInput.value = '0'
    game.setUpdatesPerSecond(0)
    game.allowTimeStep()
  })
  commandManager.createCommand('/step subtick', () => {
    subUpdatesPerSecondInput.value = '0'
    setSubUpdatesPerSecond(0)
    canSubUpdate = true
  })
  commandManager.createCommand('/set updates_per_second {ups:float}', input => {
    processUpdatesPerSecondInput(input.ups)
  })
  commandManager.createCommand(
    '/set subupdates_per_second {sups:float}',
    input => {
      const sups = Number(input.sups)
      if (!isNaN(sups)) {
        setSubUpdatesPerSecond(sups)
      }
    }
  )
  commandManager.createCommand('/toggle debug_window', input => {
    debugPanel.style.display = debugPanel.style.display == 'none' ? '' : 'none'
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

const buildWorld = (blocks: BlockContainer) => {
  blocks.setValue({ x: 0, y: 0 }, new RedstoneBlock({}))
  blocks.setValue(
    { x: 0, y: 1 },
    new RedstoneTorch({ direction: Direction.Up })
  )

  blocks.setValue({ x: 0, y: 2 }, new RedstoneLamp({}))

  blocks.setValue(
    { x: 2, y: 5 },
    new Piston({
      isBeingPowered: true,
      direction: Direction.Right
    })
  )
  blocks.setValue(
    { x: 3, y: 5 },
    new PistonHead({ direction: Direction.Right })
  )
  blocks.setValue({ x: 4, y: 5 }, new GlassBlock({}))
  blocks.setValue({ x: 5, y: 5 }, new GlassBlock({}))

  blocks.setValue({ x: 1, y: 7 }, new RedstoneBlock({}))
  blocks.setValue(
    { x: 2, y: 7 },
    new Piston({
      isBeingPowered: false,
      direction: Direction.Right
    })
  )
  blocks.setValue({ x: 3, y: 7 }, new GlassBlock({}))
  blocks.setValue({ x: 4, y: 7 }, new GlassBlock({}))
  blocks.setValue({ x: 5, y: 7 }, new GlassBlock({}))

  blocks.setValue({ x: 9, y: 3 }, new RedstoneBlock({}))
  blocks.setValue(
    { x: 8, y: 3 },
    new Piston({
      isBeingPowered: false,
      direction: Direction.Left
    })
  )
  blocks.setValue({ x: 7, y: 3 }, new GlassBlock({}))
  blocks.setValue({ x: 6, y: 3 }, new RedstoneBlock({}))
  blocks.setValue({ x: 5, y: 3 }, new GlassBlock({}))
  blocks.setValue({ x: 4, y: 3 }, new RedstoneBlock({}))
  blocks.setValue({ x: 3, y: 3 }, new GlassBlock({}))
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
