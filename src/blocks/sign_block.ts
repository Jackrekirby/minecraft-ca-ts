import { Vec2 } from '../containers/vec2'
import { Block, BlockContainer, BlockMovement, BlockType } from '../core/block'
import { addBlockVariant } from '../utils/block_variants'
import { addCreateBlockFunction } from '../utils/create_block'

export class SignBlock implements Block {
  type: BlockType = BlockType.SignBlock
  text: string
  constructor ({ text = '' }: { text?: string } = {}) {
    this.text = text
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    return new SignBlock(this)
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    return new SignBlock(this)
  }

  public getTextureName (): string {
    return 'sign'
  }

  public getName (): string {
    return `sign`
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Immovable
  }
  public interact (): string {
    return this.text
  }
}

addCreateBlockFunction(BlockType.SignBlock, SignBlock)
addBlockVariant(new SignBlock({}))
