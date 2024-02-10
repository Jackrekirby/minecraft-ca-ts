import { Air } from '../blocks/air'
import {
  ChunkContainer,
  Dict2D,
  Dict2D2,
  StringDict
} from '../containers/array2d'
import { Vec2 } from '../containers/vec2'
import { createBlock } from '../utils/create_block'
import { downloadFile } from '../utils/general'
import { compressObject } from '../utils/save'
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

// export const listSelectableBlocks = (): Block[] => {
//   const blocks: Block[] = [
//     new RedstoneBlock({}),
//     new RedstoneTorch({}),
//     new GlassBlock({}),
//     new RedstoneLamp({}),
//     new Piston({}),
//     new RedstoneRepeater({}),
//     new RedstoneDust({}),
//     new Lever({}),
//     new Button({}),
//     new Piston({ isSticky: true }),
//     new ObserverBlock({}),
//     new Obsidian({}),
//     new TargetBlock({}),
//     new RedstoneComparator({}),
//     new RedstoneJunction({}),
//     new RedstoneCauldron({})
//   ]

//   getColors().forEach(color => {
//     blocks.push(new WoolBlock({ color }))
//   })

//   getColors().forEach(color => {
//     blocks.push(new ConcretePowder({ color }))
//   })

//   return blocks
// }

// export const placeAllBlocks = (blocks: BlockContainer) => {
//   const allBlocks = listSelectableBlocks()

//   allBlocks
//     .filter(
//       block =>
//         ![BlockType.ConcretePowder, BlockType.WoolBlock].includes(block.type)
//     )
//     .forEach((block, x) => {
//       blocks.setValue({ x, y: 2 }, block)
//     })

//   allBlocks
//     .filter(block => [BlockType.WoolBlock].includes(block.type))
//     .forEach((block, x) => {
//       blocks.setValue({ x, y: 0 }, block)
//     })

//   allBlocks
//     .filter(block => [BlockType.ConcretePowder].includes(block.type))
//     .forEach((block, x) => {
//       blocks.setValue({ x, y: 1 }, block)
//     })
// }
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

  // placeAllBlocks(blocks)
  return blocks
}

export const createEmptyWorld = () => {
  const blocks: BlockContainer = createEmptyBlockContainer()
  return blocks
}

export const downloadWorld = (blocks: BlockContainer, compress?: boolean) => {
  const blocksForStorage: Dict2D<Block> = blocks.mapToDict2D(
    (block: Block, v: Vec2) => {
      return block
    }
  )
  let stringValue: string
  if (compress) {
    stringValue = compressObject(Object.fromEntries(blocksForStorage.items))
    downloadFile(stringValue, 'world.txt')
  } else {
    stringValue = JSON.stringify(
      Object.fromEntries(blocksForStorage.items),
      null,
      2
    )
    downloadFile(stringValue, 'world.json')
  }
}
