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
  OutputPowerBlock,
  OutputSignalStrengthBlock
} from '../core/powerable_block'
import { CanvasGridCell, CanvasGridItem } from '../rendering/canvas'
import { getNeighbourBlock } from '../utils/block_fetching'
import { addCreateBlockFunction } from '../utils/create_block'
import { ConnectsToRedstoneDustBlock } from './redstone_dust'

export class RedstoneJunction
  implements
    Block,
    OutputPowerBlock.Traits,
    ConnectsToRedstoneDustBlock.Traits,
    OutputSignalStrengthBlock.Traits {
  type: BlockType = BlockType.RedstoneJunction
  inputPowerStrength: Record<Direction, number>

  constructor ({
    inputPowerStrength = {
      [Direction.Up]: 0,
      [Direction.Down]: 0,
      [Direction.Left]: 0,
      [Direction.Right]: 0
    }
  }: {
    inputPowerStrength?: Record<Direction, number>
  } = {}) {
    this.inputPowerStrength = inputPowerStrength
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    let newState = { ...this }

    let inputPowerStrength: Record<Direction, number> = {
      [Direction.Up]: 0,
      [Direction.Down]: 0,
      [Direction.Left]: 0,
      [Direction.Right]: 0
    }
    for (const direction of getAllDirections()) {
      const neighbour: Block = getNeighbourBlock(position, blocks, direction)

      let neighbourPowerStrength = 0
      if (
        OutputSignalStrengthBlock.isBlock(neighbour) &&
        !isBlock<RedstoneJunction>(neighbour, BlockType.RedstoneJunction)
      ) {
        neighbourPowerStrength = neighbour.getOutputPowerStrength(
          getOppositeDirection(direction)
        )
      } else if (
        OutputPowerBlock.isBlock(neighbour) &&
        neighbour.getOutputPower(getOppositeDirection(direction)) ===
          BinaryPower.Strong &&
        !isBlock<RedstoneJunction>(neighbour, BlockType.RedstoneJunction)
      ) {
        neighbourPowerStrength = 15
      }

      if (neighbourPowerStrength) {
        // isPowered = true
        // newState.powerStrength = 15
        inputPowerStrength[direction] = neighbourPowerStrength
      } else if (
        isBlock<RedstoneJunction>(neighbour, BlockType.RedstoneJunction)
      ) {
        const powerStrength = Math.max(
          neighbour.getOutputPowerStrength(getOppositeDirection(direction)) - 1,
          0
        )
        if (powerStrength >= this.getInternalPowerStrength()) {
          inputPowerStrength[direction] = powerStrength
        }
      }
    }

    newState.inputPowerStrength = inputPowerStrength
    return new RedstoneJunction(newState)
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    let newState = { ...this }

    return new RedstoneJunction(newState)
  }

  public getTextureName (): CanvasGridItem {
    const hasVerticalPower = this.getOutputPowerStrength(Direction.Up)

    const hasHorizontalPower = this.getOutputPowerStrength(Direction.Left)

    return {
      layers: [
        {
          textureName: `junction`
        },
        {
          textureName: hasVerticalPower ? `junction_on_vertical` : ''
        },
        {
          textureName: hasHorizontalPower ? `junction_on_horizontal` : ''
        }
      ].filter(x => x.textureName !== '')
    } as CanvasGridCell
  }

  private getInternalPowerStrength () {
    const powerStrengths = getAllDirections().map(
      direction => this.inputPowerStrength[direction]
    )
    const powerStrength = Math.max(Math.max(...powerStrengths), 0)
    return powerStrength
  }

  public getOutputPowerStrength (direction: Direction) {
    let outputPower: number
    if ([Direction.Up, Direction.Down].includes(direction)) {
      outputPower = Math.max(
        this.inputPowerStrength.Up,
        this.inputPowerStrength.Down
      )
    } else {
      outputPower = Math.max(
        this.inputPowerStrength.Left,
        this.inputPowerStrength.Right
      )
    }

    return Math.max(outputPower - 1, 0)
  }

  public getOutputPower (direction: Direction): BinaryPower {
    const powerStrength = this.getOutputPowerStrength(direction)
    if (powerStrength > 0) {
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

addCreateBlockFunction(BlockType.RedstoneJunction, RedstoneJunction)
