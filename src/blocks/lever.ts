import { Vec2 } from '../containers/vec2'
import { Block, BlockContainer, BlockMovement, BlockType } from '../core/block'
import { Direction } from '../core/direction'
import {
  BinaryPower,
  OutputPowerBlock,
  PowerHardness
} from '../core/powerable_block'

import { addCreateBlockFunction } from '../utils/create_block'
import { ConnectsToRedstoneDustBlock } from './redstone_dust'

export class Lever
  implements OutputPowerBlock.Traits, ConnectsToRedstoneDustBlock.Traits {
  type: BlockType = BlockType.Lever
  isOn: boolean

  constructor ({
    isOn = false
  }: {
    isOn?: boolean
  } = {}) {
    this.isOn = isOn
  }

  public getPowerHardness (direction: Direction): PowerHardness {
    return PowerHardness.Soft
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    return new Lever(this)
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    return new Lever(this)
  }

  public getTextureName (): string {
    return `lever_${this.isOn ? 'on' : 'off'}`
  }

  public getOutputPower (_direction: Direction): BinaryPower {
    return this.isOn ? BinaryPower.Strong : BinaryPower.None
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Immovable
  }

  public doesConnectToRedstoneDust (_direction: Direction): boolean {
    return true
  }

  public interact (): Block {
    return new Lever({ ...this, isOn: !this.isOn })
  }
}

addCreateBlockFunction(BlockType.Lever, Lever)
