import { Vec2 } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  isBlock
} from '../core/block'
import { getAllDirections } from '../core/direction'
import {
  BinaryPower,
  IsPoweredBlock,
  OutputPowerBlock
} from '../core/powerable_block'
import { getNeighbourBlock } from '../utils/block_fetching'
import { addCreateBlockFunction } from '../utils/create_block'

export class RedstoneDust
  implements Block, OutputPowerBlock.Traits, IsPoweredBlock.Traits {
  type: BlockType = BlockType.RedstoneDust
  outputPower: BinaryPower
  isPowered: boolean
  powerStrength: number

  constructor ({
    outputPower = BinaryPower.None,
    isPowered = false,
    powerStrength = 0
  }: {
    outputPower?: BinaryPower
    isPowered?: boolean
    powerStrength?: number
  } = {}) {
    this.outputPower = outputPower
    this.isPowered = isPowered
    this.powerStrength = powerStrength
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    let newState = { ...this }
    let powerStrength = newState.isPowered ? 15 : 0
    for (const direction of getAllDirections()) {
      const neighbour: Block = getNeighbourBlock(position, blocks, direction)

      if (isBlock<RedstoneDust>(neighbour, BlockType.RedstoneDust)) {
        if (neighbour.powerStrength - 1 > powerStrength) {
          powerStrength = neighbour.powerStrength - 1
        }
      }
    }
    newState.powerStrength = powerStrength

    return new RedstoneDust(newState)
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    let newState = { ...this }

    Object.assign(newState, OutputPowerBlock.update(this, position, blocks))
    Object.assign(newState, IsPoweredBlock.update(this, position, blocks))

    return new RedstoneDust(newState)
  }

  public toString (): string {
    return 'RD'
  }

  public getTextureName (position: Vec2, blocks: BlockContainer): string {
    let tex = 'redstone_dust'
    getAllDirections().map(direction => {
      const neighbour = getNeighbourBlock(position, blocks, direction)
      if (isBlock<RedstoneDust>(neighbour, BlockType.RedstoneDust)) {
        tex += '_' + direction.toLowerCase()
      }
    })
    tex += '_' + this.powerStrength
    return tex
  }

  public isOutputtingPower (): boolean {
    return false
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Breaks
  }
}

addCreateBlockFunction(BlockType.RedstoneDust, RedstoneDust)
