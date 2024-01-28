import { Vec2 } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  DirectionalBlock
} from '../core/block'
import { Direction, getOppositeDirection } from '../core/direction'
import { BinaryPower, OutputPowerBlock } from '../core/powerable_block'
import { getNeighbourBlock } from '../utils/block_fetching'
import { addCreateBlockFunction } from '../utils/create_block'
import { ConnectsToRedstoneDustBlock } from './redstone_dust'

export class RedstoneTorch
  implements
    DirectionalBlock,
    ConnectsToRedstoneDustBlock.Traits,
    OutputPowerBlock.Traits {
  type: BlockType = BlockType.RedstoneTorch
  isBeingPowered: boolean
  direction: Direction

  constructor ({
    isBeingPowered = false,
    direction = Direction.Up
  }: { isBeingPowered?: boolean; direction?: Direction } = {}) {
    // const { isBeingPowered = false, direction = Direction.Up } = state
    this.isBeingPowered = isBeingPowered
    this.direction = direction
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    const backBlock: Block = getNeighbourBlock(position, blocks, Direction.Down)

    const isBeingPowered = OutputPowerBlock.isOutputtingPower(
      backBlock,
      this.direction
    )

    return new RedstoneTorch({ isBeingPowered, direction: this.direction })
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    return new RedstoneTorch(this)
  }

  public getTextureName (): string {
    return `redstone_torch_${
      this.isOn() ? 'on' : 'off'
    }_${this.direction.toLowerCase()}`
  }

  // public isOutputtingPower (direction: Direction): boolean {
  //   return direction !== getOppositeDirection(this.direction) && this.isOn()
  // }

  public getOutputPower (direction: Direction): BinaryPower {
    if (this.isOn() && direction !== getOppositeDirection(this.direction)) {
      return BinaryPower.Strong
    } else {
      return BinaryPower.None
    }
  }
  public transmitsBetweenSelf (): boolean {
    return false // TODO: rename powerDirectsIntoBlock
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Immovable
  }

  private isOn () {
    return !this.isBeingPowered
  }

  public doesConnectToRedstoneDust (_direction: Direction): boolean {
    return true
  }
}

addCreateBlockFunction(BlockType.RedstoneTorch, RedstoneTorch)
