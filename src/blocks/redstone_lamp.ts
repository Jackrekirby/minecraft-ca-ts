import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  MoveableBlock,
  Movement
} from '../block'
import { Vec2 } from '../containers/vec2'
import { Direction, getAllDirections, getOppositeDirection } from '../direction'
import {
  getMovementTextureName,
  MovementUpdateChange,
  MovementUpdateType,
  updateMovement
} from '../moveable_block'
import { getNeighbourBlock } from '../utils/block_fetching'
import { addCreateBlockFunction } from '../utils/create_block'

export class RedstoneLamp implements MoveableBlock {
  type: BlockType = BlockType.RedstoneLamp
  isBeingPowered: boolean
  movement: Movement
  movementDirection: Direction

  constructor ({
    isBeingPowered = false,
    movement = Movement.None,
    movementDirection = Direction.Up
  }: {
    isBeingPowered?: boolean
    movement?: Movement
    movementDirection?: Direction
  } = {}) {
    this.isBeingPowered = isBeingPowered
    this.movement = movement
    this.movementDirection = movementDirection
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
      for (const direction of getAllDirections()) {
        const neighbour: Block = getNeighbourBlock(position, blocks, direction)

        const isBeingPowered = neighbour.isOutputtingPower(
          getOppositeDirection(direction)
        )

        if (isBeingPowered) {
          return new RedstoneLamp({
            ...movementUpdateChange.state,
            isBeingPowered: true
          })
        }
      }
      return new RedstoneLamp({
        ...movementUpdateChange.state,
        isBeingPowered: false
      })
    }
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    return new RedstoneLamp(this)
  }

  public toString (): string {
    return 'RDB'
  }

  public getTextureName (): string {
    return (
      `redstone_lamp_${this.isBeingPowered ? 'on' : 'off'}` +
      getMovementTextureName(this)
    )
  }

  public isOutputtingPower (): boolean {
    return false
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Moveable
  }
}

addCreateBlockFunction(BlockType.RedstoneLamp, RedstoneLamp)
