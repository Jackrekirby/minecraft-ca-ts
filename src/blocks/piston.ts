import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  DirectionalBlock,
  isBlock,
  isMoveableBlock,
  MoveableBlock,
  Movement
} from '../block'
import { Vec2 } from '../containers/vec2'
import {
  Direction,
  getOppositeDirection,
  getOtherDirections,
  getRelativeDirection
} from '../direction'
import {
  getMovementTextureName,
  MovementUpdateChange,
  MovementUpdateType,
  updateMovement
} from '../moveable_block'
import { getNeighbourBlock, getNeighbourBlocks } from '../utils/block_fetching'
import { addCreateBlockFunction } from '../utils/create_block'
import { zipArrays } from '../utils/general'
import { PistonHead } from './piston_head'

export class Piston implements DirectionalBlock, MoveableBlock {
  type: BlockType = BlockType.Piston
  isBeingPowered: boolean
  direction: Direction
  movement: Movement
  movementDirection: Direction

  constructor ({
    isBeingPowered = false,
    direction = Direction.Up,
    movement = Movement.None,
    movementDirection = Direction.Up
  }: {
    isBeingPowered?: boolean
    direction?: Direction
    movement?: Movement
    movementDirection?: Direction
  } = {}) {
    this.isBeingPowered = isBeingPowered
    this.direction = direction
    this.movement = movement
    this.movementDirection = movementDirection
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    let movementUpdateChange: MovementUpdateChange

    if (this.isBeingPowered) {
      movementUpdateChange = {
        type: MovementUpdateType.StateChange,
        state: {
          movement: this.movement,
          movementDirection: this.movementDirection
        }
      }
    } else {
      movementUpdateChange = updateMovement(
        position,
        blocks,
        this.movement,
        this.movementDirection
      )
    }

    if (movementUpdateChange.type === MovementUpdateType.BlockChange) {
      return movementUpdateChange.block
    } else {
      const nonFrontDirections = getOtherDirections(Direction.Up)
      const nonFrontBlocks: Block[] = getNeighbourBlocks(
        position,
        blocks,
        nonFrontDirections
      )

      const isBeingPowered = zipArrays(nonFrontDirections, nonFrontBlocks).some(
        ([neighbourDirection, block]: [Direction, Block]) =>
          block.isOutputtingPower(
            getOppositeDirection(
              getRelativeDirection(neighbourDirection, this.direction)
            )
          )
      )

      return new Piston({
        ...movementUpdateChange.state,
        isBeingPowered,
        direction: this.direction
      })
    }
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    return new Piston(this)
  }

  public toString (): string {
    return `P${this.isBeingPowered ? '*' : ''}`
  }

  public getTextureName (position: Vec2, blocks: BlockContainer): string {
    const frontBlock: Block = getNeighbourBlock(position, blocks, Direction.Up)
    const isExtended =
      isBlock<PistonHead>(frontBlock, BlockType.PistonHead) &&
      frontBlock.direction === this.direction
    const isPowered =
      this.isBeingPowered ||
      (this.movement === Movement.None &&
        isMoveableBlock(frontBlock) &&
        frontBlock.movement === Movement.Pending &&
        frontBlock.movementDirection === this.direction)
    const tex =
      `piston${
        isExtended ? '_extended' : isPowered ? '_on' : '_off'
      }_${this.direction.toLowerCase()}` +
      (isPowered || isExtended ? '' : getMovementTextureName(this))
    return tex
  }

  public isOutputtingPower (): boolean {
    return false
  }

  public getMovementMethod (): BlockMovement {
    return this.isBeingPowered
      ? BlockMovement.Immovable
      : BlockMovement.Moveable
  }
}

addCreateBlockFunction(BlockType.Piston, Piston)
