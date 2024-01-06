import { Block, BlockMovement, BlockType, isBlock, Movement } from '../block'
import { Array2D } from '../containers/array2d'
import { Vec2, vec2Add } from '../containers/vec2'
import { GlassBlock, createGlassBlock } from './glass_block'
import { Piston } from './piston'
import { createPistonHead } from './piston_head'

export interface Air extends Block {
  type: BlockType.Air
}

export const createAirBlock = (): Air => ({
  type: BlockType.Air,
  update: (position: Vec2, blocks: Array2D<Block>): Block => {
    const leftBlock: Block =
      blocks.getValue(vec2Add(position, { x: -1, y: 0 })) ?? createAirBlock()
    if (
      isBlock<Piston>(leftBlock, BlockType.Piston) &&
      leftBlock.isBeingPowered
    ) {
      return createPistonHead()
    } else if (
      // TODO check if instance of movable block
      isBlock<GlassBlock>(leftBlock, BlockType.GlassBlock) &&
      leftBlock.movement === Movement.Pending
    ) {
      return createGlassBlock(Movement.Complete)
    }

    return createAirBlock()
  },
  toString: () => '[ ]',
  getTextureName: () => '',
  isOutputtingPower: () => false,
  getMovementMethod: () => BlockMovement.Breaks
})
