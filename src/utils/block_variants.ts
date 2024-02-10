import { Block, getBlockName } from '../core/block'

const BlockAliasMap = new Map<string, Block>()

export const addBlockVariant = (block: Block) => {
  BlockAliasMap.set(getBlockName(block), block)
}

export const getBlockFromAlias = (alias: string): Block | undefined => {
  return BlockAliasMap.get(alias)
}

export const getAllBlockVariants = (): Block[] => {
  return Array.from(BlockAliasMap.values()).reverse()
}
