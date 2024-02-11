import { Vec2 } from '../containers/vec2'
import {
  Block,
  BlockContainer,
  BlockMovement,
  BlockType,
  isBlock
} from '../core/block'
import { Direction } from '../core/direction'
import { getNeighbourBlock } from '../utils/block_fetching'
import { addBlockVariant } from '../utils/block_variants'
import { addCreateBlockFunction } from '../utils/create_block'
import { Dirt } from './dirt'
import {
  OakSaplingBlockReplacedByGrowth,
  OakSaplingGrowth
} from './oak_sapling_growth'

export class OakSapling implements Block {
  type: BlockType = BlockType.OakSapling
  ticksUntilGrowthAttempt: number

  constructor ({
    ticksUntilGrowthAttempt = 0
  }: { ticksUntilGrowthAttempt?: number } = {}) {
    this.ticksUntilGrowthAttempt =
      ticksUntilGrowthAttempt === 0
        ? OakSapling.generateTicksUntilGrowthAttempt()
        : ticksUntilGrowthAttempt
  }

  private static generateTicksUntilGrowthAttempt () {
    return 5 + Math.floor(Math.random() * 10)
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    return new OakSapling(this)
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    const ticksUntilGrowthAttempt = this.ticksUntilGrowthAttempt - 1
    if (ticksUntilGrowthAttempt === 0) {
      const neighbour = getNeighbourBlock(position, blocks, Direction.Down)
      if (isBlock<Dirt>(neighbour, BlockType.Dirt)) {
        return new OakSaplingGrowth({
          blockReplacedByGrowth: OakSaplingBlockReplacedByGrowth.Sapling
        })
      } else {
        return new OakSapling({
          ...this,
          ticksUntilGrowthAttempt: OakSapling.generateTicksUntilGrowthAttempt()
        })
      }
    }
    return new OakSapling({ ...this, ticksUntilGrowthAttempt })
  }

  public getTextureName (): string {
    return 'oak_sapling'
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Immovable
  }
}

addCreateBlockFunction(BlockType.OakSapling, OakSapling)
addBlockVariant(new OakSapling({}))
