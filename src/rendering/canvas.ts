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

type SomeCanvasRenderingContext2D =
  | OffscreenCanvasRenderingContext2D
  | CanvasRenderingContext2D

export type ColorMask = (index: number, value: number) => number

export interface CanvasGridCellLayer {
  textureName: string
  blendMode?: GlobalCompositeOperation
  alpha?: number
  minSize?: number
  mask?: ColorMask
}

export interface CanvasGridCell {
  layers: CanvasGridCellLayer[]
}

export type CanvasGridItem = CanvasGridCell | string

export class Canvas {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  images: Map<string, HTMLImageElement>
  imageGrid: Dict2D<CanvasGridItem>

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

    canvas.addEventListener('pointermove', handleMouseMove)
    canvas.addEventListener('pointerdown', () => {
      isPanning = true
      lastMouse = this.mouse
      lastOffset = this.offset.get()
    })
    canvas.addEventListener('pointerup', () => (isPanning = false))
    canvas.addEventListener('pointerleave', () => (isPanning = false))
  }

  private scaleAboutPosition (scale: number, position: Vec2) {
    const preScaledScreenPosition: Vec2 = this.calculateWorldToScreenPosition(
      position.x,
      position.y
    )

    this.scale.set(scale)

    const postScaledScreenPosition = this.calculateWorldToScreenPosition(
      position.x,
      position.y
    )

    const scaleOffset = vec2Subtract(
      preScaledScreenPosition,
      postScaledScreenPosition
    )

    this.offset.set(vec2Add(this.offset.get(), scaleOffset))

    this.render()
  }

  setScale (pixelsPerUnit: number) {
    const centerWorldPosition: Vec2 = this.calculateScreenToWorldPosition(
      this.canvas.width / 2,
      this.canvas.height / 2
    )

    this.scaleAboutPosition(pixelsPerUnit, centerWorldPosition)
  }

  moveTo = (worldPosition: Vec2) => {
    const screenPosition: Vec2 = this.calculateWorldToScreenPosition(
      worldPosition.x,
      worldPosition.y
    )

    const delta = vec2Add(vec2Subtract(this.offset.get(), screenPosition), {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2
    })
    console.log('move', delta)
    this.offset.set(delta)
  }

  handleScaling = () => {
    const handleScroll = (event: WheelEvent): void => {
      // scaleOrigin in world pos
      const mouseCanvasPosition: Vec2 = this.calculateAxisFlippedPosition(
        this.mouse.x,
        this.mouse.y
      )
      const mouseWorldPosition: Vec2 = this.calculateScreenToWorldPosition(
        mouseCanvasPosition.x,
        mouseCanvasPosition.y
      )

      let scale: number
      if (event.deltaY > 0) {
        scale = this.scale.get() / this.scaleFactor
      } else {
        scale = this.scale.get() * this.scaleFactor
      }

      this.scaleAboutPosition(scale, mouseWorldPosition)
    }

    this.canvas.addEventListener('wheel', handleScroll)
  }

  drawText = (
    text: string,
    x: number,
    y: number,
    ctx: SomeCanvasRenderingContext2D = this.ctx
  ) => {
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

    ctx.fillStyle = 'white'
    ctx.font = `${screenCellWidth / 4}px Roboto Mono`

    // this.ctx.strokeStyle = 'white'
    // this.ctx.lineWidth = 1
    // this.ctx.strokeText(text, p.x, p.y - 4, screenCellWidth)
    ctx.fillText(
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

  recolorImage (x: number, y: number, w: number, h: number, mask: ColorMask) {
    const q1 = this.calculateWorldToScreenPosition(x, y)
    const p = this.calculateAxisFlippedPosition(q1.x, q1.y + this.scale.get())
    const settings: CanvasRenderingContext2DSettings = {
      willReadFrequently: true
    }
    const imageData = this.ctx.getImageData(
      Math.floor(p.x),
      Math.floor(p.y),
      Math.floor(w * this.scale.get() + (p.x - Math.floor(p.x))),
      Math.floor(h * this.scale.get() + (p.y - Math.floor(p.y))),
      settings
    )
    const pixels = imageData.data

    for (let i = 0; i < pixels.length; ++i) {
      pixels[i] = mask(i, pixels[i])
    }

    this.ctx.putImageData(imageData, Math.floor(p.x), Math.floor(p.y))
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

  drawLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    ctx: SomeCanvasRenderingContext2D = this.ctx
  ) => {
    const q1 = this.calculateWorldToScreenPosition(x1, y1)
    const p1 = this.calculateAxisFlippedPosition(q1.x, q1.y)

    const q2 = this.calculateWorldToScreenPosition(x2, y2)
    const p2 = this.calculateAxisFlippedPosition(q2.x, q2.y)

    ctx.beginPath()
    ctx.moveTo(Math.floor(p1.x), Math.floor(p1.y))
    ctx.lineTo(Math.ceil(p2.x), Math.ceil(p2.y))
    ctx.stroke()
  }

  drawGridOverlay (ctx: SomeCanvasRenderingContext2D = this.ctx) {
    const topRight = this.calculateScreenToWorldPosition(
      this.canvas.width,
      this.canvas.height
    )
    const bottomLeft = this.calculateScreenToWorldPosition(0, 0)
    const gridSize = this.getGridSize()

    const setLineStyle = (z: number) => {
      const isMajorLine = z % (gridSize * 4) === 0
      ctx.lineWidth = isMajorLine ? 1 : 1
      ctx.strokeStyle = `rgba(255, 255, 255, ${isMajorLine ? 0.6 : 0.2})`
    }
    for (
      let y = floorToNearest(bottomLeft.y, gridSize);
      y < topRight.y;
      y += gridSize
    ) {
      setLineStyle(y)
      this.drawLine(bottomLeft.x, y, topRight.x, y, ctx)
      this.drawText(`${y}`, bottomLeft.x, y, ctx)
    }

    for (
      let x = floorToNearest(bottomLeft.x, gridSize);
      x < topRight.x;
      x += gridSize
    ) {
      setLineStyle(x)
      this.drawLine(x, bottomLeft.y, x, topRight.y, ctx)
      this.drawText(`${x}`, x, bottomLeft.y, ctx)
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
    const mode = true

    const scale = this.scale.get()

    const drawLayer = (v: Vec2, layer: CanvasGridCellLayer) => {
      if (layer.minSize && layer.minSize > scale) return

      this.ctx.globalCompositeOperation = layer.blendMode ?? 'source-over'
      this.ctx.globalAlpha = layer.alpha ?? 1.0

      this.drawImage(layer.textureName, v.x, v.y, 1, 1)

      this.ctx.globalCompositeOperation = 'source-over'
      this.ctx.globalAlpha = 1.0

      if (layer.mask) {
        this.recolorImage(v.x, v.y, 1, 1, layer.mask)
      }

      // this.ctx.filter = 'none'
    }

    // TODO automatically which render method depending on render space
    // and grid size. Could chunk imageGrid as well.
    if (mode) {
      // attempt to render all blocks and cull those outside render space
      // good if blocks in world < blocks in render space
      this.imageGrid.foreach((item: CanvasGridItem, v: Vec2) => {
        if (
          v.x >= bottomLeft.x &&
          v.x <= topRight.x + 1 &&
          v.y >= bottomLeft.y &&
          v.y <= topRight.y + 1
        ) {
          if (typeof item === 'string') {
            this.drawImage(item, v.x, v.y, 1, 1)
          } else {
            for (const layer of item.layers) {
              drawLayer(v, layer)
            }
          }
        }
      })
    } else {
      // attempt to render all blocks in render space and skip rendering
      // if block does not exist
      // good if blocks in render space < blocks in world
      for (let y = bottomLeft.y; y <= topRight.y + 1; y += 1) {
        for (let x = bottomLeft.x; x <= topRight.x + 1; x += 1) {
          const item: CanvasGridItem = this.imageGrid.getValue({ x, y })

          if (item === undefined) {
            continue
          }
          if (typeof item === 'string') {
            this.drawImage(item, x, y, 1, 1)
          } else {
            for (const layer of item.layers) {
              drawLayer({ x, y }, layer)
            }
          }
        }
      }
    }
  }

  public setGridImages (imageGrid: Dict2D<CanvasGridItem>) {
    this.imageGrid = imageGrid
  }

  public render () {
    // draw foreground to cleared canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawGrid()
    // draw background to offscreen canvas so foreground can apply color blending
    const offscreenCanvas = new OffscreenCanvas(
      this.canvas.width,
      this.canvas.height
    )
    const offscreenCtx: OffscreenCanvasRenderingContext2D = offscreenCanvas.getContext(
      '2d'
    )!
    offscreenCtx.fillStyle = 'rgb(18, 91, 167)'
    offscreenCtx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawGridOverlay(offscreenCtx)
    this.ctx.globalCompositeOperation = 'destination-over'
    this.ctx.drawImage(offscreenCanvas, 0, 0)
    this.ctx.globalCompositeOperation = 'source-over'
  }
}
