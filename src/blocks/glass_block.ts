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

export interface GlassBlock extends MoveableBlock {
  type: BlockType.GlassBlock
}

export const createGlassBlock = (state: {
  movement?: Movement
  movementDirection?: Direction
}): GlassBlock => {
  const { movement = Movement.None, movementDirection = Direction.Up } = state
  return {
    type: BlockType.GlassBlock,
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
        return createGlassBlock(movementUpdateChange.state)
      }
    },
    toString: function () {
      return `MB${
        {
          [Movement.None]: '',
          [Movement.Pending]: '?',
          [Movement.Complete]: '*',
          [Movement.RetractionPending]: '<',
          [Movement.RetractionComplete]: '^'
        }[movement]
      }`
    },
    getTextureName: function () {
      return `glass` + getMovementTextureName(this)
    },
    isOutputtingPower: () => false,
    getMovementMethod: function () {
      return this.movement === Movement.None
        ? BlockMovement.Moveable
        : BlockMovement.Immovable
    }
  }
}

addCreateBlockFunction(BlockType.GlassBlock, createGlassBlock)
