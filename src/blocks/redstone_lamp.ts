import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  MoveableBlock,
  Movement
} from '../block'
import { Vec2 } from '../containers/vec2'
import { Direction, getAllDirections, getOppositeDirection } from '../direction'
import {
  getMovementTextureName,
  MovementUpdateChange,
  MovementUpdateType,
  updateMovement
} from '../moveable_block'
import { getNeighbourBlock } from '../utils/block_fetching'
import { addCreateBlockFunction } from '../utils/create_block'

export interface RedstoneLamp extends MoveableBlock {
  type: BlockType.RedstoneLamp
  isBeingPowered: boolean
}

export const createRedstoneLamp = (state: {
  isBeingPowered?: boolean
  movement?: Movement
  movementDirection?: Direction
}): RedstoneLamp => {
  const {
    isBeingPowered = false,
    movement = Movement.None,
    movementDirection = Direction.Up
  } = state
  return {
    type: BlockType.RedstoneLamp,
    isBeingPowered,
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
        for (const direction of getAllDirections()) {
          const neighbour: Block = getNeighbourBlock(
            position,
            blocks,
            direction
          )

          const isBeingPowered = neighbour.isOutputtingPower(
            getOppositeDirection(direction)
          )
          if (isBeingPowered) {
            return createRedstoneLamp({
              ...movementUpdateChange.state,
              isBeingPowered: true
            })
          }
        }
        return createRedstoneLamp({
          ...movementUpdateChange.state,
          isBeingPowered: false
        })
      }
    },
    toString: () => 'RDB',
    getTextureName: function () {
      return (
        `redstone_lamp_${isBeingPowered ? 'on' : 'off'}` +
        getMovementTextureName(this)
      )
    },
    isOutputtingPower: () => false,
    getMovementMethod: () => BlockMovement.Moveable
  }
}

addCreateBlockFunction(BlockType.RedstoneLamp, createRedstoneLamp)
