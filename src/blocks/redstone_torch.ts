import { Block, BlockType, BlockMovement } from '../block'
import { Array2D } from '../containers/array2d'
import { Vec2, vec2Add } from '../containers/vec2'

export interface RedstoneTorch extends Block {
  type: BlockType.RedstoneTorch
  isBeingPowered: boolean
}

export const createRedstoneTorch = (
  isBeingPowered: boolean = false
): RedstoneTorch => ({
  type: BlockType.RedstoneTorch,
  isBeingPowered,
  update: (position: Vec2, blocks: Array2D<Block>): Block => {
    const leftBlock: Block = blocks.getValue(vec2Add(position, { x: -1, y: 0 }))
    const isBeingPowered = leftBlock.isOutputtingPower()
    return createRedstoneTorch(isBeingPowered)
  },
  toString: function () {
    // function allows `this` to refer to the RedstoneTorch
    return `RT${this.isOutputtingPower() ? '*' : ''}`
  },
  getTextureName: function () {
    return `redstone_torch${this.isOutputtingPower() ? '' : '_off'}`
  },
  isOutputtingPower: () => !isBeingPowered,
  getMovementMethod: () => BlockMovement.Immovable
})
