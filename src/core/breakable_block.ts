import { Piston } from '../blocks/piston'
import { PistonHead } from '../blocks/piston_head'
import { Vec2 } from '../containers/vec2'
import { getNeighbourBlock } from '../utils/block_fetching'
import { createBlock } from '../utils/create_block'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  isBlock,
  isMoveableBlock,
  Movement
} from './block'
import { getAllDirections, getOppositeDirection } from './direction'

export const breakableNeighbourSubupdate = (
  position: Vec2,
  blocks: BlockContainer
): Block | null => {
  for (const direction of getAllDirections()) {
    const neighbour: Block = getNeighbourBlock(position, blocks, direction)
    const oppositeDirection = getOppositeDirection(direction)

    if (
      isBlock<Piston>(neighbour, BlockType.Piston) &&
      neighbour.direction === oppositeDirection &&
      neighbour.isBeingPowered
    ) {
      return new PistonHead({
        direction: neighbour.direction,
        isSticky: neighbour.isSticky
      })
    } else if (
      isMoveableBlock(neighbour) &&
      neighbour.getMovementMethod() === BlockMovement.Moveable &&
      neighbour.movementDirection === oppositeDirection &&
      neighbour.movement === Movement.Pending
    ) {
      return createBlock(neighbour.type, {
        ...neighbour,
        movement: Movement.Complete,
        movementDirection: oppositeDirection
      })
    }
  }
  return null
}
