import { Array2D } from './containers/array2d'
import { Vec2 } from './containers/vec2'
import { Direction } from './direction'

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
  GlassBlock = 'GlassBlock'
}

export interface Block {
  type: BlockType
  update: (position: Vec2, blocks: Array2D<Block>) => Block
  toString: () => string
  getTextureName: (position: Vec2, blocks: Array2D<Block>) => string
  // TODO make power redstone interface
  isOutputtingPower: () => boolean
  // general traits
  getMovementMethod: () => BlockMovement
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
