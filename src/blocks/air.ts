import { Block, BlockMovement, BlockType, isBlock, Movement } from '../block'
import { Array2D } from '../containers/array2d'
import { Vec2, vec2Add } from '../containers/vec2'
import { getAllDirections, getOppositeDirection } from '../direction'
import { getNeighbourBlock } from '../utils/block_fetching'
import { GlassBlock, createGlassBlock } from './glass_block'
import { Piston } from './piston'
import { createPistonHead } from './piston_head'

export interface Air extends Block {
  type: BlockType.Air
}

export const createAirBlock = (_state: {}): Air => ({
  type: BlockType.Air,
  update: (position: Vec2, blocks: Array2D<Block>): Block => {
    for (const direction of getAllDirections()) {
      const neighbour: Block = getNeighbourBlock(position, blocks, direction)

      if (
        isBlock<Piston>(neighbour, BlockType.Piston) &&
        neighbour.direction == getOppositeDirection(direction) &&
        neighbour.isBeingPowered
      ) {
        return createPistonHead({ direction: neighbour.direction })
      } else if (
        // TODO check if instance of movable block
        // TODO add movement direction
        isBlock<GlassBlock>(neighbour, BlockType.GlassBlock) &&
        neighbour.movementDirection == getOppositeDirection(direction) &&
        neighbour.movement === Movement.Pending
      ) {
        return createGlassBlock({ movement: Movement.Complete })
      }
    }

    return createAirBlock({})
  },
  toString: () => '[ ]',
  getTextureName: () => '',
  isOutputtingPower: () => false,
  getMovementMethod: () => BlockMovement.Breaks
})
