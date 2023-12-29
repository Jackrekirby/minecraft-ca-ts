import { Array2D } from './tools/array2d'
import { Vec2, vec2Add } from './tools/vec2'

// block

enum BlockMovement {
  Immovable,
  Moveable,
  Breaks
}

enum BlockType {
  Air = 'Air',
  RedstoneBlock = 'RedstoneBlock',
  RedstoneTorch = 'RedstoneTorch',
  Piston = 'Piston',
  PistonHead = 'PistonHead',
  GlassBlock = 'GlassBlock'
}

interface Block {
  type: BlockType
  update: (position: Vec2, blocks: Array2D<Block>) => Block
  toString: () => string
  // TODO make power redstone interface
  isOutputtingPower: () => boolean
  // general traits
  getMovementMethod: () => BlockMovement
}

function isBlock<T extends Block> (
  block: Block,
  blockType: BlockType
): block is T {
  return block.type === blockType
}

// air

interface Air extends Block {
  type: BlockType.Air
}

const createAirBlock = (): Air => ({
  type: BlockType.Air,
  update: (position: Vec2, blocks: Array2D<Block>): Block => {
    const leftBlock: Block =
      blocks.getValue(vec2Add(position, { x: -1, y: 0 })) ?? createAirBlock()
    if (
      isBlock<Piston>(leftBlock, BlockType.Piston) &&
      leftBlock.isBeingPowered
    ) {
      return createPistonHead()
    } else if (
      // TODO check if instance of movable block
      isBlock<GlassBlock>(leftBlock, BlockType.GlassBlock) &&
      leftBlock.movement === Movement.Pending
    ) {
      return createGlassBlock(Movement.Complete)
    }

    return createAirBlock()
  },
  toString: () => '[ ]',
  isOutputtingPower: () => false,
  getMovementMethod: () => BlockMovement.Breaks
})

// redstone block

interface RedstoneBlock extends Block {
  type: BlockType.RedstoneBlock
}

const createRedstoneBlock = (): RedstoneBlock => ({
  type: BlockType.RedstoneBlock,
  update: (_position: Vec2, _blocks: Array2D<Block>): Block => {
    return createRedstoneBlock()
  },
  toString: () => 'RDB',
  isOutputtingPower: () => true,
  getMovementMethod: () => BlockMovement.Moveable
})

// redstone torch

interface RedstoneTorch extends Block {
  type: BlockType.RedstoneTorch
  isBeingPowered: boolean
}

const createRedstoneTorch = (
  isBeingPowered: boolean = false
): RedstoneTorch => ({
  type: BlockType.RedstoneTorch,
  isBeingPowered,
  update: (position: Vec2, blocks: Array2D<Block>): Block => {
    const leftBlock: Block = blocks.getValue(vec2Add(position, { x: -1, y: 0 }))
    const isBeingPowered = leftBlock.isOutputtingPower()
    return createRedstoneTorch(isBeingPowered)
  },
  toString: function () {
    // function allows `this` to refer to the RedstoneTorch
    return `RT${this.isOutputtingPower() ? '*' : ''}`
  },
  isOutputtingPower: () => !isBeingPowered,
  getMovementMethod: () => BlockMovement.Immovable
})

// piston

interface Piston extends Block {
  type: BlockType.Piston
  isBeingPowered: boolean
  isExtended: boolean
}

const createPiston = (
  isBeingPowered: boolean = false,
  isExtended: boolean = false
): Piston => ({
  type: BlockType.Piston,
  isBeingPowered,
  isExtended,
  update: (position: Vec2, blocks: Array2D<Block>): Block => {
    const leftBlock: Block = blocks.getValue(vec2Add(position, { x: -1, y: 0 }))
    const isBeingPowered = leftBlock.isOutputtingPower()
    return createPiston(isBeingPowered, isExtended)
  },
  toString: function () {
    // function allows `this` to refer to the RedstoneTorch
    return `P${isExtended ? 'E' : ''}${isBeingPowered ? '*' : ''}`
  },
  isOutputtingPower: () => false,
  getMovementMethod: function () {
    // todo isExtended not used, just use isPowered?
    // maybe extension pending
    return this.isExtended ? BlockMovement.Immovable : BlockMovement.Moveable
  }
})

// piston head

interface PistonHead extends Block {
  type: BlockType.PistonHead
  isRetracting: boolean
}

const createPistonHead = (isRetracting: boolean = false): PistonHead => ({
  type: BlockType.PistonHead,
  isRetracting,
  update: (position: Vec2, blocks: Array2D<Block>): Block => {
    const leftBlock: Block = blocks.getValue(vec2Add(position, { x: -1, y: 0 }))
    const rightBlock: Block = blocks.getValue(vec2Add(position, { x: 1, y: 0 }))

    if (
      isRetracting &&
      isBlock<GlassBlock>(rightBlock, BlockType.GlassBlock) &&
      rightBlock.movement === Movement.RetractionPending
    ) {
      return createGlassBlock(Movement.RetractionComplete)
    }
    if (
      isBlock<Piston>(leftBlock, BlockType.Piston) &&
      !leftBlock.isBeingPowered
    ) {
      return createPistonHead(true)
    }
    return createPistonHead(false)
  },
  toString: function () {
    // function allows `this` to refer to the RedstoneTorch
    return `PH${isRetracting ? '<' : ''}`
  },
  isOutputtingPower: () => false,
  getMovementMethod: () => BlockMovement.Immovable
})

// moveable block

enum Movement {
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

interface MoveableBlock extends Block {
  movement: Movement
}

interface GlassBlock extends MoveableBlock {
  type: BlockType.GlassBlock
}

const createGlassBlock = (movement: Movement = Movement.None): GlassBlock => ({
  type: BlockType.GlassBlock,
  movement,
  update: (position: Vec2, blocks: Array2D<Block>): Block => {
    const leftBlock: Block = blocks.getValue(vec2Add(position, { x: -1, y: 0 }))
    const rightBlock: Block = blocks.getValue(vec2Add(position, { x: 1, y: 0 }))

    if (
      isBlock<Piston>(leftBlock, BlockType.Piston) &&
      leftBlock.isBeingPowered &&
      [Movement.None, Movement.Pending].includes(movement)
    ) {
      if (
        // [piston] [pending block -> piston] [complete block]
        isBlock<GlassBlock>(rightBlock, BlockType.GlassBlock) &&
        rightBlock.movement === Movement.Complete &&
        movement === Movement.Pending
      ) {
        return createPistonHead()
      } // [piston] [pending block] [pending block]
      return createGlassBlock(Movement.Pending)
    } else if (
      isBlock<GlassBlock>(leftBlock, BlockType.GlassBlock) &&
      leftBlock.movement === Movement.Pending &&
      [Movement.None, Movement.Pending].includes(movement)
    ) {
      if (
        // [pending block] [pending block -> complete block] [complete block]
        isBlock<GlassBlock>(rightBlock, BlockType.GlassBlock) &&
        rightBlock.movement === Movement.Complete &&
        movement === Movement.Pending
      ) {
        return createGlassBlock(Movement.Complete)
      }
      // [pending block] [pending block] [pending block]
      return createGlassBlock(Movement.Pending)
    } else if (
      isBlock<PistonHead>(leftBlock, BlockType.PistonHead) &&
      leftBlock.isRetracting &&
      [Movement.None, Movement.RetractionPending].includes(movement)
    ) {
      // [piston head retracting] [block] [pending block]
      return createGlassBlock(Movement.RetractionPending)
    } else if (
      isBlock<GlassBlock>(leftBlock, BlockType.GlassBlock) &&
      leftBlock.movement === Movement.RetractionComplete &&
      [Movement.RetractionPending].includes(movement)
    ) {
      return createAirBlock()
    }

    return createGlassBlock(Movement.None)
  },
  toString: function () {
    return `MB${
      {
        [Movement.None]: '',
        [Movement.Pending]: '?',
        [Movement.Complete]: '*',
        [Movement.RetractionPending]: '<',
        [Movement.RetractionComplete]: '^'
      }[movement]
    }`
  },
  isOutputtingPower: () => false,
  getMovementMethod: function () {
    return this.movement === Movement.None
      ? BlockMovement.Moveable
      : BlockMovement.Immovable
  }
})

// dom

const updateButton = document.getElementById(
  'update-button'
) as HTMLButtonElement

// main

const logBlocks = (blocks: Array2D<Block>) => {
  console.log(blocks.toFormattedString(block => block.toString().padEnd(4)))
}

const updateBlocks = (blocks: Array2D<Block>) => {
  console.log('update')
  const newBlocks: Array2D<Block> = blocks.map((block: Block, v: Vec2) =>
    block.update(v, blocks)
  )
  blocks.array = newBlocks.array
  logBlocks(blocks)
}

const main = () => {
  console.log('main')
  const blocks: Array2D<Block> = Array2D.createWithDefaultValue(
    8,
    3,
    createAirBlock()
  )

  // blocks.setValue({ x: 1, y: 1 }, createRedstoneBlock())
  blocks.setValue({ x: 2, y: 1 }, createPiston(true))
  blocks.setValue({ x: 3, y: 1 }, createPistonHead())
  blocks.setValue({ x: 4, y: 1 }, createGlassBlock())
  blocks.setValue({ x: 5, y: 1 }, createGlassBlock())

  updateButton.onclick = () => updateBlocks(blocks)
  logBlocks(blocks)
}

main()
