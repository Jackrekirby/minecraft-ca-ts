import { Vec2 } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockState,
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

export enum PistonHeadMotion {
  Retracting = 'retracting',
  Extended = 'extended',
  Extending = 'extending',
  Extending2 = 'extending2',
  RetractingMidExtension = 'retraction_mid_extension'
}

export class PistonHead implements DirectionalBlock {
  type: BlockType = BlockType.PistonHead
  // isRetracting: boolean
  direction: Direction
  motion: PistonHeadMotion
  isSticky: boolean

  constructor ({
    // isRetracting = false,
    direction = Direction.Up,
    motion = PistonHeadMotion.Extended,
    isSticky = false
  }: {
    // isRetracting?: boolean
    direction?: Direction
    motion?: PistonHeadMotion
    isSticky?: boolean
  } = {}) {
    // this.isRetracting = isRetracting
    this.direction = direction
    this.motion = motion
    this.isSticky = isSticky
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    const backBlock: Block = getNeighbourBlock(position, blocks, Direction.Down)
    const frontBlock: Block = getNeighbourBlock(position, blocks, Direction.Up)

    if (isBlock<Piston>(backBlock, BlockType.Piston)) {
      if (
        // this.isRetracting &&
        this.motion === PistonHeadMotion.Retracting &&
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
        // this.isRetracting &&
        this.motion === PistonHeadMotion.Retracting &&
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
        // this.isRetracting &&
        this.motion === PistonHeadMotion.Retracting &&
        isMoveableBlock(frontBlock) &&
        frontBlock.getMovementMethod() === BlockMovement.Immovable
      ) {
        return new Air()
      } else if (
        // this.isRetracting &&
        this.motion === PistonHeadMotion.Retracting &&
        !isMoveableBlock(frontBlock)
      ) {
        return new Air()
      } else if (
        // this.isRetracting &&
        this.motion === PistonHeadMotion.RetractingMidExtension
      ) {
        return new Air()
      } else {
        let motion: PistonHeadMotion
        if (backBlock.isBeingPowered) {
          if (this.motion === PistonHeadMotion.Extended) {
            motion = PistonHeadMotion.Extended
          } else if (this.motion === PistonHeadMotion.Extending2) {
            motion = PistonHeadMotion.Extending2
          } else {
            motion = PistonHeadMotion.Extending
          }
        } else {
          // RetractingMidExtension already handled
          if (this.motion === PistonHeadMotion.Extended) {
            motion = PistonHeadMotion.Retracting
          } else if (this.motion === PistonHeadMotion.Retracting) {
            motion = PistonHeadMotion.Retracting
          } else {
            motion = PistonHeadMotion.RetractingMidExtension
          }
        }
        return new PistonHead({
          // isRetracting: !backBlock.isBeingPowered,
          direction: this.direction,
          motion,
          isSticky: this.isSticky
        })
      }
    } else {
      return new Air()
    }
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    const backBlock: Block = getNeighbourBlock(position, blocks, Direction.Down)
    if (isBlock<Piston>(backBlock, BlockType.Piston)) {
      let motion: PistonHeadMotion

      if (backBlock.isBeingPowered) {
        if (this.motion === PistonHeadMotion.Extending) {
          motion = PistonHeadMotion.Extending2
        } else {
          motion = PistonHeadMotion.Extended
        }
        // console.log(this.motion, motion)
      } else {
        if (this.isSticky) {
          motion = PistonHeadMotion.RetractingMidExtension
        } else {
          return new Air()
        }
      }
      return new PistonHead({ ...this, motion })
    } else {
      return new Air()
    }
  }

  public getTextureName (): string {
    let motionTex: string
    switch (this.motion) {
      case PistonHeadMotion.Extending2:
      case PistonHeadMotion.Extended:
        motionTex = ''
        break
      case PistonHeadMotion.Extending:
        motionTex = '_extending'
        break

      case PistonHeadMotion.RetractingMidExtension:
      case PistonHeadMotion.Retracting:
        motionTex = '_retracting'
        break
    }

    const sticky = this.isSticky ? 'sticky_' : ''

    return `${sticky}piston_head${motionTex}_${this.direction.toLowerCase()}`
  }

  // public isOutputtingPower (): boolean {
  //   return false
  // }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Immovable
  }

  public copy (): BlockState {
    return { type: this.type, isSticky: this.isSticky } as BlockState
  }
}

addCreateBlockFunction(BlockType.PistonHead, PistonHead)
