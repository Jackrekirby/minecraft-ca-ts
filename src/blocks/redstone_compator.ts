import { Vec2 } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  DirectionalBlock
} from '../core/block'
import { Direction } from '../core/direction'
import {
  BinaryPower,
  OutputPowerBlock,
  OutputSignalStrengthBlock,
  PowerHardness
} from '../core/powerable_block'
import { CanvasGridCell, CanvasGridItem } from '../rendering/canvas'
import {
  getNeighbourBlock,
  getOppositeRelativeDirection
} from '../utils/block_fetching'
import { addCreateBlockFunction } from '../utils/create_block'
import { createObjectSubset } from '../utils/general'
import { ObserverFilter } from './observer_block'
import { ConnectsToRedstoneDustBlock } from './redstone_dust'

enum RedstoneComparatorMode {
  Add = 'add',
  Subtract = 'subtract'
}

export namespace OutputsComparisonStrength {
  export interface Traits {
    getOutputComparisonStrength: () => number
  }

  export function isBlock (block: object): block is Traits {
    return 'getOutputComparisonStrength' in block
  }
}

export class RedstoneComparator
  implements
    DirectionalBlock,
    ConnectsToRedstoneDustBlock.Traits,
    OutputPowerBlock.Traits,
    OutputSignalStrengthBlock.Traits,
    ObserverFilter {
  type: BlockType = BlockType.RedstoneComparator
  outputSignalStrength: number
  direction: Direction
  mode: RedstoneComparatorMode

  constructor ({
    outputSignalStrength = 0,
    direction = Direction.Up,
    mode = RedstoneComparatorMode.Add
  }: {
    mode?: RedstoneComparatorMode
    outputSignalStrength?: number
    direction?: Direction
  } = {}) {
    this.mode = mode
    this.outputSignalStrength = outputSignalStrength
    this.direction = direction
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    return new RedstoneComparator(this)
  }

  private getNeighbourPowerStrength (
    position: Vec2,
    blocks: BlockContainer,
    direction: Direction
  ): number {
    let neighbourPowerStrength = 0
    const neighbour: Block = getNeighbourBlock(position, blocks, direction)
    const neighbourPowerDirection = getOppositeRelativeDirection(
      position,
      blocks,
      direction
    )
    if (OutputSignalStrengthBlock.isBlock(neighbour)) {
      neighbourPowerStrength = neighbour.getOutputPowerStrength(
        neighbourPowerDirection
      )
    } else if (OutputsComparisonStrength.isBlock(neighbour)) {
      neighbourPowerStrength = neighbour.getOutputComparisonStrength()
    } else if (
      OutputPowerBlock.isBlock(neighbour) &&
      neighbour.getOutputPower(neighbourPowerDirection) === BinaryPower.Strong
    ) {
      neighbourPowerStrength = 15
    }

    return neighbourPowerStrength
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    const backPowerStrength = this.getNeighbourPowerStrength(
      position,
      blocks,
      Direction.Down
    )

    const sidePowerStrength = Math.max(
      this.getNeighbourPowerStrength(position, blocks, Direction.Left),
      this.getNeighbourPowerStrength(position, blocks, Direction.Right)
    )

    const comparisonOperator = this.mode === RedstoneComparatorMode.Add ? 1 : -1

    const outputSignalStrength = Math.min(
      15,
      Math.max(backPowerStrength + comparisonOperator * sidePowerStrength, 0)
    )

    return new RedstoneComparator({
      ...this,
      outputSignalStrength
    })
  }

  public getTextureName (): CanvasGridItem {
    const texDirection = this.direction.toLowerCase()
    const texIsPowered = this.outputSignalStrength > 0 ? 'on' : 'off'
    return {
      layers: [
        {
          textureName: `comparator_base_${texDirection}`
        },
        {
          textureName: `comparator_${this.mode}_${texIsPowered}_${texDirection}`
        }
      ].filter(x => x.textureName !== '')
    } as CanvasGridCell
  }

  public getOutputPower (direction: Direction): BinaryPower {
    if (this.outputSignalStrength > 0 && direction === this.direction) {
      return BinaryPower.Strong
    } else {
      return BinaryPower.None
    }
  }

  public getOutputPowerStrength (direction: Direction) {
    if (direction === this.direction) {
      return this.outputSignalStrength
    } else {
      return 0
    }
  }

  public getPowerHardness (direction: Direction): PowerHardness {
    return PowerHardness.Hard
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Immovable
  }

  public doesConnectToRedstoneDust (direction: Direction): boolean {
    return true
  }

  public interact (): Block {
    const mode =
      this.mode === RedstoneComparatorMode.Add
        ? RedstoneComparatorMode.Subtract
        : RedstoneComparatorMode.Add
    return new RedstoneComparator({ ...this, mode })
  }

  public filteredState (): Record<string, any> {
    return createObjectSubset(this, ['type', 'isPowered', 'direction'])
  }
}

addCreateBlockFunction(BlockType.RedstoneComparator, RedstoneComparator)
