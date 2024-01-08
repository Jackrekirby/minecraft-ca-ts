import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  MoveableBlock,
  Movement
} from '../block'
import { Vec2 } from '../containers/vec2'
import { Direction } from '../direction'
import {
  getMovementTextureName,
  MovementUpdateChange,
  MovementUpdateType,
  updateMovement
} from '../moveable_block'
import { addCreateBlockFunction } from '../utils/create_block'

export class RedstoneBlock implements MoveableBlock {
  type: BlockType = BlockType.RedstoneBlock
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
      return new RedstoneBlock(movementUpdateChange.state)
    }
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    return new RedstoneBlock(this)
  }

  public toString (): string {
    return 'RDB'
  }

  public getTextureName (): string {
    return `redstone_block` + getMovementTextureName(this)
  }

  public isOutputtingPower (): boolean {
    return true
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Moveable
  }
}

addCreateBlockFunction(BlockType.RedstoneBlock, RedstoneBlock)
