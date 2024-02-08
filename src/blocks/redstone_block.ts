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
  OutputPowerBlock,
  PowerHardness
} from '../core/powerable_block'
import { CanvasGridCell, CanvasGridItem } from '../rendering/canvas'

import { addCreateBlockFunction } from '../utils/create_block'
import { ObserverFilter } from './observer_block'
import { ConnectsToRedstoneDustBlock } from './redstone_dust'

export class RedstoneBlock
  implements
    MoveableBlock,
    OutputPowerBlock.Traits,
    ConnectsToRedstoneDustBlock.Traits,
    ObserverFilter {
  type: BlockType = BlockType.RedstoneBlock
  movement: Movement
  movementDirection: Direction
  outputPower: BinaryPower = BinaryPower.Strong

  constructor ({
    movement = Movement.None,
    movementDirection = Direction.Up
  }: {
    movement?: Movement
    movementDirection?: Direction
  } = {}) {
    this.movement = movement
    this.movementDirection = movementDirection
  }

  public getPowerHardness (direction: Direction): PowerHardness {
    return PowerHardness.Soft
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    const movementUpdateChange: MovementUpdateChange = updateMovement(
      position,
      blocks,
      this.movement,
      this.movementDirection
    )

    if (movementUpdateChange.type === MovementUpdateType.BlockChange) {
      return movementUpdateChange.block
    } else {
      return new RedstoneBlock(movementUpdateChange.state)
    }
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    const movementUpdateChange: MovementUpdateChange = updateSubMovement(
      position,
      blocks,
      this.movement,
      this.movementDirection
    )

    if (movementUpdateChange.type === MovementUpdateType.BlockChange) {
      return movementUpdateChange.block
    } else {
      return new RedstoneBlock(movementUpdateChange.state)
    }
  }

  public getTextureName (): CanvasGridItem {
    return {
      layers: [
        {
          textureName: `redstone_block`
        },
        getMovementTextureName(this)
      ].filter(x => x.textureName !== '')
    } as CanvasGridCell
  }

  public getOutputPower (_direction: Direction): BinaryPower {
    return BinaryPower.Strong
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Moveable
  }

  public doesConnectToRedstoneDust (_direction: Direction): boolean {
    return true
  }

  public filteredState (): Record<string, any> {
    return {
      type: this.type,
      movement: observerFilteredMovement(this.movement)
    }
  }
}

addCreateBlockFunction(BlockType.RedstoneBlock, RedstoneBlock)
