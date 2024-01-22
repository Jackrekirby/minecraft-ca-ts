import { Vec2 } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  DirectionalBlock,
  isBlock,
  MoveableBlock,
  Movement
} from '../core/block'
import {
  Direction,
  getOppositeDirection,
  getOtherDirections,
  getRelativeDirection
} from '../core/direction'
import {
  getMovementTextureName,
  MovementUpdateChange,
  MovementUpdateType,
  updateMovement,
  updateSubMovement
} from '../core/moveable_block'
import { BinaryPower, OutputPowerBlock } from '../core/powerable_block'

import { getNeighbourBlock, getNeighbourBlocks } from '../utils/block_fetching'
import { addCreateBlockFunction } from '../utils/create_block'
import { zipArrays } from '../utils/general'
import { PistonHead } from './piston_head'

export class Piston implements DirectionalBlock, MoveableBlock {
  type: BlockType = BlockType.Piston
  isBeingPowered: boolean
  isExtended: boolean
  direction: Direction
  movement: Movement
  movementDirection: Direction

  constructor ({
    isBeingPowered = false,
    isExtended = false,
    direction = Direction.Up,
    movement = Movement.None,
    movementDirection = Direction.Up
  }: {
    isBeingPowered?: boolean
    isExtended?: boolean
    direction?: Direction
    movement?: Movement
    movementDirection?: Direction
  } = {}) {
    this.isBeingPowered = isBeingPowered
    this.isExtended = isExtended
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
        ([neighbourDirection, block]: [Direction, Block]) => {
          return (
            OutputPowerBlock.isBlock(block) &&
            block.getOutputPower(
              getOppositeDirection(
                getRelativeDirection(neighbourDirection, this.direction)
              )
            ) !== BinaryPower.None
          )

          // return block.isOutputtingPower(
          //   getOppositeDirection(
          //     getRelativeDirection(neighbourDirection, this.direction)
          //   )
          // )
        }
      )

      const frontBlock: Block = getNeighbourBlock(
        position,
        blocks,
        Direction.Up
      )
      const isExtended =
        isBlock<PistonHead>(frontBlock, BlockType.PistonHead) &&
        frontBlock.direction === this.direction

      return new Piston({
        ...movementUpdateChange.state,
        isBeingPowered,
        isExtended,
        direction: this.direction
      })
    }
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    let movementUpdateChange: MovementUpdateChange

    if (this.isExtended) {
      movementUpdateChange = {
        type: MovementUpdateType.StateChange,
        state: {
          movement: this.movement,
          movementDirection: this.movementDirection
        }
      }
    } else {
      movementUpdateChange = updateSubMovement(
        position,
        blocks,
        this.movement,
        this.movementDirection
      )
    }

    if (movementUpdateChange.type === MovementUpdateType.BlockChange) {
      return movementUpdateChange.block
    } else {
      return new Piston({
        ...movementUpdateChange.state,
        isBeingPowered: this.isBeingPowered,
        isExtended: this.isExtended,
        direction: this.direction
      })
    }
  }

  public toString (): string {
    return `P${this.isBeingPowered ? '*' : ''}`
  }

  public getTextureName (position: Vec2, blocks: BlockContainer): string {
    const frontBlock: Block = getNeighbourBlock(position, blocks, Direction.Up)
    const isExtended =
      isBlock<PistonHead>(frontBlock, BlockType.PistonHead) &&
      frontBlock.direction === this.direction
    const isPowered = this.isBeingPowered
    // previously block had to look powered while extending to know it could
    // not be moved
    // (this.movement === Movement.None &&
    //   isMoveableBlock(frontBlock) &&
    //   frontBlock.getMovementMethod() === BlockMovement.Moveable &&
    //   frontBlock.movement === Movement.Pending &&
    //   frontBlock.movementDirection === this.direction)
    const tex =
      `piston${
        isExtended ? '_extended' : isPowered ? '_on' : '_off'
      }_${this.direction.toLowerCase()}` +
      (isExtended ? '' : getMovementTextureName(this))
    return tex
  }

  // public isOutputtingPower (): boolean {
  //   return false
  // }

  public getMovementMethod (): BlockMovement {
    return this.isExtended ? BlockMovement.Immovable : BlockMovement.Moveable
  }
}

addCreateBlockFunction(BlockType.Piston, Piston)
