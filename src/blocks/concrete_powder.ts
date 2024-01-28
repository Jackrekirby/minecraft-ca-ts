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
  updateMovement,
  updateSubMovement
} from '../core/moveable_block'
import { BinaryPower, OutputPowerBlock } from '../core/powerable_block'
import { getNeighbourBlock } from '../utils/block_fetching'

import { addCreateBlockFunction } from '../utils/create_block'
import { Air } from './air'
import { Color } from './wool_block'

export enum GravityMotion {
  None = 'none',
  Falling = 'falling',
  Fallen = 'fallen'
}

export class ConcretePowder implements MoveableBlock, OutputPowerBlock.Traits {
  type: BlockType = BlockType.ConcretePowder
  movement: Movement
  movementDirection: Direction
  outputPower: BinaryPower
  gravityMotion: GravityMotion
  color: Color

  constructor ({
    movement = Movement.None,
    movementDirection = Direction.Up,
    outputPower = BinaryPower.None,
    color = Color.White,
    gravityMotion = GravityMotion.None
  }: {
    movement?: Movement
    movementDirection?: Direction
    outputPower?: BinaryPower
    isPowered?: boolean
    color?: Color
    gravityMotion?: GravityMotion
  } = {}) {
    this.movement = movement
    this.movementDirection = movementDirection
    this.outputPower = outputPower
    this.color = color
    this.gravityMotion = gravityMotion
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

  public getTextureName (): string {
    let fallingTex = ''
    if (this.movement === Movement.None) {
      switch (this.gravityMotion) {
        case GravityMotion.Fallen:
          fallingTex = '_fallen'
          break
        case GravityMotion.Falling:
          fallingTex = '_falling'
          break
      }
    }
    return (
      `${this.color}_concrete_powder` +
      fallingTex +
      getMovementTextureName(this)
    )
  }

  public getOutputPower (_direction: Direction): BinaryPower {
    return this.outputPower
  }

  public getMovementMethod (): BlockMovement {
    if (this.gravityMotion === GravityMotion.None) {
      return BlockMovement.Moveable
    } else {
      return BlockMovement.Immovable
    }
  }

  public transmitsBetweenSelf (): boolean {
    return false
  }

  public copy (): BlockState {
    return { type: this.type, color: this.color } as BlockState
  }
}

addCreateBlockFunction(BlockType.ConcretePowder, ConcretePowder)
