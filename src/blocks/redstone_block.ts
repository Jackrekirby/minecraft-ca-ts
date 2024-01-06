import { Block, BlockType, BlockMovement } from '../block'
import { Array2D } from '../containers/array2d'
import { Vec2 } from '../containers/vec2'

export interface RedstoneBlock extends Block {
  type: BlockType.RedstoneBlock
}

export const createRedstoneBlock = (): RedstoneBlock => ({
  type: BlockType.RedstoneBlock,
  update: (_position: Vec2, _blocks: Array2D<Block>): Block => {
    return createRedstoneBlock()
  },
  toString: () => 'RDB',
  getTextureName: () => 'redstone_block',
  isOutputtingPower: () => true,
  getMovementMethod: () => BlockMovement.Moveable
})
