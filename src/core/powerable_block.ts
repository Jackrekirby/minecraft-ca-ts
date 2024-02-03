import { Vec2 } from '../containers/vec2'
import { getNeighbourBlock } from '../utils/block_fetching'
import { Block, BlockContainer } from './block'
import { Direction, getAllDirections, getOppositeDirection } from './direction'

export enum BinaryPower {
  None = 'None',
  Strong = 'Strong',
  Weak = 'Weak'
}

export namespace OutputPowerBlock {
  export interface Traits {
    getOutputPower: (direction: Direction) => BinaryPower
    transmitsBetweenSelf: () => boolean
  }

  export function isBlock (block: object): block is Traits {
    return 'getOutputPower' in block
  }

  export const update = (
    state: Traits,
    position: Vec2,
    blocks: BlockContainer
  ): object => {
    let outputPower = BinaryPower.None
    for (const direction of getAllDirections()) {
      const neighbour: Block = getNeighbourBlock(position, blocks, direction)

      let inputPower: BinaryPower = BinaryPower.None

      if (OutputPowerBlock.isBlock(neighbour)) {
        if (state.transmitsBetweenSelf() || neighbour.transmitsBetweenSelf()) {
          inputPower = neighbour.getOutputPower(getOppositeDirection(direction))
        }
      }

      if (inputPower === BinaryPower.Strong) {
        outputPower = BinaryPower.Strong
        break
      } else if (
        outputPower === BinaryPower.None &&
        inputPower === BinaryPower.Weak
      ) {
        outputPower = BinaryPower.Weak
      }
    }

    return { outputPower }
  }

  export const isOutputtingPower = (block: Block, direction: Direction) => {
    const isBeingPowered =
      OutputPowerBlock.isBlock(block) &&
      block.getOutputPower(direction) !== BinaryPower.None

    return isBeingPowered
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

      const isBeingPowered =
        OutputPowerBlock.isBlock(neighbour) &&
        neighbour.getOutputPower(getOppositeDirection(direction)) !==
          BinaryPower.None

      if (isBeingPowered) {
        isPowered = true
        break
      }
    }

    return { isPowered }
  }
}

export namespace OutputSignalStrengthBlock {
  export interface Traits {
    getOutputPowerStrength: (direction: Direction) => number
  }

  export function isBlock (block: object): block is Traits {
    return 'getOutputPowerStrength' in block
  }
}
