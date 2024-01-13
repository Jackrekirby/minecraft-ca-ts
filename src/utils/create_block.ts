import { Block, BlockType } from '../core/block'

const createBlockFunctions: { [key: string]: new (state: object) => Block } = {}

export const addCreateBlockFunction = (
  blockType: BlockType,
  blockConstructor: new (state: object) => Block
): void => {
  createBlockFunctions[blockType] = blockConstructor
}

export const createBlock = (blockType: BlockType, state: object): Block => {
  const blockConstructor: new (state: object) => Block =
    createBlockFunctions[blockType]
  if (!blockConstructor) {
    throw new Error(
      `Block constructor for block type ${blockType} not implemented`
    )
  }
  return new blockConstructor(state)
}
