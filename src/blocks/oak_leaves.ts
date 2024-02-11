import { Vec2 } from '../containers/vec2'
import { Block, BlockContainer, BlockMovement, BlockType } from '../core/block'
import { breakableNeighbourSubupdate } from '../core/breakable_block'
import {
  CanvasGridCell,
  CanvasGridCellLayer,
  CanvasGridItem
} from '../rendering/canvas'
import { addBlockVariant } from '../utils/block_variants'
import { addCreateBlockFunction } from '../utils/create_block'
import {
  OakSaplingBlockReplacedByGrowth,
  OakSaplingGrowth
} from './oak_sapling_growth'
import { ObserverFilter } from './observer_block'

export class OakLeaves implements ObserverFilter {
  type: BlockType = BlockType.OakLeaves

  constructor ({}: {} = {}) {}

  public update (position: Vec2, blocks: BlockContainer): Block {
    const block = breakableNeighbourSubupdate(position, blocks)
    if (block) {
      return block
    }

    return new OakLeaves(this)
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    const oakSaplingGrowth: Block | null = OakSaplingGrowth.neighbourSubupdate(
      position,
      blocks,
      OakSaplingBlockReplacedByGrowth.Leaves
    )
    if (oakSaplingGrowth) {
      return oakSaplingGrowth
    }
    return new OakLeaves(this)
  }

  public getTextureName (): CanvasGridItem {
    return {
      layers: [
        {
          textureName: `oak_leaves`
        } as CanvasGridCellLayer
      ]
    } as CanvasGridCell
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Moveable
  }

  public filteredState (): Record<string, any> {
    return {
      type: this.type
    }
  }
}

addCreateBlockFunction(BlockType.OakLeaves, OakLeaves)
addBlockVariant(new OakLeaves({}))
