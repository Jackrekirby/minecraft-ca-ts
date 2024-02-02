import { Vec2 } from '../containers/vec2'
import { Block, BlockContainer, BlockMovement, BlockType } from '../core/block'
import { Direction } from '../core/direction'

import { BinaryPower, OutputPowerBlock } from '../core/powerable_block'

import { addCreateBlockFunction } from '../utils/create_block'

export class Obsidian implements OutputPowerBlock.Traits {
  type: BlockType = BlockType.Obsidian
  outputPower: BinaryPower

  constructor ({
    outputPower = BinaryPower.None
  }: {
    outputPower?: BinaryPower
  } = {}) {
    this.outputPower = outputPower
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    return new Obsidian(this)
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    let newState = { ...this }

    Object.assign(newState, OutputPowerBlock.update(this, position, blocks))

    return new Obsidian(newState)
  }

  public getTextureName (): string {
    return `obsidian`
  }

  public getOutputPower (_direction: Direction): BinaryPower {
    return this.outputPower
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Moveable
  }

  public transmitsBetweenSelf (): boolean {
    return false
  }
}

addCreateBlockFunction(BlockType.Obsidian, Obsidian)