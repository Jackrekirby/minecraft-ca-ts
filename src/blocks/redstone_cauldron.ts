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
import { storage } from '../core/storage'
import {
  CanvasGridCell,
  CanvasGridCellLayer,
  CanvasGridItem
} from '../rendering/canvas'
import { addBlockVariant } from '../utils/block_variants'

import { addCreateBlockFunction } from '../utils/create_block'
import { ObserverFilter } from './observer_block'
import { OutputsComparisonStrength } from './redstone_compator'

export class RedstoneCauldron
  implements MoveableBlock, OutputsComparisonStrength.Traits, ObserverFilter {
  type: BlockType = BlockType.RedstoneCauldron
  movement: Movement
  movementDirection: Direction
  outputPowerStrength: number

  constructor ({
    movement = Movement.None,
    movementDirection = Direction.Up,
    outputPowerStrength = 0
  }: {
    movement?: Movement
    movementDirection?: Direction
    outputPowerStrength?: number
  } = {}) {
    this.movement = movement
    this.movementDirection = movementDirection
    this.outputPowerStrength = outputPowerStrength
  }

  public getOutputComparisonStrength (): number {
    return this.outputPowerStrength
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
      return new RedstoneCauldron({ ...this, ...movementUpdateChange.state })
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
      return new RedstoneCauldron({ ...this, ...movementUpdateChange.state })
    }
  }

  public getTextureName (): CanvasGridItem {
    const visibleSignalStrength =
      Math.ceil(this.outputPowerStrength / 2) * 2 - 1
    return {
      layers: [
        {
          textureName: `redstone_cauldron`
        },
        {
          textureName:
            this.outputPowerStrength > 0
              ? `redstone_cauldron_on_${visibleSignalStrength}`
              : ''
        },
        {
          textureName: storage.viewSignalStrengthState.get()
            ? `number_${this.outputPowerStrength}`
            : '',
          blendMode: 'source-over',
          alpha: 1.0,
          minSize: 32
        } as CanvasGridCellLayer,
        getMovementTextureName(this)
      ].filter(x => x.textureName !== '')
    } as CanvasGridCell
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Moveable
  }

  public filteredState (): Record<string, any> {
    return {
      type: this.type,
      outputPowerStrength: this.outputPowerStrength,
      movement: observerFilteredMovement(this.movement)
    }
  }

  public interact (): Block {
    return new RedstoneCauldron({
      ...this,
      outputPowerStrength: (this.outputPowerStrength + 1) % 16
    })
  }
}

addCreateBlockFunction(BlockType.RedstoneCauldron, RedstoneCauldron)
addBlockVariant(new RedstoneCauldron({}))
