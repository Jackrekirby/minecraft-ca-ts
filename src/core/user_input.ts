import { Air } from '../blocks/air'
import { Vec2, vec2Apply, vec2Subtract } from '../containers/vec2'
import { Canvas } from '../rendering/canvas'
import { createBlock } from '../utils/create_block'
import { addClickHandlerWithDragCheck } from '../utils/general'
import { Block, BlockContainer, BlockState, BlockType } from './block'
import { Direction } from './direction'
import { updateCanvasBlocks } from './game_loop'
import { selectedBlockState } from './storage'

const canvasElement = document.getElementById('canvas') as HTMLCanvasElement

export const initCanvasResizeListener = () => {
  const resizeCanvas = () => {
    const context = canvasElement.getContext('2d')!
    const pixelRatio = window.devicePixelRatio || 1
    canvasElement.width = canvasElement.clientWidth * pixelRatio
    canvasElement.height = canvasElement.clientHeight * pixelRatio

    context.imageSmoothingEnabled = false
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
  addToTickQueue: (v: Vec2) => void
) => {
  const placeBlock = (event: MouseEvent) => {
    // console.log('place block')
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
      const copyState = selectedBlockState.get() as Block

      const newBlock = createBlock(copyState.type, {
        direction,
        ...copyState
      })
      blocks.setValue(pi, newBlock)
      blocks.setValue(pi, newBlock.update(pi, blocks))
      addToTickQueue(pi)
      // updateCanvas()
      updateCanvasBlocks(blocks, canvas)
    } else {
      console.log('selected block', block.type)

      if (
        // TODO add interaction() to each block type
        // OR on update check if any mouse events have been called on you
        event.ctrlKey &&
        block.interact
      ) {
        const newBlock = block.interact()
        blocks.setValue(pi, newBlock)
        blocks.setValue(pi, newBlock.update(pi, blocks))
        addToTickQueue(pi)
        // updateCanvas()
      } else {
        const copyState: BlockState = block.copy
          ? block.copy()
          : { type: block.type }

        selectedBlockState.set(copyState)
      }

      updateCanvasBlocks(blocks, canvas)
    }
  }

  const deleteBlock = () => {
    // console.log('delete block')
    const p = canvas.getMouseWorldPosition()
    const pi = vec2Apply(p, Math.floor)
    blocks.setValue(pi, new Air({}))
    addToTickQueue(pi)
    updateCanvasBlocks(blocks, canvas)
    // updateCanvas()
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
