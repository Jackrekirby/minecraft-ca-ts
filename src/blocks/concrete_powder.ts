import { Vec2 } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockState,
  BlockType,
  isBlock,
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
import {
  CanvasGridCell,
  CanvasGridCellLayer,
  CanvasGridItem
} from '../rendering/canvas'
import { getNeighbourBlock } from '../utils/block_fetching'
import { addBlockVariant } from '../utils/block_variants'

import { addCreateBlockFunction } from '../utils/create_block'
import { Air } from './air'
import { ObserverFilter } from './observer_block'
import { Color, getColors } from './wool_block'

export enum GravityMotion {
  None = 'none',
  Falling = 'falling',
  Fallen = 'fallen'
}

export class ConcretePowder
  implements
    MoveableBlock,
    OutputPowerBlock.Traits,
    ObserverFilter,
    OutputSignalStrengthBlock.Traits {
  type: BlockType = BlockType.ConcretePowder
  movement: Movement
  movementDirection: Direction
  outputPower: BinaryPower
  gravityMotion: GravityMotion
  color: Color
  outputSignalStrength: number

  constructor ({
    movement = Movement.None,
    movementDirection = Direction.Up,
    outputPower = BinaryPower.None,
    color = Color.White,
    gravityMotion = GravityMotion.None,
    outputSignalStrength = 0
  }: {
    movement?: Movement
    movementDirection?: Direction
    outputPower?: BinaryPower
    isPowered?: boolean
    color?: Color
    gravityMotion?: GravityMotion
    outputSignalStrength?: number
  } = {}) {
    this.movement = movement
    this.movementDirection = movementDirection
    this.outputPower = outputPower
    this.color = color
    this.gravityMotion = gravityMotion
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

      const downNeighbour = getNeighbourBlock(position, blocks, Direction.Down)

      if (isBlock<Air>(downNeighbour, BlockType.Air)) {
        newState.gravityMotion = GravityMotion.Falling
      } else {
        newState.gravityMotion = GravityMotion.None
      }

      return new ConcretePowder(newState)
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

      const downNeighbour = getNeighbourBlock(position, blocks, Direction.Down)

      if (this.gravityMotion === GravityMotion.Fallen) {
        newState.gravityMotion = GravityMotion.None
      } else if (
        this.gravityMotion === GravityMotion.Falling &&
        isBlock<ConcretePowder>(downNeighbour, BlockType.ConcretePowder) &&
        downNeighbour.gravityMotion === GravityMotion.Fallen
      ) {
        return new Air({})
      }
      return new ConcretePowder(newState)
    }
  }

  public getTextureName (): CanvasGridItem {
    let fallingTex = ''
    if (this.movement === Movement.None) {
      switch (this.gravityMotion) {
        case GravityMotion.Fallen:
          fallingTex = 'fallen'
          break
        case GravityMotion.Falling:
          fallingTex = 'falling'
          break
      }
    }
    return {
      layers: [
        {
          textureName: `${this.color}_concrete_powder`
        },
        {
          textureName: fallingTex,
          blendMode: 'luminosity',
          alpha: 0.7
        } as CanvasGridCellLayer,
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
    if (this.gravityMotion === GravityMotion.None) {
      return BlockMovement.Moveable
    } else {
      return BlockMovement.Immovable
    }
  }

  public getPowerHardness (direction: Direction): PowerHardness {
    return PowerHardness.Soft
  }

  public copy (): BlockState {
    return { type: this.type, color: this.color } as BlockState
  }

  public getName (): string {
    return `${this.color}_${this.type}`
  }

  public filteredState (): Record<string, any> {
    return {
      type: this.type,
      outputPower: this.outputPower,
      movement: observerFilteredMovement(this.movement)
    }
  }
}

addCreateBlockFunction(BlockType.ConcretePowder, ConcretePowder)
getColors().forEach(color => addBlockVariant(new ConcretePowder({ color })))
