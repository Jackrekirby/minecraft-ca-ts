export interface Vec2 {
  x: number
  y: number
}

export function vec2 (x: number, y: number): Vec2 {
  return { x, y }
}

export const vec2Subtract = (v: Vec2, u: Vec2) => {
  return { x: v.x - u.x, y: v.y - u.y }
}

export const vec2Add = (v: Vec2, u: Vec2) => {
  return { x: v.x + u.x, y: v.y + u.y }
}

export const vec2Divide = (v: Vec2, u: Vec2) => {
  return { x: v.x / u.x, y: v.y / u.y }
}

export const vec2Multiply = (v: Vec2, u: Vec2) => {
  return { x: v.x * u.x, y: v.y * u.y }
}

export const vec2Zero = () => {
  return { x: 0, y: 0 }
}

export const vec2Apply = (v: Vec2, fnc: (z: number) => number) => {
  return { x: fnc(v.x), y: fnc(v.y) }
}
