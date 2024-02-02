import { Air } from '../blocks/air'
import { Piston } from '../blocks/piston'
import { PistonHead, PistonHeadMotion } from '../blocks/piston_head'
import { Vec2 } from '../containers/vec2'
import { CanvasGridCellLayer } from '../rendering/canvas'
import {
  getNeighbourBlock,
  getOppositeRelativeDirection
} from '../utils/block_fetching'
import { createBlock } from '../utils/create_block'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  isBlock,
  isMoveableBlock,
  MoveableBlock,
  Movement
} from './block'
import { Direction, getAllDirections, getOppositeDirection } from './direction'

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
  _position: Vec2,
  _blocks: BlockContainer,
  _movement: Movement,
  movementDirection: Direction
): MovementUpdateChange => {
  return createStateChange({
    movement: Movement.None,
    movementDirection
  })
}

export const updateSubMovement = (
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
        neighbour.getMovementMethod() === BlockMovement.Moveable &&
        neighbour.movement === Movement.Pending &&
        neighbour.movementDirection === oppositeDirection
      ) {
        return createStateChange({
          movement: Movement.Pending,
          movementDirection: oppositeDirection
        })
      } else if (
        isBlock<PistonHead>(neighbour, BlockType.PistonHead) &&
        neighbour.motion === PistonHeadMotion.Retracting &&
        neighbour.direction === oppositeDirection
      ) {
        // [piston head retracting] [block] [pending block]
        if (neighbour.isSticky) {
          return createStateChange({
            movement: Movement.RetractionPending,
            movementDirection: oppositeDirection
          })
        } else {
          return createStateChange({
            movement: Movement.None,
            movementDirection
          })
        }
      }
    }
  } else if (movement === Movement.Pending) {
    const frontNeighbour: Block = getNeighbourBlock(
      position,
      blocks,
      movementDirection,
      true // movementDirection is an absolute direction
    )

    const backNeighbour: Block = getNeighbourBlock(
      position,
      blocks,
      getOppositeDirection(movementDirection),
      true // movementDirection is an absolute direction
    )

    if (
      isMoveableBlock(frontNeighbour) &&
      frontNeighbour.getMovementMethod() === BlockMovement.Moveable &&
      frontNeighbour.movement === Movement.Complete &&
      frontNeighbour.movementDirection === movementDirection
    ) {
      if (
        isBlock<Piston>(backNeighbour, BlockType.Piston) &&
        backNeighbour.direction === movementDirection &&
        backNeighbour.movement === Movement.None
      ) {
        return createBlockChange(
          new PistonHead({
            direction: movementDirection,
            motion: PistonHeadMotion.Extending,
            isSticky: backNeighbour.isSticky
          })
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
    return createBlockChange(new Air())
  } else if (movement === Movement.Complete) {
    return createStateChange({
      movement: Movement.Complete,
      movementDirection
    })
  } else if (movement === Movement.RetractionComplete) {
    return createStateChange({
      movement: Movement.RetractionComplete,
      movementDirection
    })
  }

  return createStateChange({
    movement: Movement.None,
    movementDirection
  })
}

export const getMovementTextureName = (
  block: MoveableBlock
): CanvasGridCellLayer => {
  const movementTex = {
    [Movement.None]: '',
    [Movement.Pending]: 'extension_pending',
    [Movement.Complete]: 'extension_complete',
    [Movement.RetractionPending]: 'retraction_pending',
    [Movement.RetractionComplete]: 'retraction_complete'
  }[block.movement]
  const directionTex =
    block.movement === Movement.None
      ? ''
      : `_${block.movementDirection.toLowerCase()}`

  return {
    textureName: `${movementTex}${directionTex}`,
    blendMode: 'luminosity',
    alpha: 0.7
  }
}

export const observerFilteredMovement = (movement: Movement): Movement => {
  switch (movement) {
    case Movement.Complete:
      return Movement.Complete
    case Movement.RetractionComplete:
      return Movement.RetractionComplete
    default:
      // do not want to detect pending/failed movement
      return Movement.None
  }
}
