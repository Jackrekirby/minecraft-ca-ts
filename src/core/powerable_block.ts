import { Vec2 } from '../containers/vec2'
import { getNeighbourBlock } from '../utils/block_fetching'
import { Block, BlockContainer } from './block'
import { Direction, getAllDirections, getOppositeDirection } from './direction'

export enum BinaryPower {
  None = 'None',
  Strong = 'Strong',
  Weak = 'Weak'
}

export enum PowerHardness {
  Hard = 'hard',
  Soft = 'soft'
}

export namespace OutputPowerBlock {
  export interface Traits {
    getOutputPower: (direction: Direction) => BinaryPower
    getPowerHardness: (direction: Direction) => PowerHardness
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
        const oppositeDirection = getOppositeDirection(direction)
        if (
          neighbour.getPowerHardness &&
          neighbour.getPowerHardness(oppositeDirection) === PowerHardness.Hard
        ) {
          inputPower = neighbour.getOutputPower(oppositeDirection)
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

export const getInputSignalStrength = (
  position: Vec2,
  blocks: BlockContainer
): number => {
  let signalStrength = 0
  for (const direction of getAllDirections()) {
    const neighbour: Block = getNeighbourBlock(position, blocks, direction)

    if (OutputPowerBlock.isBlock(neighbour)) {
      const oppositeDirection = getOppositeDirection(direction)

      // TODO: assuming this is for blocks, they do not output soft power
      // so this should really be getOutputSignalStrengthOfSolidBlock
      if (neighbour.getPowerHardness(direction) === PowerHardness.Hard) {
        const outputPower = neighbour.getOutputPower(oppositeDirection)
        if ([BinaryPower.Strong, BinaryPower.Weak].includes(outputPower)) {
          if (OutputSignalStrengthBlock.isBlock(neighbour)) {
            const powerStrength = neighbour.getOutputPowerStrength(
              getOppositeDirection(direction)
            )
            if (powerStrength == 15) {
              return 15
            } else if (powerStrength > signalStrength) {
              signalStrength = powerStrength
            }
          } else {
            return 15
          }
        }
      }
    }
  }

  return signalStrength
}
