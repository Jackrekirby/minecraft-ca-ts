import {
  MoveableBlock,
  BlockType,
  Movement,
  Block,
  isBlock,
  BlockMovement
} from '../block'
import { Array2D } from '../containers/array2d'
import { Vec2, vec2Add } from '../containers/vec2'
import { Direction } from '../direction'
import { createAirBlock } from './air'
import { Piston } from './piston'
import { createPistonHead, PistonHead } from './piston_head'

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
    update: (position: Vec2, blocks: Array2D<Block>): Block => {
      const leftBlock: Block = blocks.getValue(
        vec2Add(position, { x: -1, y: 0 })
      )
      const rightBlock: Block = blocks.getValue(
        vec2Add(position, { x: 1, y: 0 })
      )

      if (
        isBlock<Piston>(leftBlock, BlockType.Piston) &&
        leftBlock.isBeingPowered &&
        [Movement.None, Movement.Pending].includes(movement)
      ) {
        if (
          // [piston] [pending block -> piston] [complete block]
          isBlock<GlassBlock>(rightBlock, BlockType.GlassBlock) &&
          rightBlock.movement === Movement.Complete &&
          movement === Movement.Pending
        ) {
          return createPistonHead({ direction: Direction.Right })
        } // [piston] [pending block] [pending block]
        return createGlassBlock({
          movement: Movement.Pending,
          movementDirection: Direction.Right
        })
      } else if (
        // complete the extension even if piston off
        isBlock<Piston>(leftBlock, BlockType.Piston) &&
        !leftBlock.isBeingPowered &&
        [Movement.Pending].includes(movement)
      ) {
        if (
          // [piston] [pending block -> piston] [complete block]
          isBlock<GlassBlock>(rightBlock, BlockType.GlassBlock) &&
          rightBlock.movement === Movement.Complete &&
          movement === Movement.Pending
        ) {
          return createPistonHead({ direction: Direction.Right })
        } // [piston] [pending block] [pending block]
        return createGlassBlock({
          movement: Movement.Pending,
          movementDirection: Direction.Right
        })
      } else if (
        isBlock<GlassBlock>(leftBlock, BlockType.GlassBlock) &&
        leftBlock.movement === Movement.Pending &&
        [Movement.None, Movement.Pending].includes(movement)
      ) {
        if (
          // [pending block] [pending block -> complete block] [complete block]
          isBlock<GlassBlock>(rightBlock, BlockType.GlassBlock) &&
          rightBlock.movement === Movement.Complete &&
          movement === Movement.Pending
        ) {
          return createGlassBlock({
            movement: Movement.Complete,
            movementDirection
          })
        }
        // [pending block] [pending block] [pending block]
        return createGlassBlock({
          movement: Movement.Pending,
          movementDirection: Direction.Right
        })
      } else if (
        isBlock<PistonHead>(leftBlock, BlockType.PistonHead) &&
        leftBlock.isRetracting &&
        [Movement.None, Movement.RetractionPending].includes(movement)
      ) {
        // [piston head retracting] [block] [pending block]
        return createGlassBlock({
          movement: Movement.RetractionPending,
          movementDirection
        })
      } else if (
        isBlock<GlassBlock>(leftBlock, BlockType.GlassBlock) &&
        leftBlock.movement === Movement.RetractionComplete &&
        [Movement.RetractionPending].includes(movement)
      ) {
        return createAirBlock({})
      }

      return createGlassBlock({ movement: Movement.None, movementDirection })
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
      const x = {
        [Movement.None]: '',
        [Movement.Pending]: '_extension_pending_right',
        [Movement.Complete]: '_extension_complete_right',
        [Movement.RetractionPending]: '_retraction_pending_right',
        [Movement.RetractionComplete]: '_retraction_complete_right'
      }[movement]
      return `glass${x}`
    },
    isOutputtingPower: () => false,
    getMovementMethod: function () {
      return this.movement === Movement.None
        ? BlockMovement.Moveable
        : BlockMovement.Immovable
    }
  }
}
