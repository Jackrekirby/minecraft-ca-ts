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
  getOppositeDirection,
  getOtherDirections
} from '../core/direction'
import {
  BinaryPower,
  OutputPowerBlock,
  OutputSignalStrengthBlock,
  PowerHardness
} from '../core/powerable_block'
import { storage } from '../core/storage'
import {
  CanvasGridCell,
  CanvasGridCellLayer,
  CanvasGridItem
} from '../rendering/canvas'
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
    // IsPoweredBlock.Traits,
    ConnectsToRedstoneDustBlock.Traits,
    OutputSignalStrengthBlock.Traits {
  type: BlockType = BlockType.RedstoneDust
  outputPower: BinaryPower
  // isPowered: boolean
  inputPowerStrength: Record<Direction, number>
  connectedDirections: Direction[]

  constructor ({
    outputPower = BinaryPower.None,
    // isPowered = false,
    inputPowerStrength = {
      [Direction.Up]: 0,
      [Direction.Down]: 0,
      [Direction.Left]: 0,
      [Direction.Right]: 0
    },
    connectedDirections = []
  }: {
    outputPower?: BinaryPower
    isPowered?: boolean
    inputPowerStrength?: Record<Direction, number>
    connectedDirections?: Direction[]
  } = {}) {
    this.outputPower = outputPower // TODO: this is not being used!
    // this.isPowered = isPowered
    this.inputPowerStrength = inputPowerStrength
    this.connectedDirections = connectedDirections
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    let newState = { ...this }
    // let powerStrength = this.powerStrength
    // for (const direction of getAllDirections()) {
    //   const neighbour: Block = getNeighbourBlock(position, blocks, direction)

    //   if (isBlock<RedstoneDust>(neighbour, BlockType.RedstoneDust)) {
    //     if (neighbour.powerStrength - 1 > powerStrength) {
    //       powerStrength = neighbour.powerStrength - 1
    //     }
    //   }
    // }
    // newState.powerStrength = powerStrength

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
        !isBlock<RedstoneDust>(neighbour, BlockType.RedstoneDust)
      ) {
        neighbourPowerStrength = neighbour.getOutputPowerStrength(
          getOppositeDirection(direction)
        )
      } else if (
        OutputPowerBlock.isBlock(neighbour) &&
        neighbour.getOutputPower(getOppositeDirection(direction)) ===
          BinaryPower.Strong &&
        !isBlock<RedstoneDust>(neighbour, BlockType.RedstoneDust)
      ) {
        neighbourPowerStrength = 15
      }

      if (neighbourPowerStrength) {
        // isPowered = true
        // newState.powerStrength = 15
        inputPowerStrength[direction] = neighbourPowerStrength
      } else if (isBlock<RedstoneDust>(neighbour, BlockType.RedstoneDust)) {
        const powerStrength = Math.max(
          neighbour.getOutputPowerStrength(getOppositeDirection(direction)) - 1,
          0
        )
        if (powerStrength >= this.getInternalPowerStrength()) {
          inputPowerStrength[direction] = powerStrength
        }
      }
    }
    // newState.
    // newState.isPowered = isPowered
    newState.inputPowerStrength = inputPowerStrength
    return new RedstoneDust(newState)
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    let newState = { ...this }

    Object.assign(newState, OutputPowerBlock.update(this, position, blocks))

    newState.connectedDirections = this.calculateConnectedDirections(
      position,
      blocks
    )

    return new RedstoneDust(newState)
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

  public getTextureName (): CanvasGridItem {
    let tex = 'redstone_dust'
    this.connectedDirections.forEach(
      direction => (tex += '_' + direction.toLowerCase())
    )
    let signalStrength = this.getInternalPowerStrength()
    // tex += signalStrength > 0 ? '_on' : '_off'
    tex += '_' + signalStrength
    return {
      layers: [
        {
          textureName: tex
          // mask: (i, v) => {
          //   switch (i % 4) {
          //     case 0:
          //       return (v / 255) * (90 + (255 - 90) * (signalStrength / 15))
          //     case 1:
          //       return v * 0
          //     case 2:
          //       return v * 0
          //     default:
          //       return v
          //   }
          // }
        } as CanvasGridCellLayer,
        {
          textureName: storage.viewSignalStrengthState.get()
            ? `number_${signalStrength}`
            : '',
          blendMode: 'source-over',
          alpha: 1.0,
          minSize: 32
        } as CanvasGridCellLayer
      ].filter(x => x.textureName !== '')
    } as CanvasGridCell
  }

  // public isOutputtingPower (direction: Direction): boolean {
  //   return (
  //     this.powerStrength > 0 &&
  //     (this.connectedDirections.length == 0 ||
  //       this.connectedDirections.includes(direction))
  //   )
  // }

  private getInternalPowerStrength () {
    const powerStrengths = getAllDirections().map(
      direction => this.inputPowerStrength[direction]
    )
    const powerStrength = Math.max(Math.max(...powerStrengths), 0)
    return powerStrength
  }

  public getOutputPowerStrength (direction: Direction) {
    const powerStrengths = getOtherDirections(direction).map(
      direction => this.inputPowerStrength[direction]
    )
    const powerStrength = Math.max(Math.max(...powerStrengths), 0)
    return powerStrength
  }

  public getPowerHardness (direction: Direction): PowerHardness {
    return PowerHardness.Hard
  }

  public getOutputPower (direction: Direction): BinaryPower {
    const powerStrength = this.getOutputPowerStrength(direction)
    if (
      powerStrength > 0 &&
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
}

addCreateBlockFunction(BlockType.RedstoneDust, RedstoneDust)
