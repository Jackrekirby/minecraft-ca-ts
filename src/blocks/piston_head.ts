import { Vec2 } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  DirectionalBlock,
  isBlock,
  isMoveableBlock,
  Movement
} from '../core/block'
import { Direction, getOppositeDirection } from '../core/direction'
import { getNeighbourBlock } from '../utils/block_fetching'
import { addCreateBlockFunction, createBlock } from '../utils/create_block'
import { Air } from './air'
import { Piston } from './piston'

export class PistonHead implements DirectionalBlock {
  type: BlockType = BlockType.PistonHead
  isRetracting: boolean
  direction: Direction

  constructor ({
    isRetracting = false,
    direction = Direction.Up
  }: {
    isRetracting?: boolean
    direction?: Direction
  } = {}) {
    this.isRetracting = isRetracting
    this.direction = direction
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    const backBlock: Block = getNeighbourBlock(position, blocks, Direction.Down)
    const frontBlock: Block = getNeighbourBlock(position, blocks, Direction.Up)

    if (isBlock<Piston>(backBlock, BlockType.Piston)) {
      if (
        this.isRetracting &&
        isMoveableBlock(frontBlock) &&
        frontBlock.getMovementMethod() === BlockMovement.Moveable &&
        frontBlock.movement === Movement.RetractionPending &&
        frontBlock.movementDirection === this.direction
      ) {
        return createBlock(frontBlock.type, {
          ...frontBlock,
          movement: Movement.RetractionComplete,
          movementDirection: this.direction
        })
      } else if (
        this.isRetracting &&
        isMoveableBlock(frontBlock) &&
        frontBlock.getMovementMethod() === BlockMovement.Moveable &&
        frontBlock.movement === Movement.Pending &&
        frontBlock.movementDirection === getOppositeDirection(this.direction)
      ) {
        // TODO: once subticks are added all motions should be cancelled
        // at end of each tick
        // this is a TEMPORARY measure
        return new Air()
      } else if (
        this.isRetracting &&
        isMoveableBlock(frontBlock) &&
        frontBlock.getMovementMethod() === BlockMovement.Immovable
      ) {
        return new Air()
      } else if (this.isRetracting && !isMoveableBlock(frontBlock)) {
        return new Air()
      } else {
        return new PistonHead({
          isRetracting: !backBlock.isBeingPowered,
          direction: this.direction
        })
      }
    } else {
      return new Air()
    }
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    return new PistonHead(this)
  }

  public toString (): string {
    return `PH${this.isRetracting ? '<' : ''}`
  }

  public getTextureName (): string {
    return `piston_head${
      this.isRetracting ? '_retracting' : ''
    }_${this.direction.toLowerCase()}`
  }

  public isOutputtingPower (): boolean {
    return false
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Immovable
  }
}

addCreateBlockFunction(BlockType.PistonHead, PistonHead)
