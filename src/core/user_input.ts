import { Air } from '../blocks/air'
import { RedstoneRepeater } from '../blocks/redstone_repeater'
import { Vec2, vec2Apply, vec2Subtract } from '../containers/vec2'
import { Canvas } from '../rendering/canvas'
import { createBlock } from '../utils/create_block'
import { addClickHandlerWithDragCheck } from '../utils/general'
import { BlockContainer, BlockType, isBlock } from './block'
import { Direction } from './direction'
import { GLOBALS } from './globals'

const canvasElement = document.getElementById('canvas') as HTMLCanvasElement

export const initCanvasResizeListener = (updateCanvas: () => void) => {
  const resizeCanvas = () => {
    const context = canvasElement.getContext('2d')!
    const pixelRatio = window.devicePixelRatio || 1
    canvasElement.width = canvasElement.clientWidth * pixelRatio
    canvasElement.height = canvasElement.clientHeight * pixelRatio

    context.imageSmoothingEnabled = false
    updateCanvas()
  }

  let resizeTimeout: NodeJS.Timeout
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      resizeCanvas()
    }, 200)
  })

  resizeCanvas()
}

export const initBlockEventListeners = (
  canvas: Canvas,
  blocks: BlockContainer,
  updateCanvas: () => void,
  setGlobal: (name: string, value: any) => void
) => {
  const placeBlock = (event: MouseEvent) => {
    console.log('place block')
    const p = canvas.getMouseWorldPosition()
    const pi = vec2Apply(p, Math.floor)

    const getPlacementDirection = (v: Vec2) => {
      if (Math.abs(v.x - 0.5) > Math.abs(v.y - 0.5)) {
        return v.x > 0.5 ? Direction.Right : Direction.Left
      } else {
        return v.y > 0.5 ? Direction.Up : Direction.Down
      }
    }

    const direction: Direction = getPlacementDirection(vec2Subtract(p, pi))

    const block = blocks.getValue(pi)

    if (block.type === BlockType.Air) {
      const newBlock = createBlock(GLOBALS.selectedBlock.get(), { direction })
      blocks.setValue(pi, newBlock)
      blocks.setValue(pi, newBlock.update(pi, blocks))
      updateCanvas()
    } else {
      console.log('selected block', block.type)

      if (
        // TODO add interaction() to each block type
        // OR on update check if any mouse events have been called on you
        event.ctrlKey &&
        isBlock<RedstoneRepeater>(block, BlockType.RedstoneRepeater)
      ) {
        let ticksOn = block.ticksOn,
          ticksOff = block.ticksOff

        if (block.isPowered) {
          ticksOn = ((ticksOn + ticksOff) % 4) + 1
          ticksOff = 0
        } else {
          ticksOff = ((ticksOn + ticksOff) % 4) + 1
          ticksOn = 0
        }

        const newBlock = createBlock(block.type, {
          ...block,
          ticksOn,
          ticksOff
        })
        blocks.setValue(pi, newBlock)
        blocks.setValue(pi, newBlock.update(pi, blocks))
        updateCanvas()
      } else {
        setGlobal('selectedBlock', block.type)
      }
    }
  }

  const deleteBlock = () => {
    console.log('delete block')
    const p = canvas.getMouseWorldPosition()
    const pi = vec2Apply(p, Math.floor)
    blocks.setValue(pi, new Air({}))
    updateCanvas()
  }

  canvasElement.addEventListener('contextmenu', function (event) {
    // right click
    event.preventDefault() // Prevent the default context menu from appearing
    deleteBlock()
  })

  addClickHandlerWithDragCheck(canvasElement, placeBlock, 8)

  document.addEventListener('keydown', event => {
    if (event.key === 'e') {
      const p = canvas.getMouseWorldPosition()
      const pi = vec2Apply(p, Math.floor)
      console.log(blocks.getValue(pi))
    }
  })
}
