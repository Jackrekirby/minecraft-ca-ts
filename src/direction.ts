import { Vec2 } from './containers/vec2'

export enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right'
}

export const getRelativeDirection = (
  facing: Direction,
  turn: Direction
): Direction => {
  switch (facing) {
    case Direction.Up:
      return turn
    case Direction.Down:
      switch (turn) {
        case Direction.Up:
          return Direction.Down
        case Direction.Down:
          return Direction.Up
        case Direction.Left:
          return Direction.Right
        case Direction.Right:
          return Direction.Left
      }
    case Direction.Left:
      switch (turn) {
        case Direction.Up:
          return Direction.Left
        case Direction.Down:
          return Direction.Right
        case Direction.Left:
          return Direction.Down
        case Direction.Right:
          return Direction.Up
      }
    case Direction.Right:
      switch (turn) {
        case Direction.Up:
          return Direction.Right
        case Direction.Down:
          return Direction.Left
        case Direction.Left:
          return Direction.Up
        case Direction.Right:
          return Direction.Down
      }
  }
}

export const directionToVec2 = (direction: Direction): Vec2 => {
  switch (direction) {
    case Direction.Up:
      return { x: 0, y: 1 }
    case Direction.Down:
      return { x: 0, y: -1 }
    case Direction.Left:
      return { x: -1, y: 0 }
    case Direction.Right:
      return { x: 1, y: 0 }
  }
}
