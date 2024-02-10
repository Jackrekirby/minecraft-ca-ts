import { Vec2, vec2Add, vec2AreEqual } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  isBlock
} from '../core/block'
import {
  Direction,
  directionToVec2,
  getAllDirections,
  getOppositeDirection
} from '../core/direction'
import {
  CanvasGridCell,
  CanvasGridCellLayer,
  CanvasGridItem
} from '../rendering/canvas'
import { getNeighbourBlock } from '../utils/block_fetching'
import { addCreateBlockFunction } from '../utils/create_block'
import { Air } from './air'
import { OakLeaves } from './oak_leaves'
import { OakLog } from './oak_log'
import { OakSapling } from './oak_sapling'

export enum OakSaplingGrowthType {
  Log = 'log',
  Leaves = 'leaves'
}

type NeighbourGrowthTypes = Record<Direction, OakSaplingGrowthType | null>
const generateTriangularProfile = (value: number, min: number, max: number) => {
  if (value < min || value > max) {
    return 0
  }

  return (value - min) / (max - min)
}

export class OakSaplingGrowth implements Block {
  type: BlockType = BlockType.OakSaplingGrowth
  distanceFromSapling: Vec2
  growthType: OakSaplingGrowthType
  expectedNeighbourGrowthTypes: NeighbourGrowthTypes
  targetHeight: number
  hasGrowthFailed: boolean // needs pending, complete and failed, only continue growth when complete

  constructor ({
    distanceFromSapling = { x: 0, y: 0 },
    growthType = OakSaplingGrowthType.Log,
    expectedNeighbourGrowthTypes = undefined,
    targetHeight = 0,
    hasGrowthFailed = false
  }: {
    distanceFromSapling?: Vec2
    growthType?: OakSaplingGrowthType
    expectedNeighbourGrowthTypes?: NeighbourGrowthTypes
    targetHeight?: number
    hasGrowthFailed?: boolean
  } = {}) {
    this.distanceFromSapling = distanceFromSapling
    this.growthType = growthType
    this.targetHeight =
      targetHeight === 0 ? Math.floor(5 + Math.random() * 3) : targetHeight
    this.expectedNeighbourGrowthTypes =
      expectedNeighbourGrowthTypes ??
      OakSaplingGrowth.getExpectedNeighbourGrowthTypes(
        null,
        distanceFromSapling,
        OakSaplingGrowthType.Log,
        null,
        this.targetHeight
      )
    this.hasGrowthFailed = hasGrowthFailed
  }

  private static getExpectedNeighbourGrowthTypes (
    direction: Direction | null,
    distanceFromSapling: Vec2,
    growthType: OakSaplingGrowthType,
    fromGrowthType: OakSaplingGrowthType | null,
    targetHeight: number
  ): NeighbourGrowthTypes {
    const targetDistanceFromSapling = vec2Add(
      distanceFromSapling,
      direction ? directionToVec2(direction) : { x: 0, y: 0 }
    )

    const neighbourGrowthTypes: NeighbourGrowthTypes = {
      [Direction.Up]: null,
      [Direction.Down]: null,
      [Direction.Left]: null,
      [Direction.Right]: null
    }

    if (direction) {
      neighbourGrowthTypes[getOppositeDirection(direction)] = fromGrowthType
    }

    for (const neighbourDirection of getAllDirections().filter(d =>
      direction ? d !== getOppositeDirection(direction) : true
    )) {
      const newDistanceFromSapling = vec2Add(
        targetDistanceFromSapling,
        directionToVec2(neighbourDirection)
      )

      let newGrowthType: OakSaplingGrowthType | null = null

      if (Math.abs(newDistanceFromSapling.x) > 0) {
        let maxSideGrowth = targetHeight > 5 ? 2 : 1
        if (targetHeight - newDistanceFromSapling.y <= 1) {
          maxSideGrowth -= 1
        }
        if (Math.abs(newDistanceFromSapling.x) <= maxSideGrowth) {
          if (
            newDistanceFromSapling.y >= targetHeight - 3 &&
            newDistanceFromSapling.y < targetHeight
          ) {
            newGrowthType = OakSaplingGrowthType.Leaves
          }
        }
      } else {
        if (newDistanceFromSapling.y < 0) {
          // do not allow negative growth
        } else if (
          newDistanceFromSapling.y <
          targetHeight - (targetHeight > 6 ? 2 : 1)
        ) {
          newGrowthType = OakSaplingGrowthType.Log
        } else if (newDistanceFromSapling.y < targetHeight) {
          newGrowthType = OakSaplingGrowthType.Leaves
        }
      }
      neighbourGrowthTypes[neighbourDirection] = newGrowthType
    }

    return neighbourGrowthTypes
  }

  public static airSubupdate (
    position: Vec2,
    blocks: BlockContainer
  ): Block | null {
    for (const direction of getAllDirections()) {
      const neighbour = getNeighbourBlock(
        position,
        blocks,
        getOppositeDirection(direction)
      )
      if (isBlock<OakSaplingGrowth>(neighbour, BlockType.OakSaplingGrowth)) {
        const growthType: OakSaplingGrowthType | null =
          neighbour.expectedNeighbourGrowthTypes[direction]
        if (growthType) {
          const distanceFromSapling = vec2Add(
            neighbour.distanceFromSapling,
            directionToVec2(direction)
          )
          return new OakSaplingGrowth({
            distanceFromSapling,
            growthType,
            expectedNeighbourGrowthTypes: OakSaplingGrowth.getExpectedNeighbourGrowthTypes(
              direction,
              // should really be non static as below variables are all this
              neighbour.distanceFromSapling,
              growthType,
              neighbour.growthType,
              neighbour.targetHeight
            ),
            targetHeight: neighbour.targetHeight
          })
        }
      }
    }

    return null
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    if (this.hasGrowthFailed) {
      return new OakSaplingGrowth(this)
    }
    const hasExpectedNeighbours = Object.entries(
      this.expectedNeighbourGrowthTypes
    ).every(
      ([directionStr, growthType]: [string, OakSaplingGrowthType | null]) => {
        const direction = directionStr as Direction
        const neighbour = getNeighbourBlock(position, blocks, direction)
        if (
          // do not allow directly adjacent logs
          this.growthType === OakSaplingGrowthType.Log &&
          isBlock<OakLog>(neighbour, BlockType.OakLog) &&
          [Direction.Left, Direction.Right].includes(direction)
        ) {
          return false
        }
        if (!growthType) return true

        if (isBlock<OakSaplingGrowth>(neighbour, BlockType.OakSaplingGrowth)) {
          if (neighbour.hasGrowthFailed) {
            return false
          } else {
            return true
          }
        } else if (
          isBlock<Air>(neighbour, BlockType.Air) ||
          isBlock<OakLog>(neighbour, BlockType.OakLog) ||
          isBlock<OakLeaves>(neighbour, BlockType.OakLeaves)
        ) {
          return true // growth pending
        } else {
          return false
        }
      }
    )
    return new OakSaplingGrowth({
      ...this,
      hasGrowthFailed: !hasExpectedNeighbours
    })
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    if (this.hasGrowthFailed) {
      if (vec2AreEqual(this.distanceFromSapling, { x: 0, y: 0 })) {
        return new OakSapling({})
      }
      return new Air({})
    } else if (this.growthType === OakSaplingGrowthType.Log) {
      return new OakLog({})
    } else {
      return new OakLeaves({})
    }
  }

  public getTextureName (): CanvasGridItem {
    return {
      layers: [
        {
          textureName:
            this.growthType === OakSaplingGrowthType.Log
              ? 'oak_log'
              : 'oak_leaves',
          alpha: 0.5
        },
        {
          textureName: 'oak_sapling',
          alpha: 0.9
        } as CanvasGridCellLayer,
        {
          textureName: this.hasGrowthFailed ? 'cross' : '',
          alpha: 0.5
        } as CanvasGridCellLayer
      ].filter(x => x.textureName !== '')
    } as CanvasGridCell
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Immovable
  }
}

addCreateBlockFunction(BlockType.OakSaplingGrowth, OakSaplingGrowth)
