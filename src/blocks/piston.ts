import {
  Block,
  BlockType,
  BlockMovement,
  isBlock,
  Movement,
  DirectionalBlock
} from '../block'
import { Array2D } from '../containers/array2d'
import { Vec2, vec2Add } from '../containers/vec2'
import { Direction } from '../direction'
import { getNeighbourBlock } from '../utils/block_fetching'
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
    update: (position: Vec2, blocks: Array2D<Block>): Block => {
      const leftBlock: Block = getNeighbourBlock(
        position,
        blocks,
        Direction.Down
      )

      const rightBlock: Block = getNeighbourBlock(
        position,
        blocks,
        Direction.Up
      )
      // const leftBlock: Block = blocks.getValue(
      //   vec2Add(position, { x: -1, y: 0 })
      // )

      // const rightBlock: Block = blocks.getValue(
      //   vec2Add(position, { x: 1, y: 0 })
      // )

      const isBeingPowered = leftBlock.isOutputtingPower()
      const right2Block: Block = blocks.getValue(
        vec2Add(position, { x: 2, y: 0 })
      )
      // const isExtended = // (retraction, extension)
      //   (isBlock<PistonHead>(rightBlock, BlockType.PistonHead) &&
      //     isBlock<GlassBlock>(right2Block, BlockType.GlassBlock) &&
      //     right2Block.movement !== Movement.RetractionPending) ||
      //   (isBlock<GlassBlock>(rightBlock, BlockType.GlassBlock) &&
      //     rightBlock.movement === Movement.Pending &&
      //     isBlock<GlassBlock>(right2Block, BlockType.GlassBlock) &&
      //     right2Block.movement === Movement.Complete)
      return createPiston({ isBeingPowered, direction })
    },
    toString: function () {
      // function allows `this` to refer to the RedstoneTorch
      return `P${isBeingPowered ? '*' : ''}`
    },
    getTextureName: (position: Vec2, blocks: Array2D<Block>) => {
      const frontBlock: Block = getNeighbourBlock(
        position,
        blocks,
        Direction.Up
      )
      const isExtended = isBlock<PistonHead>(frontBlock, BlockType.PistonHead)
      const tex = `piston${
        isExtended ? '_extended' : ''
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
