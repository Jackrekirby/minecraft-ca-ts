import { Vec2 } from '../containers/vec2'
import { Block, BlockContainer, BlockMovement, BlockType } from '../core/block'
import { addBlockVariant } from '../utils/block_variants'
import { addCreateBlockFunction } from '../utils/create_block'
import { OakSaplingGrowth } from './oak_sapling_growth'

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
      return new OakSaplingGrowth({})
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
