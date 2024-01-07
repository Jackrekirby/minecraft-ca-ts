import {
  Block,
  BlockContainer,
  BlockType,
  isBlock,
  isMoveableBlock,
  MoveableBlock,
  Movement
} from './block'
import { createAirBlock } from './blocks/air'
import { Piston } from './blocks/piston'
import { createPistonHead, PistonHead } from './blocks/piston_head'
import { Vec2 } from './containers/vec2'
import { Direction, getAllDirections, getOppositeDirection } from './direction'
import {
  getNeighbourBlock,
  getOppositeRelativeDirection
} from './utils/block_fetching'
import { createBlock } from './utils/create_block'

export enum MovementUpdateType {
  StateChange = 'StateChange',
  BlockChange = 'BlockChange'
}

export type MovementUpdateStateChange = {
  type: MovementUpdateType.StateChange
  state: { movement: Movement; movementDirection: Direction }
}
export type MovementUpdateBlockChange = {
  type: MovementUpdateType.BlockChange
  block: Block
}

const createStateChange = (state: {
  movement: Movement
  movementDirection: Direction
}): MovementUpdateStateChange => {
  return { type: MovementUpdateType.StateChange, state }
}

const createBlockChange = (block: Block): MovementUpdateBlockChange => {
  return { type: MovementUpdateType.BlockChange, block }
}

export type MovementUpdateChange =
  | MovementUpdateStateChange
  | MovementUpdateBlockChange

export const updateMovement = (
  position: Vec2,
  blocks: BlockContainer,
  movement: Movement,
  movementDirection: Direction
): MovementUpdateChange => {
  if (movement === Movement.None) {
    for (const direction of getAllDirections()) {
      const neighbour: Block = getNeighbourBlock(position, blocks, direction)

      const oppositeDirection = getOppositeRelativeDirection(
        position,
        blocks,
        direction
      )
      if (
        isBlock<Piston>(neighbour, BlockType.Piston) &&
        neighbour.direction === oppositeDirection &&
        neighbour.isBeingPowered
      ) {
        return createStateChange({
          movement: Movement.Pending,
          movementDirection: oppositeDirection
        })
      } else if (
        isMoveableBlock(neighbour) &&
        neighbour.movement === Movement.Pending &&
        neighbour.movementDirection === oppositeDirection
      ) {
        return createStateChange({
          movement: Movement.Pending,
          movementDirection: oppositeDirection
        })
      } else if (
        isBlock<PistonHead>(neighbour, BlockType.PistonHead) &&
        neighbour.isRetracting &&
        neighbour.direction === oppositeDirection
      ) {
        // [piston head retracting] [block] [pending block]
        return createStateChange({
          movement: Movement.RetractionPending,
          movementDirection: oppositeDirection
        })
      }
    }
  } else if (movement === Movement.Pending) {
    const frontNeighbour: Block = getNeighbourBlock(
      position,
      blocks,
      movementDirection
    )

    const backNeighbour: Block = getNeighbourBlock(
      position,
      blocks,
      getOppositeDirection(movementDirection)
    )

    if (
      isMoveableBlock(frontNeighbour) &&
      frontNeighbour.movement === Movement.Complete
    ) {
      if (
        isBlock<Piston>(backNeighbour, BlockType.Piston) &&
        backNeighbour.direction === movementDirection &&
        backNeighbour.movement === Movement.None
      ) {
        return createBlockChange(
          createPistonHead({ direction: movementDirection })
        )
      } else {
        return createBlockChange(
          createBlock(backNeighbour.type, {
            ...backNeighbour,
            movement: Movement.Complete,
            movementDirection
          })
        )
        // return createStateChange({
        //   movement: Movement.Complete,
        //   movementDirection
        // })
      }
    } else {
      return createStateChange({
        movement: Movement.Pending,
        movementDirection
      })
    }
  } else if (movement === Movement.RetractionPending) {
    return createBlockChange(createAirBlock({}))
  }

  return createStateChange({
    movement: Movement.None,
    movementDirection
  })
}

export const getMovementTextureName = (block: MoveableBlock) => {
  const movementTex = {
    [Movement.None]: '',
    [Movement.Pending]: '_extension_pending',
    [Movement.Complete]: '_extension_complete',
    [Movement.RetractionPending]: '_retraction_pending',
    [Movement.RetractionComplete]: '_retraction_complete'
  }[block.movement]
  const directionTex =
    block.movement === Movement.None
      ? ''
      : `_${block.movementDirection.toLowerCase()}`

  return `${movementTex}${directionTex}`
}
