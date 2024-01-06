import { Block, BlockMovement, BlockType, isBlock, Movement } from '../block'
import { Array2D } from '../containers/array2d'
import { Vec2, vec2Add } from '../containers/vec2'
import { GlassBlock, createGlassBlock } from './glass_block'
import { Piston } from './piston'

export interface PistonHead extends Block {
  type: BlockType.PistonHead
  isRetracting: boolean
}

export const createPistonHead = (
  isRetracting: boolean = false
): PistonHead => ({
  type: BlockType.PistonHead,
  isRetracting,
  update: (position: Vec2, blocks: Array2D<Block>): Block => {
    const leftBlock: Block = blocks.getValue(vec2Add(position, { x: -1, y: 0 }))
    const rightBlock: Block = blocks.getValue(vec2Add(position, { x: 1, y: 0 }))

    if (
      isRetracting &&
      isBlock<GlassBlock>(rightBlock, BlockType.GlassBlock) &&
      rightBlock.movement === Movement.RetractionPending
    ) {
      return createGlassBlock(Movement.RetractionComplete)
    }
    if (
      isBlock<Piston>(leftBlock, BlockType.Piston) &&
      !leftBlock.isBeingPowered
    ) {
      return createPistonHead(true)
    }
    return createPistonHead(false)
  },
  toString: function () {
    // function allows `this` to refer to the RedstoneTorch
    return `PH${isRetracting ? '<' : ''}`
  },
  getTextureName: function () {
    return `piston_head${isRetracting ? '_retracting' : ''}_right`
  },
  isOutputtingPower: () => false,
  getMovementMethod: () => BlockMovement.Immovable
})
