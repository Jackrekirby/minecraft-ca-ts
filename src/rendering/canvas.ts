import { Dict2D } from '../containers/array2d'
import { Vec2, vec2Add, vec2Apply, vec2Subtract } from '../containers/vec2'
import { TileInfo, tilemap } from '../images/tilemap'
import { StateHandler } from '../utils/general'
import { LocalStorageVariable } from '../utils/save'

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
  imageGrid: Dict2D<string>

  // panning and scaling
  scale: StateHandler<number>
  scaleFactor: number
  offset: StateHandler<Vec2>
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
    this.imageGrid = new Dict2D<string>()

    // this.scale = createState(scale, 'canvas-scale')
    this.scale = new LocalStorageVariable({
      localStorageKey: 'canvas-scale',
      defaultValue: scale,
      saveInterval: 1000
    })
    this.scaleFactor = scaleFactor
    // this.offset = createState(offset, 'canvas-offset')
    this.offset = new LocalStorageVariable({
      localStorageKey: 'canvas-offset',
      defaultValue: offset,
      saveInterval: 1000
    })
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
      x: x * this.scale.get() + this.offset.get().x,
      y: y * this.scale.get() + this.offset.get().y
    }
  }

  // canvas to world
  calculateScreenToWorldPosition = (x: number, y: number) => {
    return {
      x: (x - this.offset.get().x) / this.scale.get(),
      y: (y - this.offset.get().y) / this.scale.get()
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
    // console.log(this.mouse, worldPos)
    return worldPos
  }

  handlePanning = () => {
    const canvas = this.canvas
    let lastMouse: Vec2 = { x: 0, y: 0 }
    let lastOffset: Vec2 = { x: 0, y: 0 }
    let isPanning: boolean = false
    let hasMetMinimumMovementThreshold = false
    let movementThreshold = 8

    const checkMovementThreshold = (offset: Vec2) => {
      if (hasMetMinimumMovementThreshold) return
      if (
        offset.x * offset.x + offset.y * offset.y >
        movementThreshold * movementThreshold
      ) {
        lastMouse = this.mouse
        hasMetMinimumMovementThreshold = true
      }
    }

    const handleMouseMove = (event: MouseEvent): void => {
      const pixelRatio = window.devicePixelRatio || 1
      this.mouse = {
        x: event.offsetX * pixelRatio,
        y: event.offsetY * pixelRatio
      }

      if (isPanning) {
        const mouseOffset = vec2Subtract(this.mouse, lastMouse)

        if (hasMetMinimumMovementThreshold) {
          this.offset.set(
            vec2Add(lastOffset, {
              x: mouseOffset.x,
              y: -mouseOffset.y
            })
          )
          this.render()
        }
        checkMovementThreshold(mouseOffset)
      } else {
        hasMetMinimumMovementThreshold = false
        lastMouse = this.mouse
        lastOffset = this.offset.get()
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mousedown', () => {
      isPanning = true
      lastMouse = this.mouse
      lastOffset = this.offset.get()
    })
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
        this.scale.set(this.scale.get() / this.scaleFactor)
      } else if (event.deltaY < 0) {
        this.scale.set(this.scale.get() * this.scaleFactor)
      }

      const postScaleScreenOrigin = this.calculateWorldToScreenPosition(
        worldOrigin.x,
        worldOrigin.y
      )

      const scaleOffset = vec2Subtract(
        preScaleScreenOrigin,
        postScaleScreenOrigin
      )

      this.offset.set(vec2Add(this.offset.get(), scaleOffset))

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

    const gridSize = this.getGridSize()

    const screenCellWidth = this.canvas.width / (numCellsWide / gridSize)

    this.ctx.fillStyle = 'white'
    this.ctx.font = `${screenCellWidth / 4}px Sora`

    // this.ctx.strokeStyle = 'white'
    // this.ctx.lineWidth = 1
    // this.ctx.strokeText(text, p.x, p.y - 4, screenCellWidth)
    this.ctx.fillText(
      text,
      Math.floor(p.x + 3),
      Math.floor(p.y - 4),
      screenCellWidth
    )
  }

  private getGridSize () {
    const targetCellSize = 64

    const topRight = this.calculateWorldToScreenPosition(1, 1)
    const bottomLeft = this.calculateWorldToScreenPosition(0, 0)
    const blockSizePixels = topRight.x - bottomLeft.x

    return Math.max(
      1,
      Math.floor(roundToNearestPowerOf2(targetCellSize / blockSizePixels))
    )
  }

  drawRect = (x: number, y: number, w: number, h: number) => {
    const q1 = this.calculateWorldToScreenPosition(x, y)
    const p = this.calculateAxisFlippedPosition(q1.x, q1.y)
    this.ctx.fillRect(
      Math.floor(p.x),
      Math.floor(p.y),
      Math.floor(w * this.scale.get() + (p.x - Math.floor(p.x))),
      Math.floor(h * this.scale.get() + (p.y - Math.floor(p.y)))
    )
  }

  drawImage = (
    imageName: string,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    const tileInfo: TileInfo = tilemap[imageName]
    if (!tileInfo) {
      console.warn(`ImageName: ${imageName} missing from tilemap`)
      return
    }
    const image = this.images.get('combinedImage')
    if (!image) return
    // console.log(imageName, tileInfo)
    const q1 = this.calculateWorldToScreenPosition(x, y)
    const p = this.calculateAxisFlippedPosition(q1.x, q1.y + this.scale.get())

    // console.log({ x: p.x - Math.floor(p.x) })
    this.ctx.drawImage(
      image,
      tileInfo.x,
      tileInfo.y,
      tileInfo.w,
      tileInfo.h,
      Math.floor(p.x),
      Math.floor(p.y),
      Math.floor(w * this.scale.get() + (p.x - Math.floor(p.x))),
      Math.floor(h * this.scale.get() + (p.y - Math.floor(p.y)))
    )
  }

  drawLine = (x1: number, y1: number, x2: number, y2: number) => {
    const q1 = this.calculateWorldToScreenPosition(x1, y1)
    const p1 = this.calculateAxisFlippedPosition(q1.x, q1.y)

    const q2 = this.calculateWorldToScreenPosition(x2, y2)
    const p2 = this.calculateAxisFlippedPosition(q2.x, q2.y)

    this.ctx.beginPath()
    this.ctx.moveTo(Math.floor(p1.x), Math.floor(p1.y))
    this.ctx.lineTo(Math.ceil(p2.x), Math.ceil(p2.y))
    this.ctx.stroke()
  }

  drawGridOverlay () {
    const topRight = this.calculateScreenToWorldPosition(
      this.canvas.width,
      this.canvas.height
    )
    const bottomLeft = this.calculateScreenToWorldPosition(0, 0)
    const gridSize = this.getGridSize()

    const setLineStyle = (z: number) => {
      const isMajorLine = z % (gridSize * 4) === 0
      this.ctx.lineWidth = isMajorLine ? 1 : 1
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${isMajorLine ? 0.6 : 0.2})`
    }
    for (
      let y = floorToNearest(bottomLeft.y, gridSize);
      y < topRight.y;
      y += gridSize
    ) {
      setLineStyle(y)
      this.drawLine(bottomLeft.x, y, topRight.x, y)
      this.drawText(`${y}`, bottomLeft.x, y)
    }

    for (
      let x = floorToNearest(bottomLeft.x, gridSize);
      x < topRight.x;
      x += gridSize
    ) {
      setLineStyle(x)
      this.drawLine(x, bottomLeft.y, x, topRight.y)
      this.drawText(`${x}`, x, bottomLeft.y)
    }
  }

  drawGrid () {
    const topRight = vec2Apply(
      this.calculateScreenToWorldPosition(
        this.canvas.width,
        this.canvas.height
      ),
      Math.floor
    )
    const bottomLeft = vec2Apply(
      this.calculateScreenToWorldPosition(0, 0),
      Math.floor
    )

    // TODO automatically which render method depending on render space
    // and grid size. Could chunk imageGrid as well.
    if (true) {
      // attempt to render all blocks and cull those outside render space
      // good if blocks in world < blocks in render space
      this.imageGrid.foreach((textureName: string, v: Vec2) => {
        if (
          v.x >= bottomLeft.x &&
          v.x <= topRight.x + 1 &&
          v.y >= bottomLeft.y &&
          v.y <= topRight.y + 1
        ) {
          this.drawImage(textureName, v.x, v.y, 1, 1)
        }
      })
    } else {
      // attempt to render all blocks in render space and skip rendering
      // if block does not exist
      // good if blocks in render space < blocks in world
      for (let y = bottomLeft.y; y <= topRight.y + 1; y += 1) {
        for (let x = bottomLeft.x; x <= topRight.x + 1; x += 1) {
          const texture_name = this.imageGrid.getValue({ x, y })
          if (texture_name === undefined) {
            continue
          }
          this.drawImage(texture_name, x, y, 1, 1)
        }
      }
    }
  }

  public setGridImages (imageGrid: Dict2D<string>) {
    this.imageGrid = imageGrid
  }

  public render () {
    this.ctx.fillStyle = 'rgb(18, 91, 167)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.drawGridOverlay()
    this.drawGrid()
  }
}
