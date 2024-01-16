import { Vec2 } from '../containers/vec2'
import { getNeighbourBlock } from '../utils/block_fetching'
import { Block, BlockContainer } from './block'
import { getAllDirections, getOppositeDirection } from './direction'

export enum BinaryPower {
  None = 'None',
  Strong = 'Strong',
  Weak = 'Weak'
}

export namespace OutputPowerBlock {
  export interface Traits {
    outputPower: BinaryPower
  }

  export function isBlock (block: object): block is Traits {
    return 'outputPower' in block
  }

  export const update = (
    _state: Traits,
    position: Vec2,
    blocks: BlockContainer
  ): Traits => {
    let outputPower = BinaryPower.None
    for (const direction of getAllDirections()) {
      const neighbour: Block = getNeighbourBlock(position, blocks, direction)

      const isBeingPowered =
        neighbour.isOutputtingPower(getOppositeDirection(direction)) &&
        !isBlock(neighbour)

      if (isBeingPowered) {
        outputPower = BinaryPower.Strong
        break
      }
      // else if isBeingPowered && isBlock(neighbour, BlockType.RedstoneDust) then weak
    }

    return { outputPower }
  }
}

export namespace IsPoweredBlock {
  export interface Traits {
    isPowered: boolean
  }

  export function isBlock (block: object): block is Traits {
    return 'isPowered' in block
  }

  export const update = (
    _state: Traits,
    position: Vec2,
    blocks: BlockContainer
  ): Traits => {
    let isPowered = false
    for (const direction of getAllDirections()) {
      const neighbour: Block = getNeighbourBlock(position, blocks, direction)

      const isBeingPowered = neighbour.isOutputtingPower(
        getOppositeDirection(direction)
      )

      if (isBeingPowered) {
        isPowered = true
        break
      }
    }

    return { isPowered }
  }
}
