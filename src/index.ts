import { Block, BlockType } from './block'
import { createAirBlock } from './blocks/air'
import { createGlassBlock } from './blocks/glass_block'
import { createPiston } from './blocks/piston'
import { createPistonHead } from './blocks/piston_head'
import { createRedstoneBlock } from './blocks/redstone_block'
import { createRedstoneLamp } from './blocks/redstone_lamp'
import { createRedstoneTorch } from './blocks/redstone_torch'
import { Array2D } from './containers/array2d'
import { Vec2, vec2Apply, vec2Subtract, vec2Zero } from './containers/vec2'
import { Direction } from './direction'
import { Canvas } from './rendering/canvas'
import { loadImages } from './rendering/image_loader'
import { createBlock } from './utils/create_block'

// dom

const updateButton = document.getElementById(
  'update-button'
) as HTMLButtonElement

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

const logBlocks = (blocks: Array2D<Block>) => {
  const x = blocks
    .map(block => block.toString())
    .toDictionary(block => block !== createAirBlock({}).toString())
  const y = blocks.toFormattedString(block => block.toString().padEnd(4))
  console.log(x)
}

const updateBlocks = (blocks: Array2D<Block>) => {
  // console.log('update')
  const newBlocks: Array2D<Block> = blocks.map((block: Block, v: Vec2) =>
    block.update(v, blocks)
  )
  blocks.array = newBlocks.array
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

const main = async () => {
  console.log('main')
  const blocks: Array2D<Block> = Array2D.createWithDefaultValue(
    16,
    16,
    createAirBlock({})
  )
  buildWorld(blocks)

  const canvas = new Canvas(
    canvasElement,
    await loadImages(),
    40,
    1.05,
    vec2Zero()
  )

  const updateCanvas = () => {
    canvas.setGridImages(
      blocks.map((block: Block, v: Vec2) => block.getTextureName(v, blocks))
    )
    canvas.render()
  }

  let selectedBlockType: BlockType = BlockType.Air
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
      blocks.setValue(pi, createBlock(selectedBlockType, { direction }))
      updateCanvas()
    } else {
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
    updateCanvas()
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

  logBlocks(blocks)
  updateCanvas()
}

const buildWorld = (blocks: Array2D<Block>) => {
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
