import { Vec2 } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  DirectionalBlock,
  isBlock
} from '../core/block'
import { Direction } from '../core/direction'
import {
  getNeighbourBlock,
  getOppositeRelativeDirection
} from '../utils/block_fetching'
import { addCreateBlockFunction } from '../utils/create_block'

export class RedstoneRepeater implements DirectionalBlock {
  type: BlockType = BlockType.RedstoneRepeater
  ticksOn: number
  ticksOff: number
  isPowered: boolean // is outputting power
  direction: Direction

  constructor ({
    ticksOn = 0,
    ticksOff = 1,
    isPowered = false,
    direction = Direction.Up
  }: {
    ticksOn?: number
    ticksOff?: number
    isPowered?: boolean
    direction?: Direction
  } = {}) {
    this.ticksOn = ticksOn
    this.ticksOff = ticksOff
    this.isPowered = isPowered
    this.direction = direction
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    return new RedstoneRepeater(this)
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    const backBlock: Block = getNeighbourBlock(position, blocks, Direction.Down)

    const isLocked = [Direction.Left, Direction.Right].some(direction => {
      const neighbour: Block = getNeighbourBlock(position, blocks, direction)

      const isLocking =
        isBlock<RedstoneRepeater>(neighbour, BlockType.RedstoneRepeater) &&
        neighbour.isOutputtingPower(
          getOppositeRelativeDirection(position, blocks, direction)
        )

      return isLocking
    })

    const isBeingPowered = backBlock.isOutputtingPower(this.direction)

    let ticksOn = this.ticksOn
    let ticksOff = this.ticksOff
    let isPowered = this.isPowered

    if (isLocked) {
      if (isPowered) {
        ticksOn += ticksOff
        ticksOff = 0
      } else {
        ticksOff += ticksOn
        ticksOn = 0
      }
    } else {
      // increment cooldown
      if (isBeingPowered && this.ticksOff > 0) {
        ticksOn += 1
        ticksOff -= 1
      } else if (!isBeingPowered && this.ticksOn > 0) {
        ticksOn -= 1
        ticksOff += 1
      }

      // change isPowered if cooldown reached
      if (isPowered && ticksOn === 0) {
        isPowered = false
      } else if (!isPowered && ticksOff === 0) {
        isPowered = true
      }

      // off-cooldown reset if powered while outputting power
      if (isBeingPowered && isPowered) {
        ticksOn += ticksOff
        ticksOff = 0
      }
    }

    return new RedstoneRepeater({ ...this, ticksOn, ticksOff, isPowered })
  }

  public toString (): string {
    return 'RR'
  }

  public getTextureName (): string {
    return `redstone_repeater_on_${this.ticksOn}_off_${this.ticksOff}${
      this.isPowered && this.ticksOff > 0 ? '_powered' : ''
    }_${this.direction.toLowerCase()}`
  }

  public isOutputtingPower (direction: Direction): boolean {
    return this.isPowered && direction === this.direction
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Immovable
  }
}

addCreateBlockFunction(BlockType.RedstoneRepeater, RedstoneRepeater)
