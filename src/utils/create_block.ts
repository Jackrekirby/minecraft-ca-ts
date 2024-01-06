import { Block, BlockType } from '../block'

const createBlockFunctions: { [key: string]: (state: object) => Block } = {}

export const addCreateBlockFunction = (
  blockType: BlockType,
  createBlockFunction: (state: object) => Block
): void => {
  createBlockFunctions[blockType] = createBlockFunction
}

export const createBlock = (blockType: BlockType, state: object): Block => {
  const fnc: (state: object) => Block = createBlockFunctions[blockType]
  if (!fnc) {
    throw new Error(
      `createBlockFunctions for block type ${blockType} not implemented`
    )
  }
  return fnc(state)
}
