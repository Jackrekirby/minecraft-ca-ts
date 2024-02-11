import { Vec2, vec2Add } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  isBlock
} from '../core/block'
import {
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

export enum OakSaplingBlockReplacedByGrowth {
  Log = 'log',
  Leaves = 'leaves',
  Air = 'air',
  Sapling = 'sapling'
}

const zeroOutside = (value: number, max: number) => {
  if (value < 0) return 0
  if (value > max) return 0
  return value
}

export class OakSaplingGrowth implements Block {
  type: BlockType = BlockType.OakSaplingGrowth
  distanceFromSapling: Vec2
  growthType: OakSaplingGrowthType
  targetHeight: number
  hasGrowthFailed: boolean
  blockReplacedByGrowth: OakSaplingBlockReplacedByGrowth

  constructor ({
    distanceFromSapling = { x: 0, y: 0 },
    growthType = OakSaplingGrowthType.Log,
    targetHeight = 0,
    hasGrowthFailed = false,
    blockReplacedByGrowth = OakSaplingBlockReplacedByGrowth.Sapling
  }: {
    distanceFromSapling?: Vec2
    growthType?: OakSaplingGrowthType
    targetHeight?: number
    hasGrowthFailed?: boolean
    blockReplacedByGrowth?: OakSaplingBlockReplacedByGrowth
  } = {}) {
    this.distanceFromSapling = distanceFromSapling
    this.growthType = growthType
    this.targetHeight =
      targetHeight === 0 ? Math.floor(5 + Math.random() * 4) : targetHeight
    this.hasGrowthFailed = hasGrowthFailed
    this.blockReplacedByGrowth = blockReplacedByGrowth
  }

  private static getGrowthType (
    targetHeight: number,
    distanceFromSapling: Vec2
  ): OakSaplingGrowthType | null {
    if (distanceFromSapling.x === 0) {
      const leaveHeightAboveLogs = 1
      const height = zeroOutside(distanceFromSapling.y + 1, targetHeight)
      if (height === 0) {
        return null
      } else if (height <= targetHeight - leaveHeightAboveLogs) {
        return OakSaplingGrowthType.Log
      } else {
        return OakSaplingGrowthType.Leaves
      }
    } else {
      // distanceFromSapling.x > 0
      const leaveHeightAboveLogs = 1
      const leaveheight = Math.max(2, targetHeight - 4)
      const leaveWidth = targetHeight > 5 ? 2 : 1
      const height = zeroOutside(distanceFromSapling.y + 1, targetHeight)
      if (height === 0) {
        return null
      } else if (height > targetHeight - leaveHeightAboveLogs) {
        if (Math.abs(distanceFromSapling.x) <= leaveWidth - 1) {
          return OakSaplingGrowthType.Leaves
        }
      } else if (height >= targetHeight - leaveheight) {
        if (Math.abs(distanceFromSapling.x) <= leaveWidth) {
          return OakSaplingGrowthType.Leaves
        }
      }
      return null
    }
  }

  public static neighbourSubupdate (
    position: Vec2,
    blocks: BlockContainer,
    blockReplacedByGrowth: OakSaplingBlockReplacedByGrowth
  ): Block | null {
    for (const direction of getAllDirections()) {
      const neighbour = getNeighbourBlock(
        position,
        blocks,
        getOppositeDirection(direction)
      )
      if (isBlock<OakSaplingGrowth>(neighbour, BlockType.OakSaplingGrowth)) {
        const distanceFromSapling = vec2Add(
          neighbour.distanceFromSapling,
          directionToVec2(direction)
        )
        const growthType: OakSaplingGrowthType | null = OakSaplingGrowth.getGrowthType(
          neighbour.targetHeight,
          distanceFromSapling
        )
        if (growthType) {
          // leaves should not replace logs
          if (
            growthType === OakSaplingGrowthType.Leaves &&
            blockReplacedByGrowth === OakSaplingBlockReplacedByGrowth.Log
          ) {
            return null
          }
          return new OakSaplingGrowth({
            distanceFromSapling,
            growthType,
            targetHeight: neighbour.targetHeight,
            blockReplacedByGrowth
          })
        }
      }
    }

    return null
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    if (this.hasGrowthFailed) {
      return new OakSaplingGrowth(this)
    } else {
      const hasGrowthFailed = !getAllDirections().every(direction => {
        // return true if growth succeeded
        // distanceFromSapling at neighbour position
        const distanceFromSapling = vec2Add(
          this.distanceFromSapling,
          directionToVec2(direction)
        )
        // get growth at neighbour
        const growthType: OakSaplingGrowthType | null = OakSaplingGrowth.getGrowthType(
          this.targetHeight,
          distanceFromSapling
        )

        // if tree wants to grow to a block that cannot be grown into growth has failed
        if (!growthType) {
          return true
        }

        const neighbour = getNeighbourBlock(position, blocks, direction)
        if (
          isBlock<Air>(neighbour, BlockType.Air) ||
          isBlock<OakLog>(neighbour, BlockType.OakLog) ||
          isBlock<OakLeaves>(neighbour, BlockType.OakLeaves) ||
          (isBlock<OakSaplingGrowth>(neighbour, BlockType.OakSaplingGrowth) &&
            !neighbour.hasGrowthFailed)
        ) {
          return true
        }

        return false
      })

      return new OakSaplingGrowth({
        ...this,
        hasGrowthFailed
      })
    }
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    if (this.hasGrowthFailed) {
      switch (this.blockReplacedByGrowth) {
        case OakSaplingBlockReplacedByGrowth.Air:
          return new Air({})
        case OakSaplingBlockReplacedByGrowth.Log:
          return new OakLog({})
        case OakSaplingBlockReplacedByGrowth.Sapling:
          return new OakSapling({})
        case OakSaplingBlockReplacedByGrowth.Leaves:
          return new OakLeaves({})
      }
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
