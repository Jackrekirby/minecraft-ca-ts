import { Block, isBlock, isDirectionalBlock } from '../block'
import { createAirBlock } from '../blocks/air'
import { Array2D } from '../containers/array2d'
import { Vec2, vec2Add } from '../containers/vec2'
import { Direction, directionToVec2, getRelativeDirection } from '../direction'

export const getNeighbourBlock = (
  position: Vec2,
  blocks: Array2D<Block>,
  direction: Direction
): Block => {
  const block: Block = blocks.getValue(position)
  let relativeDirection: Direction = direction
  if (isDirectionalBlock(block)) {
    relativeDirection = getRelativeDirection(block.direction, direction)
  }
  const offset: Vec2 = directionToVec2(relativeDirection)
  const neighbour: Block =
    blocks.getValue(vec2Add(position, offset)) ?? createAirBlock({})
  return neighbour
}

export const getNeighbourBlocks = (
  position: Vec2,
  blocks: Array2D<Block>,
  directions: Direction[]
) => {
  return directions.map(direction =>
    getNeighbourBlock(position, blocks, direction)
  )
}
