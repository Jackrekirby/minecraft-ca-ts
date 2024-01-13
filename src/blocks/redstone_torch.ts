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

export class RedstoneTorch implements DirectionalBlock {
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

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    const backBlock: Block = getNeighbourBlock(position, blocks, Direction.Down)

    const isBeingPowered = backBlock.isOutputtingPower(this.direction)

    return new RedstoneTorch({ isBeingPowered, direction: this.direction })
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    return new RedstoneTorch(this)
  }

  public toString (): string {
    return `RT${this.isOn() ? '*' : ''}`
  }

  public getTextureName (): string {
    return `redstone_torch_${
      this.isOn() ? 'on' : 'off'
    }_${this.direction.toLowerCase()}`
  }

  public isOutputtingPower (direction: Direction): boolean {
    return direction !== getOppositeDirection(this.direction) && this.isOn()
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Immovable
  }

  private isOn () {
    return !this.isBeingPowered
  }
}

addCreateBlockFunction(BlockType.RedstoneTorch, RedstoneTorch)
