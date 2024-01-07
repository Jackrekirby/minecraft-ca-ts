import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  DirectionalBlock
} from '../block'
import { Vec2 } from '../containers/vec2'
import { Direction, getOppositeDirection } from '../direction'
import { getNeighbourBlock } from '../utils/block_fetching'
import { addCreateBlockFunction } from '../utils/create_block'

export interface RedstoneTorch extends DirectionalBlock {
  type: BlockType.RedstoneTorch
  isBeingPowered: boolean
}

export const createRedstoneTorch = (state: {
  isBeingPowered?: boolean
  direction?: Direction
}): RedstoneTorch => {
  const { isBeingPowered = false, direction = Direction.Up } = state
  const isOn = !isBeingPowered
  return {
    type: BlockType.RedstoneTorch,
    isBeingPowered,
    direction,
    update: (position: Vec2, blocks: BlockContainer): Block => {
      const backBlock: Block = getNeighbourBlock(
        position,
        blocks,
        Direction.Down
      )

      const isBeingPowered = backBlock.isOutputtingPower(direction)

      return createRedstoneTorch({ isBeingPowered, direction })
    },
    toString: function () {
      return `RT${isOn ? '*' : ''}`
    },
    getTextureName: function () {
      return `redstone_torch_${isOn ? 'on' : 'off'}_${direction.toLowerCase()}`
    },
    isOutputtingPower: function (direction: Direction) {
      return direction !== getOppositeDirection(this.direction) && isOn
    },
    getMovementMethod: () => BlockMovement.Immovable
  }
}

addCreateBlockFunction(BlockType.RedstoneTorch, createRedstoneTorch)
