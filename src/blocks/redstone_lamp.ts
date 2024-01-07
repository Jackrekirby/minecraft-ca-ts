import { Block, BlockContainer, BlockMovement, BlockType } from '../block'
import { Vec2 } from '../containers/vec2'
import { getAllDirections, getOppositeDirection } from '../direction'
import { getNeighbourBlock } from '../utils/block_fetching'
import { addCreateBlockFunction } from '../utils/create_block'

export interface RedstoneLamp extends Block {
  type: BlockType.RedstoneLamp
  isBeingPowered: boolean
}

export const createRedstoneLamp = (state: {
  isBeingPowered?: boolean
}): RedstoneLamp => {
  const { isBeingPowered = false } = state
  return {
    type: BlockType.RedstoneLamp,
    isBeingPowered,
    update: (position: Vec2, blocks: BlockContainer): Block => {
      for (const direction of getAllDirections()) {
        const neighbour: Block = getNeighbourBlock(position, blocks, direction)

        const isBeingPowered = neighbour.isOutputtingPower(
          getOppositeDirection(direction)
        )
        if (isBeingPowered) {
          return createRedstoneLamp({ isBeingPowered: true })
        }
      }
      return createRedstoneLamp({ isBeingPowered: false })
    },
    toString: () => 'RDB',
    getTextureName: () => `redstone_lamp_${isBeingPowered ? 'on' : 'off'}`,
    isOutputtingPower: () => false,
    getMovementMethod: () => BlockMovement.Immovable // TODO make moveable
  }
}

addCreateBlockFunction(BlockType.RedstoneLamp, createRedstoneLamp)
