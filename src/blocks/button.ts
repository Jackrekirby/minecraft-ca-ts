import { Vec2 } from '../containers/vec2'
import { Block, BlockContainer, BlockMovement, BlockType } from '../core/block'
import { Direction } from '../core/direction'
import {
  BinaryPower,
  OutputPowerBlock,
  PowerHardness
} from '../core/powerable_block'
import { addBlockVariant } from '../utils/block_variants'

import { addCreateBlockFunction } from '../utils/create_block'
import { createObjectSubset } from '../utils/general'
import { ObserverFilter } from './observer_block'
import { ConnectsToRedstoneDustBlock } from './redstone_dust'

export class Button
  implements
    OutputPowerBlock.Traits,
    ConnectsToRedstoneDustBlock.Traits,
    ObserverFilter {
  type: BlockType = BlockType.Button
  isOn: boolean
  delay: number

  constructor ({
    isOn = false,
    delay = 0
  }: {
    isOn?: boolean
    delay?: number
  } = {}) {
    this.isOn = isOn
    this.delay = delay
  }

  public getPowerHardness (direction: Direction): PowerHardness {
    return PowerHardness.Soft
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    const delay = Math.max(0, this.delay - 1)
    const isOn = this.isOn && delay > 0

    return new Button({ ...this, isOn, delay })
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    return new Button(this)
  }

  public getTextureName (): string {
    return `button_${this.isOn ? 'on' : 'off'}`
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
    // 5 delay = 4 1 tick repeaters on
    return new Button({ ...this, isOn: !this.isOn, delay: 5 })
  }

  public filteredState (): Record<string, any> {
    return createObjectSubset(this, [
      'type',
      'isOn'
      // not delay
    ])
  }
}

addCreateBlockFunction(BlockType.Button, Button)
addBlockVariant(new Button({}))
