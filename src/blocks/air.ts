import { Vec2 } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  isBlock,
  isMoveableBlock,
  Movement
} from '../core/block'
import { getAllDirections, getOppositeDirection } from '../core/direction'
import { getNeighbourBlock } from '../utils/block_fetching'
import { addCreateBlockFunction, createBlock } from '../utils/create_block'
import { Piston } from './piston'
import { PistonHead } from './piston_head'

export class Air implements Block {
  type: BlockType = BlockType.Air

  constructor ({}: {} = {}) {}

  public update (position: Vec2, blocks: BlockContainer): Block {
    for (const direction of getAllDirections()) {
      const neighbour: Block = getNeighbourBlock(position, blocks, direction)
      const oppositeDirection = getOppositeDirection(direction)

      if (
        isBlock<Piston>(neighbour, BlockType.Piston) &&
        neighbour.direction === oppositeDirection &&
        neighbour.isBeingPowered
      ) {
        return new PistonHead({ direction: neighbour.direction })
      } else if (
        // TODO: check if instance of movable block
        // TODO: add movement direction
        isMoveableBlock(neighbour) &&
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

    return new Air()
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    return new Air(this)
  }

  public toString (): string {
    return '[ ]'
  }

  public getTextureName (): string {
    return ''
  }

  public isOutputtingPower (): boolean {
    return false
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Breaks
  }
}

addCreateBlockFunction(BlockType.Air, Air)
