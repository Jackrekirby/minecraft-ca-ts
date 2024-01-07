import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  DirectionalBlock,
  isBlock,
  Movement
} from '../block'
import { Vec2 } from '../containers/vec2'
import {
  Direction,
  getOppositeDirection,
  getOtherDirections,
  getRelativeDirection
} from '../direction'
import { getNeighbourBlock, getNeighbourBlocks } from '../utils/block_fetching'
import { addCreateBlockFunction } from '../utils/create_block'
import { zipArrays } from '../utils/general'
import { GlassBlock } from './glass_block'
import { PistonHead } from './piston_head'

export interface Piston extends DirectionalBlock {
  type: BlockType.Piston
  isBeingPowered: boolean
}

export const createPiston = (state: {
  isBeingPowered?: boolean
  direction?: Direction
}): Piston => {
  const { isBeingPowered = false, direction = Direction.Up } = state
  return {
    type: BlockType.Piston,
    isBeingPowered,
    direction,
    update: (position: Vec2, blocks: BlockContainer): Block => {
      const nonFrontDirections = getOtherDirections(Direction.Up)
      const nonFrontBlocks: Block[] = getNeighbourBlocks(
        position,
        blocks,
        nonFrontDirections
      )

      const isBeingPowered = zipArrays(nonFrontDirections, nonFrontBlocks).some(
        ([neighbourDirection, block]: [Direction, Block]) =>
          block.isOutputtingPower(
            getOppositeDirection(
              getRelativeDirection(neighbourDirection, direction)
            )
          )
      )

      return createPiston({ isBeingPowered, direction })
    },
    toString: function () {
      // function allows `this` to refer to the RedstoneTorch
      return `P${isBeingPowered ? '*' : ''}`
    },
    getTextureName: (position: Vec2, blocks: BlockContainer) => {
      const frontBlock: Block = getNeighbourBlock(
        position,
        blocks,
        Direction.Up
      )
      const isExtended = isBlock<PistonHead>(frontBlock, BlockType.PistonHead)
      const isPowered =
        isBeingPowered ||
        (isBlock<GlassBlock>(frontBlock, BlockType.GlassBlock) &&
          frontBlock.movement === Movement.Pending)
      const tex = `piston${
        isExtended ? '_extended' : isPowered ? '_on' : '_off'
      }_${direction.toLowerCase()}`
      return tex
    },
    isOutputtingPower: () => false,
    getMovementMethod: function () {
      // todo isExtended not used, just use isPowered?
      // maybe extension pending
      return this.isBeingPowered
        ? BlockMovement.Immovable
        : BlockMovement.Moveable
    }
  }
}

addCreateBlockFunction(BlockType.Piston, createPiston)
