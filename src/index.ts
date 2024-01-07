import { Block, BlockContainer, BlockType } from './block'
import { createAirBlock } from './blocks/air'
import { createGlassBlock } from './blocks/glass_block'
import { createPiston } from './blocks/piston'
import { createPistonHead } from './blocks/piston_head'
import { createRedstoneBlock } from './blocks/redstone_block'
import { createRedstoneLamp } from './blocks/redstone_lamp'
import { createRedstoneTorch } from './blocks/redstone_torch'
import { ChunkContainer, Dict2D, StringDict } from './containers/array2d'
import { Vec2, vec2Apply, vec2Subtract, vec2Zero } from './containers/vec2'
import { Direction } from './direction'
import { Canvas } from './rendering/canvas'
import { loadImages } from './rendering/image_loader'
import { createBlock } from './utils/create_block'

// dom

const updateButton = document.getElementById(
  'update-button'
) as HTMLButtonElement

const resetButton = document.getElementById('reset-button') as HTMLButtonElement

const loadDemoButton = document.getElementById('load-demo') as HTMLButtonElement

const canvasElement = document.getElementById('canvas') as HTMLCanvasElement

const updateSpeedInput = document.getElementById(
  'update-speed-input'
) as HTMLInputElement

const builtTimeElement = document.getElementById(
  'built-time'
) as HTMLInputElement

builtTimeElement.textContent = `BUILD ${process.env.BUILD_TIME?.replace(
  ',',
  ''
)}`
// main

const logBlocks = (blocks: BlockContainer) => {
  // const x = blocks
  //   .map(block => block.toString())
  //   .toDictionary(block => block !== createAirBlock({}).toString())
  // const y = blocks.toFormattedString(block => block.toString().padEnd(4))
  // console.log(Object.keys(blocks.chunks))
  console.log(blocks)
}

const updateBlocks = (blocks: BlockContainer) => {
  // console.log('update')
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
    () => createAirBlock({}),
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
    blocks.setValue(pi, createAirBlock({}))
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

  let updateIntervalId: NodeJS.Timeout | null = null

  updateSpeedInput.value = localStorage.getItem('update-speed') ?? '200'

  const processSpeedInput = () => {
    const speed = Number(updateSpeedInput.value)
    console.log('Update speed', speed)
    if (updateIntervalId) {
      clearInterval(updateIntervalId)
    }
    if (speed > 0) {
      updateIntervalId = setInterval(() => {
        updateBlocks(blocks)
        updateCanvas()
      }, speed)
    }
  }

  updateSpeedInput.addEventListener('change', () => {
    processSpeedInput()
    localStorage.setItem('update-speed', updateSpeedInput.value)
  })

  processSpeedInput()

  updateButton.onclick = () => {
    updateBlocks(blocks)
    updateCanvas()
  }

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
}

const placeAllBlocks = (blocks: BlockContainer) => {
  blocks.setValue({ x: 0, y: 0 }, createRedstoneBlock({}))

  blocks.setValue({ x: 2, y: 0 }, createRedstoneTorch({}))

  blocks.setValue({ x: 4, y: 0 }, createRedstoneLamp({}))

  blocks.setValue({ x: 6, y: 0 }, createPiston({}))

  blocks.setValue({ x: 8, y: 0 }, createGlassBlock({}))
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
  blocks.setValue({ x: 0, y: 0 }, createRedstoneBlock({}))
  blocks.setValue(
    { x: 0, y: 1 },
    createRedstoneTorch({ direction: Direction.Up })
  )

  blocks.setValue({ x: 0, y: 2 }, createRedstoneLamp({}))

  blocks.setValue(
    { x: 2, y: 5 },
    createPiston({
      isBeingPowered: true,
      direction: Direction.Right
    })
  )
  blocks.setValue(
    { x: 3, y: 5 },
    createPistonHead({ direction: Direction.Right })
  )
  blocks.setValue({ x: 4, y: 5 }, createGlassBlock({}))
  blocks.setValue({ x: 5, y: 5 }, createGlassBlock({}))

  blocks.setValue({ x: 1, y: 7 }, createRedstoneBlock({}))
  blocks.setValue(
    { x: 2, y: 7 },
    createPiston({
      isBeingPowered: false,
      direction: Direction.Right
    })
  )
  blocks.setValue({ x: 3, y: 7 }, createGlassBlock({}))
  blocks.setValue({ x: 4, y: 7 }, createGlassBlock({}))
  blocks.setValue({ x: 5, y: 7 }, createGlassBlock({}))

  blocks.setValue({ x: 9, y: 3 }, createRedstoneBlock({}))
  blocks.setValue(
    { x: 8, y: 3 },
    createPiston({
      isBeingPowered: false,
      direction: Direction.Left
    })
  )
  blocks.setValue({ x: 7, y: 3 }, createGlassBlock({}))
  blocks.setValue({ x: 6, y: 3 }, createRedstoneBlock({}))
  blocks.setValue({ x: 5, y: 3 }, createGlassBlock({}))
  blocks.setValue({ x: 4, y: 3 }, createRedstoneBlock({}))
  blocks.setValue({ x: 3, y: 3 }, createGlassBlock({}))
}

main()
