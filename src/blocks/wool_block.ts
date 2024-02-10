import { Vec2 } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockState,
  BlockType,
  MoveableBlock,
  Movement
} from '../core/block'
import { Direction } from '../core/direction'

import {
  getMovementTextureName,
  MovementUpdateChange,
  MovementUpdateType,
  observerFilteredMovement,
  updateMovement,
  updateSubMovement
} from '../core/moveable_block'
import {
  BinaryPower,
  getInputSignalStrength,
  OutputPowerBlock,
  OutputSignalStrengthBlock,
  PowerHardness
} from '../core/powerable_block'
import { CanvasGridCell, CanvasGridItem } from '../rendering/canvas'
import { addBlockVariant } from '../utils/block_variants'
import { addCreateBlockFunction } from '../utils/create_block'

import { ObserverFilter } from './observer_block'

export enum Color {
  Red = 'red',
  Orange = 'orange',
  Yellow = 'yellow',
  Lime = 'lime',
  Green = 'green',
  Cyan = 'cyan',
  LightBlue = 'light_blue',
  Blue = 'blue',
  Purple = 'purple',
  Magenta = 'magenta',
  Pink = 'pink',
  Brown = 'brown',
  White = 'white',
  LightGray = 'light_gray',
  Gray = 'gray',
  Black = 'black'
}

export const getColors = (): Color[] => {
  return [
    Color.Red,
    Color.Orange,
    Color.Yellow,
    Color.Lime,
    Color.Green,
    Color.Cyan,
    Color.LightBlue,
    Color.Blue,
    Color.Purple,
    Color.Magenta,
    Color.Pink,
    Color.Brown,
    Color.White,
    Color.LightGray,
    Color.Gray,
    Color.Black
  ]
}

export class WoolBlock
  implements
    MoveableBlock,
    OutputPowerBlock.Traits,
    ObserverFilter,
    OutputSignalStrengthBlock.Traits {
  type: BlockType = BlockType.WoolBlock
  movement: Movement
  movementDirection: Direction
  outputPower: BinaryPower
  color: Color
  internalSignalStrength: number

  constructor ({
    movement = Movement.None,
    movementDirection = Direction.Up,
    outputPower = BinaryPower.None,
    color = Color.White,
    internalSignalStrength = 0
  }: {
    movement?: Movement
    movementDirection?: Direction
    outputPower?: BinaryPower
    isPowered?: boolean
    color?: Color
    internalSignalStrength?: number
  } = {}) {
    this.movement = movement
    this.movementDirection = movementDirection
    this.outputPower = outputPower
    this.color = color
    this.internalSignalStrength = internalSignalStrength
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    let newState = { ...this }
    const movementUpdateChange: MovementUpdateChange = updateMovement(
      position,
      blocks,
      this.movement,
      this.movementDirection
    )

    if (movementUpdateChange.type === MovementUpdateType.BlockChange) {
      return movementUpdateChange.block
    } else {
      Object.assign(newState, movementUpdateChange.state)

      return new WoolBlock(newState)
    }
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    let newState = { ...this }
    const movementUpdateChange: MovementUpdateChange = updateSubMovement(
      position,
      blocks,
      this.movement,
      this.movementDirection
    )

    if (movementUpdateChange.type === MovementUpdateType.BlockChange) {
      return movementUpdateChange.block
    } else {
      Object.assign(newState, movementUpdateChange.state)
      Object.assign(newState, OutputPowerBlock.update(this, position, blocks))
      newState.internalSignalStrength = getInputSignalStrength(position, blocks)
      return new WoolBlock(newState)
    }
  }

  public getTextureName (): CanvasGridItem {
    return {
      layers: [
        {
          textureName: `${this.color}_wool`
        },
        getMovementTextureName(this)
      ].filter(x => x.textureName !== '')
    } as CanvasGridCell
  }

  public getOutputPower (_direction: Direction): BinaryPower {
    return this.outputPower
  }

  public getOutputPowerStrength (direction: Direction): number {
    return this.internalSignalStrength
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Moveable
  }

  public getPowerHardness (direction: Direction): PowerHardness {
    return PowerHardness.Soft
  }

  public copy (): BlockState {
    return { type: this.type, color: this.color } as BlockState
  }

  public getName (): string {
    return `${this.color}_wool`
  }

  public filteredState (): Record<string, any> {
    return {
      type: this.type,
      outputPower: this.outputPower,
      movement: observerFilteredMovement(this.movement),
      color: this.color
    }
  }
}

addCreateBlockFunction(BlockType.WoolBlock, WoolBlock)

getColors().forEach(color => addBlockVariant(new WoolBlock({ color })))
