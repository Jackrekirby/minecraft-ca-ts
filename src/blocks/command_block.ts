import { Vec2 } from '../containers/vec2'
import { Block, BlockContainer, BlockMovement, BlockType } from '../core/block'
import { commandManager } from '../core/command_line'
import { Direction } from '../core/direction'

import {
  BinaryPower,
  getInputSignalStrength,
  IsPoweredBlock,
  OutputPowerBlock,
  OutputSignalStrengthBlock,
  PowerHardness
} from '../core/powerable_block'
import { CanvasGridCell, CanvasGridItem } from '../rendering/canvas'
import { addBlockVariant } from '../utils/block_variants'

import { addCreateBlockFunction } from '../utils/create_block'
import { ObserverFilter } from './observer_block'

export class CommandBlock
  implements
    OutputPowerBlock.Traits,
    IsPoweredBlock.Traits,
    ObserverFilter,
    OutputSignalStrengthBlock.Traits {
  type: BlockType = BlockType.CommandBlock
  outputPower: BinaryPower
  isPowered: boolean
  outputSignalStrength: number
  command: string
  commandOutput: string

  constructor ({
    outputPower = BinaryPower.None,
    isPowered = false,
    outputSignalStrength = 0,
    command = '',
    commandOutput = ''
  }: {
    outputPower?: BinaryPower
    isPowered?: boolean
    outputSignalStrength?: number
    command?: string
    commandOutput?: string
  } = {}) {
    this.outputPower = outputPower
    this.isPowered = isPowered
    this.outputSignalStrength = outputSignalStrength
    this.command = command
    this.commandOutput = commandOutput
  }

  public update (position: Vec2, blocks: BlockContainer): Block {
    let newState = { ...this }
    Object.assign(newState, IsPoweredBlock.update(this, position, blocks))

    const newBlock = new CommandBlock(newState)
    // console.log('command block', this)
    if (!this.isPowered && newState.isPowered) {
      // console.log('command block running command')
      setTimeout(() => {
        commandManager
          .ifCommandExecuteFromCommandBlock(this.command, position)
          .then(
            value =>
              (newBlock.commandOutput = `[${value.type}] ${value.message}`)
          )
      }, 0)
    }

    return newBlock
  }

  public subupdate (position: Vec2, blocks: BlockContainer): Block {
    let newState = { ...this }
    Object.assign(newState, OutputPowerBlock.update(this, position, blocks))

    newState.outputSignalStrength = getInputSignalStrength(position, blocks)
    return new CommandBlock(newState)
  }

  public getTextureName (): CanvasGridItem {
    return {
      layers: [
        {
          textureName: `command_block`
        }
      ].filter(x => x.textureName !== '')
    } as CanvasGridCell
  }

  public getOutputPower (_direction: Direction): BinaryPower {
    return this.outputPower
  }

  public getOutputPowerStrength (direction: Direction): number {
    return this.outputSignalStrength
  }

  public getMovementMethod (): BlockMovement {
    return BlockMovement.Immovable
  }

  public getPowerHardness (direction: Direction): PowerHardness {
    return PowerHardness.Soft
  }

  public filteredState (): Record<string, any> {
    return {
      type: this.type,
      outputPower: this.outputPower
    }
  }
}

addCreateBlockFunction(BlockType.CommandBlock, CommandBlock)
addBlockVariant(new CommandBlock({}))
