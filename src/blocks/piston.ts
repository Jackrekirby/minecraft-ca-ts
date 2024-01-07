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

export interface Piston extends DirectionalBlock, MoveableBlock {
  type: BlockType.Piston
  isBeingPowered: boolean
}

export const createPiston = (state: {
  isBeingPowered?: boolean
  direction?: Direction
  movement?: Movement
  movementDirection?: Direction
}): Piston => {
  const {
    isBeingPowered = false,
    direction = Direction.Up,
    movement = Movement.None,
    movementDirection = Direction.Up
  } = state
  return {
    type: BlockType.Piston,
    isBeingPowered,
    direction,
    movement,
    movementDirection,
    update: (position: Vec2, blocks: BlockContainer): Block => {
      const movementUpdateChange: MovementUpdateChange = updateMovement(
        position,
        blocks,
        movement,
        movementDirection
      )

      if (movementUpdateChange.type === MovementUpdateType.BlockChange) {
        return movementUpdateChange.block
      } else {
        const nonFrontDirections = getOtherDirections(Direction.Up)
        const nonFrontBlocks: Block[] = getNeighbourBlocks(
          position,
          blocks,
          nonFrontDirections
        )

        const isBeingPowered = zipArrays(
          nonFrontDirections,
          nonFrontBlocks
        ).some(([neighbourDirection, block]: [Direction, Block]) =>
          block.isOutputtingPower(
            getOppositeDirection(
              getRelativeDirection(neighbourDirection, direction)
            )
          )
        )

        return createPiston({
          ...movementUpdateChange.state,
          isBeingPowered,
          direction
        })
      }
    },
    toString: function () {
      // function allows `this` to refer to the RedstoneTorch
      return `P${isBeingPowered ? '*' : ''}`
    },
    getTextureName: function (position: Vec2, blocks: BlockContainer) {
      const frontBlock: Block = getNeighbourBlock(
        position,
        blocks,
        Direction.Up
      )
      const isExtended = isBlock<PistonHead>(frontBlock, BlockType.PistonHead)
      const isPowered =
        isBeingPowered ||
        (movement === Movement.None &&
          isMoveableBlock(frontBlock) &&
          frontBlock.movement === Movement.Pending)
      const tex =
        `piston${
          isExtended ? '_extended' : isPowered ? '_on' : '_off'
        }_${direction.toLowerCase()}` +
        (isPowered || isExtended ? '' : getMovementTextureName(this))
      return tex
    },
    isOutputtingPower: () => false,
    getMovementMethod: function () {
      // todo isExtended not used, just use isPowered?
      // maybe extension pending
      return this.isBeingPowered
        ? BlockMovement.Immovable
        : BlockMovement.Moveable
    }
  }
}

addCreateBlockFunction(BlockType.Piston, createPiston)
