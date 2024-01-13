import { Vec2 } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  MoveableBlock,
  Movement
} from '../core/block'
import { Direction } from '../core/direction'
import {
  getMovementTextureName,
  MovementUpdateChange,
  MovementUpdateType,
  updateMovement
} from '../core/moveable_block'
import { addCreateBlockFunction } from '../utils/create_block'

export class GlassBlock implements MoveableBlock {
  type: BlockType = BlockType.GlassBlock
  movement: Movement
  movementDirection: Direction

  constructor ({
    movement = Movement.None,
    movementDirection = Direction.Up
  }: {
    movement?: Movement
    movementDirection?: Direction
  } = {}) {
    this.movement = movement
    this.movementDirection = movementDirection
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    const movementUpdateChange: MovementUpdateChange = updateMovement(
      position,
      blocks,
      this.movement,
      this.movementDirection
    )

    if (movementUpdateChange.type === MovementUpdateType.BlockChange) {
      return movementUpdateChange.block
    } else {
      return new GlassBlock(movementUpdateChange.state)
    }
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    return new GlassBlock(this)
  }

  public toString (): string {
    return `MB${
      {
        [Movement.None]: '',
        [Movement.Pending]: '?',
        [Movement.Complete]: '*',
        [Movement.RetractionPending]: '<',
        [Movement.RetractionComplete]: '^'
      }[this.movement]
    }`
  }

  public getTextureName (): string {
    return `glass` + getMovementTextureName(this)
  }

  public isOutputtingPower (): boolean {
    return false
  }

  public getMovementMethod (): BlockMovement {
    return this.movement === Movement.None
      ? BlockMovement.Moveable
      : BlockMovement.Immovable
  }
}

addCreateBlockFunction(BlockType.GlassBlock, GlassBlock)
