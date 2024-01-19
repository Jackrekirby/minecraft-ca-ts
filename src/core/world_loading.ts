import { Air } from '../blocks/air'
import { GlassBlock } from '../blocks/glass_block'
import { Piston } from '../blocks/piston'
import { RedstoneBlock } from '../blocks/redstone_block'
import { RedstoneDust } from '../blocks/redstone_dust'
import { RedstoneLamp } from '../blocks/redstone_lamp'
import { RedstoneRepeater } from '../blocks/redstone_repeater'
import { RedstoneTorch } from '../blocks/redstone_torch'
import { ChunkContainer, Dict2D, StringDict } from '../containers/array2d'
import { Vec2 } from '../containers/vec2'
import { createBlock } from '../utils/create_block'
import { Block, BlockContainer, BlockType } from './block'

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

const placeAllBlocks = (blocks: BlockContainer) => {
  blocks.setValue({ x: 0, y: 0 }, new RedstoneBlock({}))

  blocks.setValue({ x: 2, y: 0 }, new RedstoneTorch({}))

  blocks.setValue({ x: 4, y: 0 }, new RedstoneLamp({}))

  blocks.setValue({ x: 6, y: 0 }, new Piston({}))

  blocks.setValue({ x: 8, y: 0 }, new GlassBlock({}))

  blocks.setValue({ x: 10, y: 0 }, new RedstoneRepeater({}))

  blocks.setValue({ x: 12, y: 0 }, new RedstoneDust({}))
}

export const loadChunksFromStorage = async (
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
    // console.log(chunkDict)

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
