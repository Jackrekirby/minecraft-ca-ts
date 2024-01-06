import { Block, BlockType, BlockMovement, DirectionalBlock } from '../block'
import { Array2D } from '../containers/array2d'
import { Vec2 } from '../containers/vec2'
import { Direction } from '../direction'
import { getNeighbourBlock } from '../utils/block_fetching'

export interface RedstoneTorch extends DirectionalBlock {
  type: BlockType.RedstoneTorch
  isBeingPowered: boolean
}

export const createRedstoneTorch = (state: {
  isBeingPowered?: boolean
  direction?: Direction
}): RedstoneTorch => {
  const { isBeingPowered = false, direction = Direction.Up } = state
  return {
    type: BlockType.RedstoneTorch,
    isBeingPowered,
    direction,
    update: (position: Vec2, blocks: Array2D<Block>): Block => {
      const backBlock: Block = getNeighbourBlock(
        position,
        blocks,
        Direction.Down
      )

      const isBeingPowered = backBlock.isOutputtingPower()

      return createRedstoneTorch({ isBeingPowered, direction })
    },
    toString: function () {
      // function allows `this` to refer to the RedstoneTorch
      return `RT${this.isOutputtingPower() ? '*' : ''}`
    },
    getTextureName: function () {
      return `redstone_torch_${
        this.isOutputtingPower() ? 'on' : 'off'
      }_${direction.toLowerCase()}`
    },
    isOutputtingPower: () => !isBeingPowered,
    getMovementMethod: () => BlockMovement.Immovable
  }
}
