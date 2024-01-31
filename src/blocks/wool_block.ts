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
import { BinaryPower, OutputPowerBlock } from '../core/powerable_block'
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

export class WoolBlock
  implements MoveableBlock, OutputPowerBlock.Traits, ObserverFilter {
  type: BlockType = BlockType.WoolBlock
  movement: Movement
  movementDirection: Direction
  outputPower: BinaryPower
  color: Color

  constructor ({
    movement = Movement.None,
    movementDirection = Direction.Up,
    outputPower = BinaryPower.None,
    color = Color.White
  }: {
    movement?: Movement
    movementDirection?: Direction
    outputPower?: BinaryPower
    isPowered?: boolean
    color?: Color
  } = {}) {
    this.movement = movement
    this.movementDirection = movementDirection
    this.outputPower = outputPower
    this.color = color
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
      return new WoolBlock(newState)
    }
  }

  public getTextureName (): string {
    return `${this.color}_wool` + getMovementTextureName(this)
  }

  public getOutputPower (_direction: Direction): BinaryPower {
    return this.outputPower
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Moveable
  }

  public transmitsBetweenSelf (): boolean {
    return false
  }

  public copy (): BlockState {
    return { type: this.type, color: this.color } as BlockState
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
