import { Vec2 } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  isBlock
} from '../core/block'
import {
  Direction,
  getAllDirections,
  getOppositeDirection
} from '../core/direction'
import {
  BinaryPower,
  IsPoweredBlock,
  OutputPowerBlock
} from '../core/powerable_block'
import { getNeighbourBlock } from '../utils/block_fetching'
import { addCreateBlockFunction } from '../utils/create_block'

export namespace ConnectsToRedstoneDustBlock {
  export interface Traits {
    doesConnectToRedstoneDust: (direction: Direction) => boolean
  }

  export function isBlock (block: object): block is Traits {
    return 'doesConnectToRedstoneDust' in block
  }
}

export class RedstoneDust
  implements
    Block,
    OutputPowerBlock.Traits,
    IsPoweredBlock.Traits,
    ConnectsToRedstoneDustBlock.Traits {
  type: BlockType = BlockType.RedstoneDust
  outputPower: BinaryPower
  isPowered: boolean
  powerStrength: number
  connectedDirections: Direction[]

  constructor ({
    outputPower = BinaryPower.None,
    isPowered = false,
    powerStrength = 0,
    connectedDirections = []
  }: {
    outputPower?: BinaryPower
    isPowered?: boolean
    powerStrength?: number
    connectedDirections?: Direction[]
  } = {}) {
    this.outputPower = outputPower
    this.isPowered = isPowered
    this.powerStrength = powerStrength
    this.connectedDirections = connectedDirections
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

    let isPowered = false
    for (const direction of getAllDirections()) {
      const neighbour: Block = getNeighbourBlock(position, blocks, direction)

      const isBeingPowered =
        OutputPowerBlock.isBlock(neighbour) &&
        neighbour.getOutputPower(getOppositeDirection(direction)) ===
          BinaryPower.Strong &&
        !isBlock<RedstoneDust>(neighbour, BlockType.RedstoneDust)

      if (isBeingPowered) {
        isPowered = true
        break
      }
    }

    newState.isPowered = isPowered
    newState.connectedDirections = this.calculateConnectedDirections(
      position,
      blocks
    )

    return new RedstoneDust(newState)
  }

  public toString (): string {
    return 'RD'
  }

  private calculateConnectedDirections (
    position: Vec2,
    blocks: BlockContainer
  ) {
    let connectedDirections = getAllDirections().filter(direction => {
      const neighbour = getNeighbourBlock(position, blocks, direction)
      return (
        ConnectsToRedstoneDustBlock.isBlock(neighbour) &&
        neighbour.doesConnectToRedstoneDust(getOppositeDirection(direction))
      )
    })

    if (connectedDirections.length === 1) {
      const oppositeDirection = getOppositeDirection(connectedDirections[0])
      connectedDirections.push(oppositeDirection)
    }

    connectedDirections = getAllDirections().filter(direction =>
      connectedDirections.includes(direction)
    )

    return connectedDirections
  }

  public getTextureName (position: Vec2, blocks: BlockContainer): string {
    let tex = 'redstone_dust'
    this.connectedDirections.forEach(
      direction => (tex += '_' + direction.toLowerCase())
    )
    tex += '_' + this.powerStrength
    return tex
  }

  // public isOutputtingPower (direction: Direction): boolean {
  //   return (
  //     this.powerStrength > 0 &&
  //     (this.connectedDirections.length == 0 ||
  //       this.connectedDirections.includes(direction))
  //   )
  // }

  public getOutputPower (direction: Direction): BinaryPower {
    if (
      this.powerStrength > 0 &&
      (this.connectedDirections.length == 0 ||
        this.connectedDirections.includes(direction))
    ) {
      return BinaryPower.Weak
    } else {
      return BinaryPower.None
    }
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Breaks
  }

  public doesConnectToRedstoneDust (_direction: Direction): boolean {
    return true
  }

  public transmitsBetweenSelf (): boolean {
    return true
  }
}

addCreateBlockFunction(BlockType.RedstoneDust, RedstoneDust)
