import { Vec2 } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  DirectionalBlock,
  MoveableBlock,
  Movement
} from '../core/block'
import { Direction } from '../core/direction'

import {
  getMovementTextureName,
  MovementUpdateChange,
  MovementUpdateType,
  updateMovement,
  updateSubMovement
} from '../core/moveable_block'
import { BinaryPower, OutputPowerBlock } from '../core/powerable_block'
import { getNeighbourBlock } from '../utils/block_fetching'

import { addCreateBlockFunction } from '../utils/create_block'
import { areObjectsEqual } from '../utils/general'
import { Air } from './air'

export class ObserverBlock
  implements MoveableBlock, DirectionalBlock, OutputPowerBlock.Traits {
  type: BlockType = BlockType.ObserverBlock

  movement: Movement
  movementDirection: Direction
  direction: Direction

  lastObservation: Block
  hasObservedChange: boolean

  constructor ({
    direction = Direction.Up,
    movement = Movement.None,
    movementDirection = Direction.Up,
    lastObservation = new Air(),
    hasObservedChange = false
  }: {
    direction?: Direction
    movement?: Movement
    movementDirection?: Direction
    lastObservation?: Block
    hasObservedChange?: boolean
  } = {}) {
    this.direction = direction
    this.movement = movement
    this.movementDirection = movementDirection
    this.lastObservation = lastObservation
    this.hasObservedChange = hasObservedChange
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
      const currentObservation: Block = getNeighbourBlock(
        position,
        blocks,
        Direction.Down
      )

      if (this.hasObservedChange) {
        newState.hasObservedChange = false
      } else if (
        [Movement.Complete, Movement.RetractionComplete].includes(this.movement)
      ) {
        newState.hasObservedChange = true
      } else if (!areObjectsEqual(currentObservation, this.lastObservation)) {
        newState.hasObservedChange = true
      } else {
        newState.hasObservedChange = false
      }
      newState.lastObservation = currentObservation

      return new ObserverBlock(newState)
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
      return new ObserverBlock(newState)
    }
  }

  public toString (): string {
    return 'Observer'
  }

  public getTextureName (): string {
    return (
      `observer_${
        this.hasObservedChange ? 'on' : 'off'
      }_${this.direction.toLowerCase()}` + getMovementTextureName(this)
    )
  }

  public getOutputPower (direction: Direction): BinaryPower {
    if (this.hasObservedChange && direction === this.direction) {
      return BinaryPower.Strong
    } else {
      return BinaryPower.None
    }
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Moveable
  }

  public transmitsBetweenSelf (): boolean {
    return true
  }
}

addCreateBlockFunction(BlockType.ObserverBlock, ObserverBlock)
