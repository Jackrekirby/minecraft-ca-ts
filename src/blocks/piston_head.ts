import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  DirectionalBlock,
  isBlock,
  isMoveableBlock,
  Movement
} from '../block'
import { Vec2 } from '../containers/vec2'
import { Direction, getOppositeDirection } from '../direction'
import { getNeighbourBlock } from '../utils/block_fetching'
import { addCreateBlockFunction, createBlock } from '../utils/create_block'
import { createAirBlock } from './air'
import { Piston } from './piston'

export interface PistonHead extends DirectionalBlock {
  type: BlockType.PistonHead
  isRetracting: boolean
}

export const createPistonHead = (state: {
  isRetracting?: boolean
  direction?: Direction
}): PistonHead => {
  const { isRetracting = false, direction = Direction.Up } = state
  return {
    type: BlockType.PistonHead,
    isRetracting,
    direction,
    update: (position: Vec2, blocks: BlockContainer): Block => {
      const backBlock: Block = getNeighbourBlock(
        position,
        blocks,
        Direction.Down
      )

      const frontBlock: Block = getNeighbourBlock(
        position,
        blocks,
        Direction.Up
      )

      if (isBlock<Piston>(backBlock, BlockType.Piston)) {
        if (
          isRetracting &&
          isMoveableBlock(frontBlock) &&
          frontBlock.movement === Movement.RetractionPending &&
          frontBlock.movementDirection === direction
        ) {
          return createBlock(frontBlock.type, {
            ...frontBlock,
            movement: Movement.RetractionComplete,
            movementDirection: direction
          })
        } else if (
          isRetracting &&
          isMoveableBlock(frontBlock) &&
          frontBlock.movement === Movement.Pending &&
          frontBlock.movementDirection === getOppositeDirection(direction)
        ) {
          // TODO: once subticks are added all motions should be cancelled
          // at end of each tick
          // this is a TEMPORARY measure
          return createAirBlock({})
        } else if (isRetracting && !isMoveableBlock(frontBlock)) {
          return createAirBlock({})
        } else {
          return createPistonHead({
            isRetracting: !backBlock.isBeingPowered,
            direction
          })
        }
      } else {
        return createAirBlock({})
      }
    },
    toString: function () {
      // function allows `this` to refer to the RedstoneTorch
      return `PH${isRetracting ? '<' : ''}`
    },
    getTextureName: function () {
      return `piston_head${
        isRetracting ? '_retracting' : ''
      }_${direction.toLowerCase()}`
    },
    isOutputtingPower: () => false,
    getMovementMethod: () => BlockMovement.Immovable
  }
}

addCreateBlockFunction(BlockType.PistonHead, createPistonHead)
