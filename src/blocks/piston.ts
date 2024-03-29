import { Vec2 } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockState,
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
  observerFilteredMovement,
  updateMovement,
  updateSubMovement
} from '../core/moveable_block'
import { BinaryPower, OutputPowerBlock } from '../core/powerable_block'
import { CanvasGridCell, CanvasGridItem } from '../rendering/canvas'

import { getNeighbourBlock, getNeighbourBlocks } from '../utils/block_fetching'
import { addBlockVariant } from '../utils/block_variants'
import { addCreateBlockFunction } from '../utils/create_block'
import { zipArrays } from '../utils/general'
import { ObserverFilter } from './observer_block'
import { PistonHead } from './piston_head'

export class Piston implements DirectionalBlock, MoveableBlock, ObserverFilter {
  type: BlockType = BlockType.Piston
  isBeingPowered: boolean
  isExtended: boolean
  direction: Direction
  movement: Movement
  movementDirection: Direction
  isSticky: boolean

  constructor ({
    isBeingPowered = false,
    isExtended = false,
    direction = Direction.Up,
    movement = Movement.None,
    movementDirection = Direction.Up,
    isSticky = false
  }: {
    isBeingPowered?: boolean
    isExtended?: boolean
    direction?: Direction
    movement?: Movement
    movementDirection?: Direction
    isSticky?: boolean
  } = {}) {
    this.isBeingPowered = isBeingPowered
    this.isExtended = isExtended
    this.direction = direction
    this.movement = movement
    this.movementDirection = movementDirection
    this.isSticky = isSticky
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

      // console.log({ isBeingPowered })

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
        direction: this.direction,
        isSticky: this.isSticky
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
        direction: this.direction,
        isSticky: this.isSticky
      })
    }
  }

  public getTextureName (
    position: Vec2,
    blocks: BlockContainer
  ): CanvasGridItem {
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

    const sticky = this.isSticky ? 'sticky_' : ''
    // const tex = +(isExtended ? '' : getMovementTextureName(this))
    // return tex
    const texDirection = this.direction.toLowerCase()
    return {
      layers: [
        {
          textureName: `${sticky}piston_off${
            isExtended ? '_extended' : ''
          }_${texDirection}`
        },
        {
          textureName: isPowered ? `piston_on_${texDirection}` : ''
        },
        isExtended ? { textureName: '' } : getMovementTextureName(this)
      ].filter(x => x.textureName !== '')
    } as CanvasGridCell
  }

  // public isOutputtingPower (): boolean {
  //   return false
  // }

  public getMovementMethod (): BlockMovement {
    return this.isExtended ? BlockMovement.Immovable : BlockMovement.Moveable
  }

  public copy (): BlockState {
    return { type: this.type, isSticky: this.isSticky } as BlockState
  }

  public getName (): string {
    const sticky = this.isSticky ? 'Sticky' : ''
    return `${sticky}${this.type}`
  }

  public filteredState (): Record<string, any> {
    return {
      type: this.type,
      isExtended: this.isExtended,
      direction: this.direction,
      isSticky: this.isSticky,
      movement: observerFilteredMovement(this.movement)
    }
  }
}

addCreateBlockFunction(BlockType.Piston, Piston)

const variants = [
  new Piston({ isSticky: false }),
  new Piston({ isSticky: true })
]
variants.forEach(addBlockVariant)
