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

export interface RedstoneBlock extends MoveableBlock {
  type: BlockType.RedstoneBlock
}

export const createRedstoneBlock = (state: {
  movement?: Movement
  movementDirection?: Direction
}): RedstoneBlock => {
  const { movement = Movement.None, movementDirection = Direction.Up } = state
  return {
    type: BlockType.RedstoneBlock,
    movement,
    movementDirection,
    update: (position: Vec2, blocks: BlockContainer): Block => {
      const movementUpdateChange: MovementUpdateChange = updateMovement(
        position,
        blocks,
        movement,
        movementDirection
      )

      if (movementUpdateChange.type === MovementUpdateType.BlockChange) {
        return movementUpdateChange.block
      } else {
        return createRedstoneBlock(movementUpdateChange.state)
      }
    },
    toString: () => 'RDB',
    getTextureName: function () {
      return `redstone_block` + getMovementTextureName(this)
    },
    isOutputtingPower: () => true,
    getMovementMethod: () => BlockMovement.Moveable
  }
}

addCreateBlockFunction(BlockType.RedstoneBlock, createRedstoneBlock)
