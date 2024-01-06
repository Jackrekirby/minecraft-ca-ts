import { Array2D } from '../containers/array2d'
import { Vec2, vec2Add, vec2Subtract } from '../containers/vec2'
import { TileInfo, tilemap } from '../images/tilemap'

function roundToNearestPowerOf2 (number: number): number {
  // Check if the number is already a power of 2
  if ((number & (number - 1)) === 0) {
    return number
  }

  // Find the nearest power of 2 greater than the given number
  let power = 1
  while (power < number) {
    power <<= 1
  }

  // Check if the lower or upper power of 2 is closer
  const lowerPower = power >>> 1
  const upperPower = power
  return upperPower - number < number - lowerPower ? upperPower : lowerPower
}

function floorToNearest (value: number, target: number) {
  return Math.floor(value / target) * target
}

export class Canvas {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  images: Map<string, HTMLImageElement>
  imageGrid: Array2D<string>

  // panning and scaling
  scale: number
  scaleFactor: number
  offset: Vec2
  mouse: Vec2

  constructor (
    canvas: HTMLCanvasElement,
    images: Map<string, HTMLImageElement>,
    scale: number,
    scaleFactor: number,
    offset: Vec2
  ) {
    this.canvas = canvas

    // no anti-aliasing
    this.ctx = canvas.getContext('2d')!
    this.ctx.imageSmoothingEnabled = false

    this.images = images
    this.imageGrid = new Array2D<string>(0, 0, [])

    this.scale = scale
    this.scaleFactor = scaleFactor
    this.offset = offset
    this.mouse = { x: 0, y: 0 }

    this.handlePanning()
    this.handleScaling()
  }

  // screen to canvas AND canvas to screen
  calculateAxisFlippedPosition = (x: number, y: number) => {
    return { x: x, y: this.canvas.height - y }
  }

  // world to canvas
  calculateWorldToScreenPosition = (x: number, y: number) => {
    return {
      x: x * this.scale + this.offset.x,
      y: y * this.scale + this.offset.y
    }
  }

  // canvas to world
  calculateScreenToWorldPosition = (x: number, y: number) => {
    return {
      x: (x - this.offset.x) / this.scale,
      y: (y - this.offset.y) / this.scale
    }
  }

  getMouseWorldPosition () {
    const axisFlippedPos: Vec2 = this.calculateAxisFlippedPosition(
      this.mouse.x,
      this.mouse.y
    )
    const worldPos: Vec2 = this.calculateScreenToWorldPosition(
      axisFlippedPos.x,
      axisFlippedPos.y
    )
    return worldPos
  }

  handlePanning = () => {
    const canvas = this.canvas
    let lastMouse: Vec2 = { x: 0, y: 0 }
    let isPanning: boolean = false

    const handleMouseMove = (event: MouseEvent): void => {
      lastMouse = this.mouse
      this.mouse = { x: event.offsetX, y: event.offsetY }

      if (isPanning) {
        const mouseOffset = vec2Subtract(this.mouse, lastMouse)

        this.offset = vec2Add(this.offset, {
          x: mouseOffset.x,
          y: -mouseOffset.y
        })
        this.render()
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mousedown', () => (isPanning = true))
    canvas.addEventListener('mouseup', () => (isPanning = false))
    canvas.addEventListener('mouseleave', () => (isPanning = false))
  }

  handleScaling = () => {
    const handleScroll = (event: WheelEvent): void => {
      // scaleOrigin in world pos
      const axisFlippedOrigin: Vec2 = this.calculateAxisFlippedPosition(
        this.mouse.x,
        this.mouse.y
      )
      const worldOrigin: Vec2 = this.calculateScreenToWorldPosition(
        axisFlippedOrigin.x,
        axisFlippedOrigin.y
      )
      const preScaleScreenOrigin = this.calculateWorldToScreenPosition(
        worldOrigin.x,
        worldOrigin.y
      )

      if (event.deltaY > 0) {
        this.scale /= this.scaleFactor
      } else if (event.deltaY < 0) {
        this.scale *= this.scaleFactor
      }

      const postScaleScreenOrigin = this.calculateWorldToScreenPosition(
        worldOrigin.x,
        worldOrigin.y
      )

      const scaleOffset = vec2Subtract(
        preScaleScreenOrigin,
        postScaleScreenOrigin
      )

      this.offset = vec2Add(this.offset, scaleOffset)

      this.render()
    }

    this.canvas.addEventListener('wheel', handleScroll)
  }

  drawText = (text: string, x: number, y: number) => {
    const q1 = this.calculateWorldToScreenPosition(x, y)
    const p = this.calculateAxisFlippedPosition(q1.x, q1.y)

    const offset = 20
    if (
      (p.x < offset || p.x > this.canvas.width - offset) &&
      (p.y < offset || p.y > this.canvas.height - offset)
    ) {
      return
    }

    const topRight = this.calculateScreenToWorldPosition(
      this.canvas.width,
      this.canvas.height
    )
    const bottomLeft = this.calculateScreenToWorldPosition(0, 0)
    let numCellsWide = topRight.x - bottomLeft.x

    const gridSize = Math.max(
      1,
      Math.floor(roundToNearestPowerOf2(numCellsWide / 10))
    )

    const screenCellWidth = this.canvas.width / (numCellsWide / gridSize)

    this.ctx.fillStyle = 'white'
    this.ctx.font = `${screenCellWidth / 4}px Sora`

    // this.ctx.strokeStyle = 'white'
    // this.ctx.lineWidth = 1
    // this.ctx.strokeText(text, p.x, p.y - 4, screenCellWidth)
    this.ctx.fillText(text, p.x + 3, p.y - 4, screenCellWidth)
  }

  drawRect = (x: number, y: number, w: number, h: number) => {
    const q1 = this.calculateWorldToScreenPosition(x, y)
    const p = this.calculateAxisFlippedPosition(q1.x, q1.y)
    this.ctx.fillRect(p.x, p.y, w * this.scale, h * this.scale)
  }

  drawImage = (
    imageName: string,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    const tileInfo: TileInfo = tilemap[imageName]
    if (!tileInfo) return
    const image = this.images.get('combinedImage')
    if (!image) return
    // console.log(imageName, tileInfo)
    const q1 = this.calculateWorldToScreenPosition(x, y)
    const p = this.calculateAxisFlippedPosition(q1.x, q1.y + this.scale)
    this.ctx.drawImage(
      image,
      tileInfo.x,
      tileInfo.y,
      tileInfo.w,
      tileInfo.h,
      p.x,
      p.y,
      w * this.scale,
      h * this.scale
    )
  }

  drawLine = (x1: number, y1: number, x2: number, y2: number) => {
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    const q1 = this.calculateWorldToScreenPosition(x1, y1)
    const p1 = this.calculateAxisFlippedPosition(q1.x, q1.y)

    const q2 = this.calculateWorldToScreenPosition(x2, y2)
    const p2 = this.calculateAxisFlippedPosition(q2.x, q2.y)

    this.ctx.beginPath()
    this.ctx.moveTo(p1.x, p1.y)
    this.ctx.lineTo(p2.x, p2.y)
    this.ctx.stroke()
  }

  drawGridOverlay () {
    const topRight = this.calculateScreenToWorldPosition(
      this.canvas.width,
      this.canvas.height
    )
    const bottomLeft = this.calculateScreenToWorldPosition(0, 0)

    let numCellsWide = topRight.x - bottomLeft.x

    let gridSize = Math.max(
      1,
      Math.floor(roundToNearestPowerOf2(numCellsWide / 10))
    )

    for (
      let y = floorToNearest(bottomLeft.y, gridSize);
      y < topRight.y;
      y += gridSize
    ) {
      this.drawLine(bottomLeft.x, y, topRight.x, y)
      this.drawText(`${y}`, bottomLeft.x, y)
    }

    for (
      let x = floorToNearest(bottomLeft.x, gridSize);
      x < topRight.x;
      x += gridSize
    ) {
      this.drawLine(x, bottomLeft.y, x, topRight.y)
      this.drawText(`${x}`, x, bottomLeft.y)
    }
  }

  drawGrid () {
    const topRight = this.calculateScreenToWorldPosition(
      this.canvas.width,
      this.canvas.height
    )
    const bottomLeft = this.calculateScreenToWorldPosition(0, 0)

    for (
      let y = Math.floor(bottomLeft.y);
      y <= Math.floor(topRight.y + 1);
      y += 1
    ) {
      for (
        let x = Math.floor(bottomLeft.x);
        x <= Math.floor(topRight.x + 1);
        x += 1
      ) {
        const texture_name = this.imageGrid.getValue({ x, y })

        this.drawImage(texture_name, x, y, 1, 1)
      }
    }
  }

  public setGridImages (imageGrid: Array2D<string>) {
    this.imageGrid = imageGrid
  }

  public render () {
    this.ctx.fillStyle = 'rgb(18, 91, 167)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.drawGridOverlay()
    this.drawGrid()
  }
}
