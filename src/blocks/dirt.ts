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
  getInputSignalStrength,
  OutputPowerBlock,
  OutputSignalStrengthBlock,
  PowerHardness
} from '../core/powerable_block'
import { CanvasGridCell, CanvasGridItem } from '../rendering/canvas'
import { getNeighbourBlocks } from '../utils/block_fetching'
import { addBlockVariant } from '../utils/block_variants'
import { addCreateBlockFunction } from '../utils/create_block'

import { ObserverFilter } from './observer_block'

export class Dirt
  implements
    MoveableBlock,
    OutputPowerBlock.Traits,
    ObserverFilter,
    OutputSignalStrengthBlock.Traits {
  type: BlockType = BlockType.Dirt
  movement: Movement
  movementDirection: Direction
  outputPower: BinaryPower
  outputSignalStrength: number

  constructor ({
    movement = Movement.None,
    movementDirection = Direction.Up,
    outputPower = BinaryPower.None,
    outputSignalStrength = 0
  }: {
    movement?: Movement
    movementDirection?: Direction
    outputPower?: BinaryPower
    isPowered?: boolean
    outputSignalStrength?: number
  } = {}) {
    this.movement = movement
    this.movementDirection = movementDirection
    this.outputPower = outputPower
    this.outputSignalStrength = outputSignalStrength
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

      return new Dirt(newState)
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
      newState.outputSignalStrength = getInputSignalStrength(position, blocks)
      return new Dirt(newState)
    }
  }

  public getTextureName (
    position: Vec2,
    blocks: BlockContainer
  ): CanvasGridItem {
    const anyNeigbourLeaves = getNeighbourBlocks(position, blocks, [
      Direction.Left,
      Direction.Right
    ]).some(neigbour => neigbour.type == BlockType.OakLeaves)
    return {
      layers: [
        {
          textureName: `dirt`
        },
        getMovementTextureName(this)
      ].filter(x => x.textureName !== '')
    } as CanvasGridCell
  }

  public getOutputPower (_direction: Direction): BinaryPower {
    return this.outputPower
  }

  public getOutputPowerStrength (direction: Direction): number {
    return this.outputSignalStrength
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Moveable
  }

  public getPowerHardness (direction: Direction): PowerHardness {
    return PowerHardness.Soft
  }

  public filteredState (): Record<string, any> {
    return {
      type: this.type,
      outputPower: this.outputPower,
      movement: observerFilteredMovement(this.movement)
    }
  }
}

addCreateBlockFunction(BlockType.Dirt, Dirt)

addBlockVariant(new Dirt({}))
