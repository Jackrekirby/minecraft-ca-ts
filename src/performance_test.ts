import { StringDict } from './containers/array2d'
import { strToVec, Vec2, vec2AreEqual, vecToStr } from './containers/vec2'

class ObjectSet<T> {
  items: T[]
  // returns true if equal
  comparator: (a: T, b: T) => boolean

  constructor (comparator: (a: T, b: T) => boolean) {
    this.items = []
    this.comparator = comparator
  }

  add (item: T) {
    if (!this.has(item)) {
      this.items.push(item)
    }
  }

  has (item: T) {
    return this.items.some(other => this.comparator(other, item))
  }

  clear () {
    this.items.length = 0
  }

  [Symbol.iterator] (): Iterator<T> {
    let index = 0
    return {
      next: (): IteratorResult<T> => {
        if (index < this.items.length) {
          return { value: this.items[index++], done: false }
        } else {
          return { value: undefined, done: true }
        }
      }
    }
  }
}

class ObjectSet2<T> {
  items: Set<string>
  // returns true if equal
  stringify: (item: T) => string
  parse: (item: string) => T

  constructor (stringify: (item: T) => string, parse: (item: string) => T) {
    this.items = new Set<string>()
    this.stringify = stringify
    this.parse = parse
  }

  add (item: T) {
    this.items.add(this.stringify(item))
  }

  [Symbol.iterator] (): Iterator<T> {
    const itemsArray = Array.from(this.items)
    let index = 0

    return {
      next: (): IteratorResult<T> => {
        if (index < itemsArray.length) {
          const parsedItem = this.parse(itemsArray[index])
          index++
          return { value: parsedItem, done: false }
        } else {
          return { value: undefined as any, done: true }
        }
      }
    }
  }
}

export const test = () => {
  const n = 100
  const start = performance.now()
  const a: StringDict<number> = {}
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      a[`${x} ${y}`] = x + y
    }
  }

  let i = 0
  for (const [v, b] of Object.entries(a)) {
    const [x, y] = v.split(' ')
    i += b + Number(x) + Number(y)
  }

  console.log('dict', performance.now() - start, i)
}

export const test2 = () => {
  const n = 100
  const start = performance.now()
  const a: Map<Vec2, number> = new Map<Vec2, number>()
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      const v: Vec2 = { x, y }
      a.set(v, x + y)
    }
  }

  let i = 0
  for (const [v, b] of a) {
    i += b + v.x + v.y
  }
  console.log('map', performance.now() - start, i)
}

export const test4 = () => {
  const n = 100
  const start = performance.now()
  const a: ObjectSet<Vec2> = new ObjectSet<Vec2>(vec2AreEqual)
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      const v: Vec2 = { x, y }
      a.add(v)
    }
  }
  console.log('ObjectSet', performance.now() - start)
  let i = 0
  for (const v of a) {
    i += v.x + v.y
  }
  console.log('ObjectSet', performance.now() - start, i)
}

export const test3 = () => {
  const n = 1000
  const start = performance.now()
  const a: Set<string> = new Set<string>()
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      const v: Vec2 = { x, y }
      const s = vecToStr(v)
      a.add(s)
    }
  }
  console.log('set', performance.now() - start)
  let i = 0
  for (const vs of a) {
    const v = strToVec(vs)
    i += v.x + v.y
  }
  console.log('set', performance.now() - start, i)
}

export const test5 = () => {
  const n = 1000
  const start = performance.now()
  const a: ObjectSet2<Vec2> = new ObjectSet2<Vec2>(vecToStr, strToVec)
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      const v: Vec2 = { x, y }
      a.add(v)
    }
  }
  console.log('ObjectSet2', performance.now() - start)
  let i = 0
  for (const v of a) {
    i += v.x + v.y
  }
  console.log('ObjectSet2', performance.now() - start, i)
}
