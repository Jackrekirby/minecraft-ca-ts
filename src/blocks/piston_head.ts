import {
  Block,
  BlockMovement,
  BlockType,
  DirectionalBlock,
  isBlock,
  isMoveableBlock,
  Movement
} from '../block'
import { Array2D } from '../containers/array2d'
import { Vec2, vec2Add } from '../containers/vec2'
import { Direction } from '../direction'
import { getNeighbourBlock } from '../utils/block_fetching'
import { Air, createAirBlock } from './air'
import { GlassBlock, createGlassBlock } from './glass_block'
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
    update: (position: Vec2, blocks: Array2D<Block>): Block => {
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

      if (
        isRetracting &&
        isBlock<GlassBlock>(frontBlock, BlockType.GlassBlock) &&
        frontBlock.movement === Movement.RetractionPending
      ) {
        return createGlassBlock({ movement: Movement.RetractionComplete })
      } else if (isRetracting && !isMoveableBlock(frontBlock)) {
        return createAirBlock({})
      } else if (
        isBlock<Piston>(backBlock, BlockType.Piston) &&
        !backBlock.isBeingPowered
      ) {
        return createPistonHead({ isRetracting: true, direction })
      }
      return createPistonHead({ isRetracting: false, direction })
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