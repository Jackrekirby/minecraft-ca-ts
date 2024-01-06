import { Vec2 } from './vec2'

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
