import { ChunkContainer } from '../containers/array2d'
import { Vec2 } from '../containers/vec2'
import { CanvasGridItem } from '../rendering/canvas'
import { toSnakeCase } from '../utils/general'
import { Direction } from './direction'

export type BlockContainer = ChunkContainer<Block>

export enum BlockMovement {
  Immovable,
  Moveable,
  Breaks
}

export enum BlockType {
  Air = 'Air',
  RedstoneBlock = 'RedstoneBlock',
  RedstoneTorch = 'RedstoneTorch',
  Piston = 'Piston',
  PistonHead = 'PistonHead',
  GlassBlock = 'GlassBlock',
  RedstoneLamp = 'RedstoneLamp',
  RedstoneRepeater = 'RedstoneRepeater',
  RedstoneDust = 'RedstoneDust',
  WoolBlock = 'WoolBlock',
  Lever = 'Lever',
  Button = 'Button',
  ObserverBlock = 'ObserverBlock',
  ConcretePowder = 'ConcretePowder',
  Obsidian = 'Obsidian',
  TargetBlock = 'TargetBlock',
  RedstoneComparator = 'RedstoneComparator',
  RedstoneJunction = 'RedstoneJunction',
  RedstoneCauldron = 'RedstoneCauldron',
  SignBlock = 'SignBlock',
  OakSapling = 'OakSapling',
  OakLog = 'OakLog',
  OakSaplingGrowth = 'OakSaplingGrowth',
  OakLeaves = 'OakLeaves',
  Dirt = 'Dirt',
  CommandBlock = 'CommandBlock'
}

export interface BlockState {
  type: BlockType
}

export interface Block extends BlockState {
  update: (position: Vec2, blocks: BlockContainer) => Block
  subupdate: (position: Vec2, blocks: BlockContainer) => Block
  getTextureName: (position: Vec2, blocks: BlockContainer) => CanvasGridItem
  getMovementMethod: () => BlockMovement // TODO put in moveableBlock interface
  copy?: () => BlockState
  getName?: () => string
  interact?: () => Block | string // if string display text
}

export const getBlockName = (block: Block): string => {
  return toSnakeCase(block.getName ? block.getName() : block.type)
}

export function isBlock<T extends Block> (
  block: Block,
  blockType: BlockType
): block is T {
  return block.type === blockType
}

export enum Movement {
  None = 'None',
  Pending = 'Pending',
  Complete = 'Complete',
  // extension pending
  // extension complete
  // retraction pending
  RetractionPending = 'RetractionPending',
  RetractionComplete = 'RetractionComplete'

  // slime???
}

export interface MoveableBlock extends Block {
  movement: Movement
  movementDirection: Direction
}

export interface DirectionalBlock extends Block {
  direction: Direction
}

export function isMoveableBlock (block: Block): block is MoveableBlock {
  return 'movement' in block
}

export function isDirectionalBlock (block: Block): block is DirectionalBlock {
  return 'direction' in block
}
