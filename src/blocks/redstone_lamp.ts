import { Vec2 } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
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
  IsPoweredBlock,
  OutputPowerBlock
} from '../core/powerable_block'
import { CanvasGridCell, CanvasGridItem } from '../rendering/canvas'

import { addCreateBlockFunction } from '../utils/create_block'
import { ObserverFilter } from './observer_block'

export class RedstoneLamp
  implements
    MoveableBlock,
    OutputPowerBlock.Traits,
    IsPoweredBlock.Traits,
    ObserverFilter {
  type: BlockType = BlockType.RedstoneLamp
  movement: Movement
  movementDirection: Direction
  outputPower: BinaryPower
  isPowered: boolean

  constructor ({
    movement = Movement.None,
    movementDirection = Direction.Up,
    outputPower = BinaryPower.None,
    isPowered = false
  }: {
    movement?: Movement
    movementDirection?: Direction
    outputPower?: BinaryPower
    isPowered?: boolean
  } = {}) {
    this.movement = movement
    this.movementDirection = movementDirection
    this.outputPower = outputPower
    this.isPowered = isPowered
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

      return new RedstoneLamp(newState)
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
      Object.assign(newState, OutputPowerBlock.update(this, position, blocks))
      Object.assign(newState, IsPoweredBlock.update(this, position, blocks))
      Object.assign(newState, movementUpdateChange.state)
      return new RedstoneLamp(newState)
    }
  }

  public getTextureName (): CanvasGridItem {
    return {
      layers: [
        {
          textureName: `redstone_lamp_${this.isPowered ? 'on' : 'off'}`
        },
        getMovementTextureName(this)
      ].filter(x => x.textureName !== '')
    } as CanvasGridCell
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

  public filteredState (): Record<string, any> {
    return {
      type: this.type,
      outputPower: this.outputPower,
      movement: observerFilteredMovement(this.movement)
    }
  }
}

addCreateBlockFunction(BlockType.RedstoneLamp, RedstoneLamp)
