import { Vec2 } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  DirectionalBlock,
  isBlock
} from '../core/block'
import { Direction, getOppositeDirection } from '../core/direction'
import { BinaryPower, OutputPowerBlock } from '../core/powerable_block'
import { CanvasGridCell, CanvasGridItem } from '../rendering/canvas'
import {
  getNeighbourBlock,
  getOppositeRelativeDirection
} from '../utils/block_fetching'
import { addCreateBlockFunction } from '../utils/create_block'
import { createObjectSubset } from '../utils/general'
import { ObserverFilter } from './observer_block'
import { ConnectsToRedstoneDustBlock } from './redstone_dust'

export class RedstoneRepeater
  implements
    DirectionalBlock,
    ConnectsToRedstoneDustBlock.Traits,
    OutputPowerBlock.Traits,
    ObserverFilter {
  type: BlockType = BlockType.RedstoneRepeater
  ticksOn: number
  ticksOff: number
  isPowered: boolean // is outputting power
  direction: Direction
  isLocked: boolean

  constructor ({
    ticksOn = 0,
    ticksOff = 1,
    isPowered = false,
    direction = Direction.Up,
    isLocked = false
  }: {
    ticksOn?: number
    ticksOff?: number
    isPowered?: boolean
    direction?: Direction
    isLocked?: boolean
  } = {}) {
    this.ticksOn = ticksOn
    this.ticksOff = ticksOff
    this.isPowered = isPowered
    this.direction = direction
    this.isLocked = isLocked
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
        OutputPowerBlock.isOutputtingPower(
          neighbour,
          getOppositeRelativeDirection(position, blocks, direction)
        )

      return isLocking
    })

    const isBeingPowered = OutputPowerBlock.isOutputtingPower(
      backBlock,
      this.direction
    )

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
      if (isPowered && !isBeingPowered && this.ticksOn > 0) {
        ticksOn -= 1
        ticksOff += 1
      } else if (!isPowered && this.ticksOn > 0) {
        ticksOn += 1
        ticksOff -= 1
      } else if (isBeingPowered && this.ticksOff > 0) {
        ticksOn += 1
        ticksOff -= 1
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

    return new RedstoneRepeater({
      ...this,
      ticksOn,
      ticksOff,
      isPowered,
      isLocked
    })
  }

  public getTextureName (): CanvasGridItem {
    const texDirection = this.direction.toLowerCase()
    return {
      layers: [
        {
          textureName: `redstone_repeater_base_${texDirection}`
        },
        {
          textureName: `redstone_repeater_on_${this.ticksOn}_off_${
            this.ticksOff
          }${
            this.isPowered && this.ticksOff > 0 ? '_powered' : ''
          }_${texDirection}`
        },
        {
          textureName: this.isLocked
            ? `redstone_repeater_locked_${texDirection}`
            : ''
        }
      ].filter(x => x.textureName !== '')
    } as CanvasGridCell
  }

  public getOutputPower (direction: Direction): BinaryPower {
    if (this.isPowered && direction === this.direction) {
      return BinaryPower.Strong
    } else {
      return BinaryPower.None
    }
  }
  public transmitsBetweenSelf (): boolean {
    return true
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Immovable
  }

  public doesConnectToRedstoneDust (direction: Direction): boolean {
    return (
      direction === this.direction ||
      direction === getOppositeDirection(this.direction)
    )
  }

  public interact (): Block {
    let ticksOn = this.ticksOn,
      ticksOff = this.ticksOff

    if (this.isPowered) {
      ticksOn = ((ticksOn + ticksOff) % 4) + 1
      ticksOff = 0
    } else {
      ticksOff = ((ticksOn + ticksOff) % 4) + 1
      ticksOn = 0
    }

    return new RedstoneRepeater({ ...this, ticksOn, ticksOff })
  }

  public filteredState (): Record<string, any> {
    return createObjectSubset(this, [
      'type',
      'isPowered',
      'direction'
      // not ticksOn / ticksOff
    ])
  }
}

addCreateBlockFunction(BlockType.RedstoneRepeater, RedstoneRepeater)
