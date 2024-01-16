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
  updateMovement,
  updateSubMovement
} from '../core/moveable_block'
import { BinaryPower, OutputPowerBlock } from '../core/powerable_block'

import { addCreateBlockFunction } from '../utils/create_block'

export class RedstoneBlock implements MoveableBlock, OutputPowerBlock.Traits {
  type: BlockType = BlockType.RedstoneBlock
  movement: Movement
  movementDirection: Direction
  outputPower: BinaryPower = BinaryPower.Strong

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
    const movementUpdateChange: MovementUpdateChange = updateSubMovement(
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
