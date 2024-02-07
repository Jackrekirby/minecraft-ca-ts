import { getMissingKeys } from '../utils/general'
import { Vec2, vec2Multiply } from './vec2'

export interface StringDict<T> {
  [key: string]: T
}

export class ChunkContainer<T> {
  public chunks: StringDict<T[]>
  private chunkSize: number
  private createDefaultItem: () => T
  private isDefaultItem: (item: T) => boolean
  public listenToChunkCreation: boolean

  constructor (
    chunkSize: number,
    createDefaultItem: () => T,
    isDefaultItem: (item: T) => boolean,
    listenToChunkCreation: boolean = false
  ) {
    this.chunks = {}
    this.chunkSize = chunkSize
    this.createDefaultItem = createDefaultItem
    this.isDefaultItem = isDefaultItem
    this.listenToChunkCreation = listenToChunkCreation
  }

  public clone (other: ChunkContainer<T>) {
    // chunk size must be same
    this.chunks = other.chunks
  }

  private getChunkIndex (v: Vec2): string {
    return `${Math.floor(v.x / this.chunkSize)} ${Math.floor(
      v.y / this.chunkSize
    )}`
  }

  private getBlockPositionInChunk (v: Vec2): Vec2 {
    let x = v.x % this.chunkSize
    if (x < 0) {
      x += this.chunkSize
    }
    let y = v.y % this.chunkSize
    if (y < 0) {
      y += this.chunkSize
    }
    return { x, y }
  }

  private getBlockIndex (v: Vec2): number {
    const { x, y } = this.getBlockPositionInChunk(v)
    return x + y * this.chunkSize
  }

  private chunkIndexToVec2 (chunkIndex: string): Vec2 {
    const [x, y] = chunkIndex.split(' ')
    return { x: Number(x), y: Number(y) }
  }

  private createChunk (): T[] {
    const chunk: T[] = []
    const area = this.chunkSize * this.chunkSize
    for (let i = 0; i < area; ++i) {
      chunk.push(this.createDefaultItem())
    }
    return chunk
  }

  private createChunkAtPosition (v: Vec2): void {
    const chunkIndex = this.getChunkIndex(v)
    const chunk = this.chunks[chunkIndex]
    if (!chunk) {
      if (this.listenToChunkCreation) {
        // console.log('creating chunk', chunkIndex)
      }

      this.chunks[chunkIndex] = this.createChunk()
    }
  }

  private createNeighbouringChunksAtPosition (v: Vec2): void {
    const rv = this.getBlockPositionInChunk(v)

    if (rv.x === 0) {
      this.createChunkAtPosition({ x: v.x - this.chunkSize, y: v.y })
    } else if (rv.x === this.chunkSize - 1) {
      this.createChunkAtPosition({ x: v.x + this.chunkSize, y: v.y })
    }

    if (rv.y === 0) {
      this.createChunkAtPosition({ x: v.x, y: v.y - this.chunkSize })
    } else if (rv.y === this.chunkSize - 1) {
      this.createChunkAtPosition({ x: v.x, y: v.y + this.chunkSize })
    }
  }

  public setValue (v: Vec2, value: T): void {
    // build chunks at and around the position we attempt to set a block
    this.createChunkAtPosition(v)
    if (!this.isDefaultItem(value)) {
      this.createNeighbouringChunksAtPosition(v)
    }

    const chunkIndex = this.getChunkIndex(v)
    const blockIndex = this.getBlockIndex(v)
    const chunk = this.chunks[chunkIndex]
    chunk[blockIndex] = value
  }

  public getValue (v: Vec2): T {
    const chunkIndex = this.getChunkIndex(v)
    const blockIndex = this.getBlockIndex(v)
    const chunk = this.chunks[chunkIndex]
    // do not build a chunk if we attempt to query one which does not exist
    if (!chunk) {
      return this.createDefaultItem()
    }
    return chunk[blockIndex]
  }

  public getPositions (): Vec2[] {
    const positions: Vec2[] = []
    if (true) {
      for (const chunkIndex in this.chunks) {
        const chunkPos: Vec2 = vec2Multiply(this.chunkIndexToVec2(chunkIndex), {
          x: this.chunkSize,
          y: this.chunkSize
        })
        const xmax = chunkPos.x + this.chunkSize,
          ymax = chunkPos.y + this.chunkSize
        for (let y = chunkPos.y; y < ymax; ++y) {
          for (let x = chunkPos.x; x < xmax; ++x) {
            const position: Vec2 = { x, y }
            positions.push(position)
          }
        }
      }
    } else {
      for (const index in this.chunks) {
        const chunkPos: Vec2 = this.chunkIndexToVec2(index)
        const chunkBlockPos: Vec2 = {
          x: chunkPos.x * this.chunkSize,
          y: chunkPos.y * this.chunkSize
        }
        for (
          let y = chunkBlockPos.y;
          y < chunkBlockPos.y + this.chunkSize;
          ++y
        ) {
          for (
            let x = chunkBlockPos.x;
            x < chunkBlockPos.x + this.chunkSize;
            ++x
          ) {
            const position: Vec2 = { x, y }

            positions.push(position)
          }
        }
      }
    }

    return positions
  }

  public foreach (callback: (value: T, v: Vec2) => void): void {
    for (const index in this.chunks) {
      const chunkPos: Vec2 = this.chunkIndexToVec2(index)
      const chunkBlockPos: Vec2 = {
        x: chunkPos.x * this.chunkSize,
        y: chunkPos.y * this.chunkSize
      }
      for (let y = chunkBlockPos.y; y < chunkBlockPos.y + this.chunkSize; ++y) {
        for (
          let x = chunkBlockPos.x;
          x < chunkBlockPos.x + this.chunkSize;
          ++x
        ) {
          const position: Vec2 = { x, y }
          const value: T = this.getValue(position)
          callback(value, position)
        }
      }
    }
  }

  public map (callback: (value: T, v: Vec2) => T): ChunkContainer<T> {
    const newContainer = new ChunkContainer<T>(
      this.chunkSize,
      this.createDefaultItem,
      this.isDefaultItem
    )
    for (const index in this.chunks) {
      const chunkPos: Vec2 = this.chunkIndexToVec2(index)
      const chunkBlockPos: Vec2 = {
        x: chunkPos.x * this.chunkSize,
        y: chunkPos.y * this.chunkSize
      }
      for (let y = chunkBlockPos.y; y < chunkBlockPos.y + this.chunkSize; ++y) {
        for (
          let x = chunkBlockPos.x;
          x < chunkBlockPos.x + this.chunkSize;
          ++x
        ) {
          const position: Vec2 = { x, y }
          const value: T = this.getValue(position)
          const newValue = callback(value, position)
          newContainer.setValue(position, newValue)
        }
      }
    }
    const newChunksPositions = getMissingKeys(this.chunks, newContainer.chunks)
    if (newChunksPositions.length > 0) {
      console.log('Creating chunk(s)', newChunksPositions)
    }
    return newContainer
  }

  public mapToDict2D<U> (callback: (value: T, v: Vec2) => U): Dict2D<U> {
    const dict2D = new Dict2D<U>()
    if (false) {
      for (const [chunkIndex, blocks] of Object.entries(this.chunks)) {
        const chunkPos: Vec2 = vec2Multiply(this.chunkIndexToVec2(chunkIndex), {
          x: this.chunkSize,
          y: this.chunkSize
        })

        let blockIndex = 0
        for (const block of blocks) {
          if (!this.isDefaultItem(block)) {
            const v: Vec2 = {
              x: (blockIndex % this.chunkSize) + chunkPos.x,
              y: Math.floor(blockIndex / this.chunkSize) + chunkPos.y
            }

            const newValue = callback(block, v)
            dict2D.setValue(v, newValue)
          }
          ++blockIndex
        }
      }
    } else {
      for (const index in this.chunks) {
        const chunkPos: Vec2 = this.chunkIndexToVec2(index)

        const chunkBlockPos: Vec2 = {
          x: chunkPos.x * this.chunkSize,
          y: chunkPos.y * this.chunkSize
        }
        for (
          let y = chunkBlockPos.y;
          y < chunkBlockPos.y + this.chunkSize;
          ++y
        ) {
          for (
            let x = chunkBlockPos.x;
            x < chunkBlockPos.x + this.chunkSize;
            ++x
          ) {
            const position: Vec2 = { x, y }
            const value: T = this.getValue(position)
            if (!this.isDefaultItem(value)) {
              const newValue = callback(value, position)
              dict2D.setValue(position, newValue)
            }
          }
        }
      }
    }

    return dict2D
  }
}

export class Dict2D<T> {
  public items: Map<string, T>

  constructor () {
    this.items = new Map<string, T>()
  }

  public clone (other: Dict2D<T>) {
    this.items = other.items
  }

  private getIndex (v: Vec2): string {
    return `${v.x} ${v.y}`
  }

  private indexToVec2 (i: string): Vec2 {
    const [x, y] = i.split(' ')
    return { x: Number(x), y: Number(y) }
  }

  public setValue (v: Vec2, value: T): void {
    const index = this.getIndex(v)
    this.items.set(index, value)
  }

  public getValue (v: Vec2): T {
    const index = this.getIndex(v)
    return this.items.get(index)!
  }

  public map<U> (callback: (value: T, v: Vec2) => U): Dict2D<U> {
    const newContainer = new Dict2D<U>()
    for (const [index, value] of this.items) {
      const v: Vec2 = this.indexToVec2(index)
      const newValue = callback(value, v)
      newContainer.setValue(v, newValue)
    }
    return newContainer
  }

  public foreach<U> (callback: (value: T, v: Vec2) => U): void {
    for (const [index, value] of this.items) {
      const v: Vec2 = this.indexToVec2(index)
      callback(value, v)
    }
  }
}

// export class Dict2D<T> {
//   public items: StringDict<T>

//   constructor (items?: StringDict<T>) {
//     this.items = items ?? {}
//   }

//   public clone (other: Dict2D<T>) {
//     this.items = other.items
//   }

//   private getIndex (v: Vec2): string {
//     return `${v.x} ${v.y}`
//   }

//   private indexToVec2 (i: string): Vec2 {
//     const [x, y] = i.split(' ')
//     return { x: Number(x), y: Number(y) }
//   }

//   public setValue (v: Vec2, value: T): void {
//     const index = this.getIndex(v)
//     this.items[index] = value
//   }

//   public getValue (v: Vec2): T {
//     const index = this.getIndex(v)
//     return this.items[index]
//   }

//   public map<U> (callback: (value: T, v: Vec2) => U): Dict2D<U> {
//     const newContainer = new Dict2D<U>()
//     for (const [index, value] of Object.entries(this.items)) {
//       const v: Vec2 = this.indexToVec2(index)
//       const newValue = callback(value, v)
//       newContainer.setValue(v, newValue)
//     }
//     return newContainer
//   }

//   public foreach<U> (callback: (value: T, v: Vec2) => U): void {
//     for (const [index, value] of Object.entries(this.items)) {
//       const v: Vec2 = this.indexToVec2(index)
//       callback(value, v)
//     }
//   }
// }

export class Dict2D2<T> {
  public items: StringDict<T>

  constructor (items?: StringDict<T>) {
    this.items = items ?? {}
  }

  public clone (other: Dict2D2<T>) {
    this.items = other.items
  }

  private getIndex (v: Vec2): string {
    return `${v.x} ${v.y}`
  }

  private indexToVec2 (i: string): Vec2 {
    const [x, y] = i.split(' ')
    return { x: Number(x), y: Number(y) }
  }

  public setValue (v: Vec2, value: T): void {
    const index = this.getIndex(v)
    this.items[index] = value
  }

  public getValue (v: Vec2): T {
    const index = this.getIndex(v)
    return this.items[index]
  }

  public map<U> (callback: (value: T, v: Vec2) => U): Dict2D2<U> {
    const newContainer = new Dict2D2<U>()
    for (const [index, value] of Object.entries(this.items)) {
      const v: Vec2 = this.indexToVec2(index)
      const newValue = callback(value, v)
      newContainer.setValue(v, newValue)
    }
    return newContainer
  }

  public foreach<U> (callback: (value: T, v: Vec2) => U): void {
    for (const [index, value] of Object.entries(this.items)) {
      const v: Vec2 = this.indexToVec2(index)
      callback(value, v)
    }
  }
}

export class Array2D<T> {
  public width: number
  public height: number
  public array: T[]

  constructor (width: number, height: number, values: T[]) {
    this.width = width
    this.height = height
    this.array = values
  }

  static createWithDefaultValue<S> (
    width: number,
    height: number,
    defaultValue: S
  ): Array2D<S> {
    const values = new Array(width * height).fill(defaultValue)
    return new Array2D(width, height, values)
  }

  public length () {
    return this.width * this.height
  }

  private getIndex (v: Vec2): number {
    if (v.x >= 0 && v.y >= 0 && v.x < this.width && v.y < this.height) {
      return v.y * this.width + v.x
    }
    return -1
  }

  public setValue (v: Vec2, value: T): void {
    const index = this.getIndex(v)
    this.array[index] = value
  }

  public getValue (v: Vec2): T {
    const index = this.getIndex(v)
    return this.array[index]
  }

  public toDictionary (filterFnc: (value: T) => boolean): { [key: string]: T } {
    const dict: { [key: string]: T } = {}

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const key = `${x} ${y}`
        const value = this.getValue({ x, y })
        if (filterFnc(value)) {
          dict[key] = value
        }
      }
    }

    return dict
  }

  public toFormattedString (formatValue: (value: T) => string): string {
    let output = ''
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const item = formatValue(this.getValue({ x, y }))
        output += item + ' '
      }
      output += '\n'
    }
    return output
  }

  public map<U> (callback: (value: T, v: Vec2) => U): Array2D<U> {
    const newArray = []
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const value = this.getValue({ x, y })
        const newValue = callback(value, { x, y })
        newArray.push(newValue)
      }
    }
    return new Array2D(this.width, this.height, newArray)
  }
}
