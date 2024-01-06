import {
  Block,
  BlockMovement,
  BlockType,
  isBlock,
  isMoveableBlock,
  Movement
} from '../block'
import { Array2D } from '../containers/array2d'
import { Vec2 } from '../containers/vec2'
import { getAllDirections, getOppositeDirection } from '../direction'
import { getNeighbourBlock } from '../utils/block_fetching'
import { addCreateBlockFunction, createBlock } from '../utils/create_block'
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
      const oppositeDirection = getOppositeDirection(direction)

      if (
        isBlock<Piston>(neighbour, BlockType.Piston) &&
        neighbour.direction == oppositeDirection &&
        neighbour.isBeingPowered
      ) {
        return createPistonHead({ direction: neighbour.direction })
      } else if (
        // TODO check if instance of movable block
        // TODO add movement direction
        isMoveableBlock(neighbour) &&
        neighbour.movementDirection == oppositeDirection &&
        neighbour.movement === Movement.Pending
      ) {
        return createBlock(neighbour.type, {
          ...neighbour,
          movement: Movement.Complete,
          movementDirection: oppositeDirection
        })
      }
    }

    return createAirBlock({})
  },
  toString: () => '[ ]',
  getTextureName: () => '',
  isOutputtingPower: () => false,
  getMovementMethod: () => BlockMovement.Breaks
})

addCreateBlockFunction(BlockType.Air, createAirBlock)
