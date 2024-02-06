import { Air } from '../blocks/air'
import { Button } from '../blocks/button'
import { ConcretePowder } from '../blocks/concrete_powder'
import { GlassBlock } from '../blocks/glass_block'
import { Lever } from '../blocks/lever'
import { ObserverBlock } from '../blocks/observer_block'
import { Obsidian } from '../blocks/obsidian'
import { Piston } from '../blocks/piston'
import { RedstoneBlock } from '../blocks/redstone_block'
import { RedstoneComparator } from '../blocks/redstone_compator'
import { RedstoneDust } from '../blocks/redstone_dust'
import { RedstoneLamp } from '../blocks/redstone_lamp'
import { RedstoneRepeater } from '../blocks/redstone_repeater'
import { RedstoneTorch } from '../blocks/redstone_torch'
import { TargetBlock } from '../blocks/target_block'
import { Color, WoolBlock } from '../blocks/wool_block'
import { ChunkContainer, Dict2D2, StringDict } from '../containers/array2d'
import { Vec2 } from '../containers/vec2'
import { createBlock } from '../utils/create_block'
import { Block, BlockContainer, BlockType } from './block'

export const loadWorldSave = async () => {
  try {
    const response = await fetch('saves/world1.json')

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const jsonData = await response.json()
    // console.log('JSON data:', jsonData)
    return jsonData
  } catch (error) {
    console.error('Error fetching JSON:', error)
  }
}

export const listSelectableBlocks = (): Block[] => {
  const blocks: Block[] = [
    new RedstoneBlock({}),
    new RedstoneTorch({}),
    new GlassBlock({}),
    new RedstoneLamp({}),
    new Piston({}),
    new RedstoneRepeater({}),
    new RedstoneDust({}),
    new Lever({}),
    new Button({}),
    new Piston({ isSticky: true }),
    new ObserverBlock({}),
    new Obsidian({}),
    new TargetBlock({}),
    new RedstoneComparator({})
  ]

  Object.values(Color).forEach((color: string, x: number) => {
    blocks.push(new WoolBlock({ color: color as Color }))
  })

  Object.values(Color).forEach((color: string, x: number) => {
    blocks.push(new ConcretePowder({ color: color as Color }))
  })

  return blocks
}

export const placeAllBlocks = (blocks: BlockContainer) => {
  const allBlocks = listSelectableBlocks()

  allBlocks
    .filter(
      block =>
        ![BlockType.ConcretePowder, BlockType.WoolBlock].includes(block.type)
    )
    .forEach((block, x) => {
      blocks.setValue({ x, y: 2 }, block)
    })

  allBlocks
    .filter(block => [BlockType.WoolBlock].includes(block.type))
    .forEach((block, x) => {
      blocks.setValue({ x, y: 0 }, block)
    })

  allBlocks
    .filter(block => [BlockType.ConcretePowder].includes(block.type))
    .forEach((block, x) => {
      blocks.setValue({ x, y: 1 }, block)
    })
}
export const loadChunks = (
  chunks: StringDict<Block>,
  blocks: BlockContainer
) => {
  const chunkDict = new Dict2D2(chunks)
  // console.log(chunkDict)

  chunkDict.map((block: Block, v: Vec2) => {
    blocks.setValue(v, createBlock(block.type, block))
  })
}

export const createEmptyBlockContainer = () => {
  const blocks: BlockContainer = new ChunkContainer<Block>(
    16,
    () => new Air({}),
    (block: Block) => block.type === BlockType.Air,
    true
  )
  return blocks
}

export const createDemoWorld = async () => {
  const blocks: BlockContainer = createEmptyBlockContainer()
  const chunks = (await loadWorldSave()) as StringDict<Block>
  loadChunks(chunks, blocks)

  placeAllBlocks(blocks)
  return blocks
}

export const createEmptyWorld = () => {
  const blocks: BlockContainer = createEmptyBlockContainer()
  return blocks
}
