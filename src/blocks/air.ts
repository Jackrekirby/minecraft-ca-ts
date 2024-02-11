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
import { breakableNeighbourSubupdate } from '../core/breakable_block'
import {
  Direction,
  getAllDirections,
  getOppositeDirection
} from '../core/direction'
import { getNeighbourBlock } from '../utils/block_fetching'
import { addCreateBlockFunction, createBlock } from '../utils/create_block'
import { ConcretePowder, GravityMotion } from './concrete_powder'
import {
  OakSaplingBlockReplacedByGrowth,
  OakSaplingGrowth
} from './oak_sapling_growth'

export class Air implements Block {
  type: BlockType = BlockType.Air

  constructor ({}: {} = {}) {}

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    const block = breakableNeighbourSubupdate(position, blocks)
    if (block) {
      return block
    }

    for (const direction of getAllDirections()) {
      const neighbour: Block = getNeighbourBlock(position, blocks, direction)
      const oppositeDirection = getOppositeDirection(direction)

      if (
        // TODO: check if instance of movable block
        // TODO: add movement direction
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
      } else if (
        direction === Direction.Up &&
        isBlock<ConcretePowder>(neighbour, BlockType.ConcretePowder) &&
        neighbour.gravityMotion === GravityMotion.Falling
      ) {
        return createBlock(neighbour.type, {
          ...neighbour,
          gravityMotion: GravityMotion.Fallen
        })
      }
    }

    const oakSaplingGrowth: Block | null = OakSaplingGrowth.neighbourSubupdate(
      position,
      blocks,
      OakSaplingBlockReplacedByGrowth.Air
    )
    if (oakSaplingGrowth) {
      return oakSaplingGrowth
    }

    return new Air()
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    return new Air(this)
  }

  public getTextureName (): string {
    return ''
  }

  // public isOutputtingPower (): boolean {
  //   return false
  // }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Breaks
  }
}

addCreateBlockFunction(BlockType.Air, Air)
