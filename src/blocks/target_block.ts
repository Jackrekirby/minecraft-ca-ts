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
import { addBlockVariant } from '../utils/block_variants'

import { addCreateBlockFunction } from '../utils/create_block'
import { ObserverFilter } from './observer_block'
import { ConnectsToRedstoneDustBlock } from './redstone_dust'

export class TargetBlock
  implements
    MoveableBlock,
    OutputPowerBlock.Traits,
    ConnectsToRedstoneDustBlock.Traits,
    ObserverFilter,
    OutputSignalStrengthBlock.Traits {
  type: BlockType = BlockType.TargetBlock
  movement: Movement
  movementDirection: Direction
  outputPower: BinaryPower
  internalSignalStrength: number

  constructor ({
    movement = Movement.None,
    movementDirection = Direction.Up,
    outputPower = BinaryPower.None,
    internalSignalStrength = 0
  }: {
    movement?: Movement
    movementDirection?: Direction
    outputPower?: BinaryPower
    isPowered?: boolean
    internalSignalStrength?: number
  } = {}) {
    this.movement = movement
    this.movementDirection = movementDirection
    this.outputPower = outputPower
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

      return new TargetBlock(newState)
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
      return new TargetBlock(newState)
    }
  }

  public getTextureName (): CanvasGridItem {
    return {
      layers: [
        {
          textureName: `target_block`
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

  public doesConnectToRedstoneDust (_direction: Direction): boolean {
    return true
  }

  public filteredState (): Record<string, any> {
    return {
      type: this.type,
      outputPower: this.outputPower,
      movement: observerFilteredMovement(this.movement)
    }
  }
}

addCreateBlockFunction(BlockType.TargetBlock, TargetBlock)
addBlockVariant(new TargetBlock({}))
