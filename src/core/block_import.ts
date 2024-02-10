import { Air } from '../blocks/air'
import { Button } from '../blocks/button'
import { ConcretePowder } from '../blocks/concrete_powder'
import { GlassBlock } from '../blocks/glass_block'
import { Lever } from '../blocks/lever'
import { ObserverBlock } from '../blocks/observer_block'
import { Obsidian } from '../blocks/obsidian'
import { Piston } from '../blocks/piston'
import { PistonHead } from '../blocks/piston_head'
import { RedstoneBlock } from '../blocks/redstone_block'
import { RedstoneCauldron } from '../blocks/redstone_cauldron'
import { RedstoneComparator } from '../blocks/redstone_compator'
import { RedstoneDust } from '../blocks/redstone_dust'
import { RedstoneJunction } from '../blocks/redstone_junction'
import { RedstoneLamp } from '../blocks/redstone_lamp'
import { RedstoneRepeater } from '../blocks/redstone_repeater'
import { RedstoneTorch } from '../blocks/redstone_torch'
import { SignBlock } from '../blocks/sign_block'
import { TargetBlock } from '../blocks/target_block'
import { WoolBlock } from '../blocks/wool_block'
import { getAllBlockVariants } from '../utils/block_variants'
import { Block } from './block'

export const loadBlockFiles = (): void => {
  const blocks: Block[] = [
    new Air({}),
    new Button({}),
    new ConcretePowder({}),
    new GlassBlock({}),
    new Lever({}),
    new ObserverBlock({}),
    new Obsidian({}),
    new PistonHead({}),
    new Piston({}),
    new RedstoneBlock({}),
    new RedstoneCauldron({}),
    new RedstoneComparator({}),
    new RedstoneDust({}),
    new RedstoneJunction({}),
    new RedstoneLamp({}),
    new RedstoneRepeater({}),
    new RedstoneTorch({}),
    new SignBlock({}),
    new TargetBlock({}),
    new WoolBlock({})
  ]
  console.log('blocks imported', {
    blocks,
    variants: getAllBlockVariants()
  })
}
