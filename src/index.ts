import { block } from 'sharp'
import { Block, BlockType } from './block'
import { createAirBlock } from './blocks/air'
import { createGlassBlock } from './blocks/glass_block'
import { createPiston } from './blocks/piston'
import { createPistonHead } from './blocks/piston_head'
import { createRedstoneBlock } from './blocks/redstone_block'
import { Canvas } from './rendering/canvas'
import { loadImages } from './rendering/image_loader'
import { Array2D } from './containers/array2d'
import { Vec2, vec2Apply, vec2Zero } from './containers/vec2'
import { Direction } from './direction'

// dom

const updateButton = document.getElementById(
  'update-button'
) as HTMLButtonElement

const canvasElement = document.getElementById('canvas') as HTMLCanvasElement

const updateSpeedInput = document.getElementById(
  'update-speed-input'
) as HTMLInputElement

// main

const logBlocks = (blocks: Array2D<Block>) => {
  const x = blocks
    .map(block => block.toString())
    .toDictionary(block => block !== createAirBlock().toString())
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

const createBlock = (blockType: BlockType): Block => {
  switch (blockType) {
    case BlockType.Air:
      return createAirBlock()
    case BlockType.GlassBlock:
      return createGlassBlock()
    case BlockType.Piston:
      return createPiston({})
    case BlockType.PistonHead:
      return createPistonHead()
    case BlockType.RedstoneBlock:
      return createRedstoneBlock()
    default:
      throw new Error('Block type not implemented')
  }
}

const main = async () => {
  console.log('main')
  const blocks: Array2D<Block> = Array2D.createWithDefaultValue(
    16,
    16,
    createAirBlock()
  )

  blocks.setValue({ x: 0, y: 0 }, createRedstoneBlock())
  blocks.setValue(
    { x: 2, y: 5 },
    createPiston({
      isBeingPowered: true,
      direction: Direction.Right
    })
  )
  blocks.setValue({ x: 3, y: 5 }, createPistonHead())
  blocks.setValue({ x: 4, y: 5 }, createGlassBlock())
  blocks.setValue({ x: 5, y: 5 }, createGlassBlock())

  blocks.setValue({ x: 1, y: 7 }, createRedstoneBlock())
  blocks.setValue(
    { x: 2, y: 7 },
    createPiston({
      isBeingPowered: false,
      direction: Direction.Right
    })
  )
  blocks.setValue({ x: 3, y: 7 }, createGlassBlock())
  blocks.setValue({ x: 4, y: 7 }, createGlassBlock())
  blocks.setValue({ x: 5, y: 7 }, createGlassBlock())

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
  canvasElement.addEventListener('click', () => {
    const p = canvas.getMouseWorldPosition()
    const pi = vec2Apply(p, Math.floor)

    const block = blocks.getValue(pi)

    if (block.type === BlockType.Air) {
      blocks.setValue(pi, createBlock(selectedBlockType))
      updateCanvas()
    } else {
      selectedBlockType = block.type
    }

    // console.log(p, pi, block)
  })

  canvasElement.addEventListener('dblclick', function (e: MouseEvent) {
    e.preventDefault()
    const p = canvas.getMouseWorldPosition()
    const pi = vec2Apply(p, Math.floor)
    blocks.setValue(pi, createAirBlock())
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

main()
