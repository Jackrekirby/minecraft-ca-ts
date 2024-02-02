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
import { CanvasGridCell, CanvasGridItem } from '../rendering/canvas'
import { getNeighbourBlock } from '../utils/block_fetching'

import { addCreateBlockFunction } from '../utils/create_block'
import { areObjectsEqual, createObjectSubset } from '../utils/general'
import { Air } from './air'

export interface ObserverFilter {
  filteredState: () => Record<string, any>
}

export const hasObserverFilter = (block: object): block is ObserverFilter => {
  return 'filteredState' in block
}

export class ObserverBlock
  implements
    MoveableBlock,
    DirectionalBlock,
    OutputPowerBlock.Traits,
    ObserverFilter {
  type: BlockType = BlockType.ObserverBlock

  movement: Movement
  movementDirection: Direction
  direction: Direction

  lastObservation: Record<string, any>
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
    lastObservation?: Record<string, any>
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
      const neighbour: Block = getNeighbourBlock(
        position,
        blocks,
        Direction.Down
      )
      let currentObservation: Record<string, any> = neighbour
      if (hasObserverFilter(neighbour)) {
        currentObservation = neighbour.filteredState()
      }

      if (currentObservation)
        if (this.hasObservedChange) {
          newState.hasObservedChange = false
        } else if (
          [Movement.Complete, Movement.RetractionComplete].includes(
            this.movement
          )
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

  public getTextureName (): CanvasGridItem {
    return {
      layers: [
        {
          textureName: `observer_${
            this.hasObservedChange ? 'on' : 'off'
          }_${this.direction.toLowerCase()}`
        },
        getMovementTextureName(this)
      ].filter(x => x.textureName !== '')
    } as CanvasGridCell
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

  public filteredState (): Record<string, any> {
    return createObjectSubset(this, [
      'type',
      'hasObservedChange',
      'direction',
      'movement',
      'movementDirection'
      // not lastObservation
    ])
  }
}

addCreateBlockFunction(BlockType.ObserverBlock, ObserverBlock)
