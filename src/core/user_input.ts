import { Air } from '../blocks/air'
import { Vec2, vec2Apply, vec2Subtract } from '../containers/vec2'
import { Canvas } from '../rendering/canvas'
import { createBlock } from '../utils/create_block'
import { addClickHandlerWithDragCheck } from '../utils/general'
import { Block, BlockContainer, BlockType } from './block'
import { Direction } from './direction'
import { updateCanvasBlocks } from './game_loop'
import { setInventorySlot, toggleInventoryVisibility } from './inventory'
import { storage } from './storage'
import { createEmptyWorld } from './world_loading'

const canvasElement = document.getElementById('canvas') as HTMLCanvasElement
const selectionElement = document.getElementById('selection') as HTMLDivElement
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

const initBlockSelection = (blocks: BlockContainer, canvas: Canvas) => {
  let mouse: Vec2 = { x: 0, y: 0 }
  let lastMouse: Vec2 = { x: 0, y: 0 }
  let isPanning: boolean = false
  let hasMetMinimumMovementThreshold = false
  let movementThreshold = 8

  const checkMovementThreshold = (offset: Vec2) => {
    if (hasMetMinimumMovementThreshold) return
    if (
      offset.x * offset.x + offset.y * offset.y >
      movementThreshold * movementThreshold
    ) {
      lastMouse = mouse
      hasMetMinimumMovementThreshold = true
    }
  }

  const handleMouseMove = (event: MouseEvent): void => {
    const pixelRatio = window.devicePixelRatio || 1
    mouse = {
      x: event.offsetX * pixelRatio,
      y: event.offsetY * pixelRatio
    }

    if (isPanning) {
      const mouseOffset = vec2Subtract(mouse, lastMouse)

      checkMovementThreshold(mouseOffset)
    } else {
      hasMetMinimumMovementThreshold = false
      lastMouse = mouse
    }

    if (hasMetMinimumMovementThreshold) {
      // render selection element
      selectionElement.classList.remove('hide')

      const minMousePos: Vec2 = {
        x: Math.min(lastMouse.x, mouse.x),
        y: Math.min(lastMouse.y, mouse.y)
      }

      const maxMousePos: Vec2 = {
        x: Math.max(lastMouse.x, mouse.x),
        y: Math.max(lastMouse.y, mouse.y)
      }

      // console.log(minMousePos, maxMousePos)

      selectionElement.style.top = `${minMousePos.y}px`
      selectionElement.style.height = `${maxMousePos.y - minMousePos.y}px`
      selectionElement.style.left = `${minMousePos.x}px`
      selectionElement.style.width = `${maxMousePos.x - minMousePos.x}px`
    }
  }

  const handleComplete = (event: MouseEvent): void => {
    if (hasMetMinimumMovementThreshold) {
      const startPos = vec2Apply(
        canvas.getMouseWorldPosition(lastMouse),
        Math.floor
      )
      const endPos = vec2Apply(canvas.getMouseWorldPosition(mouse), Math.floor)

      const copyWorld = createEmptyWorld()

      const minPos: Vec2 = {
        x: Math.min(startPos.x, endPos.x),
        y: Math.min(startPos.y, endPos.y)
      }

      const maxPos: Vec2 = {
        x: Math.max(startPos.x, endPos.x),
        y: Math.max(startPos.y, endPos.y)
      }

      for (let y = minPos.y; y < maxPos.y + 1; ++y) {
        for (let x = minPos.x; x < maxPos.x + 1; ++x) {
          const v = { x, y }
          copyWorld.setValue(vec2Subtract(v, minPos), blocks.getValue(v))
        }
      }

      // console.log(startPos, endPos)
      // console.log(copyWorld)

      storage.selectedBlockStorage.set(copyWorld)

      // storage.selectedBlockStorage.set(copyWorld)
      // downloadWorld(copyWorld, false)
    }
    isPanning = false
    hasMetMinimumMovementThreshold = false
    selectionElement.classList.add('hide')
  }

  canvas.canvas.addEventListener('pointermove', handleMouseMove)
  canvas.canvas.addEventListener('pointerdown', (ev: PointerEvent) => {
    // do not allow block selection if ctrlKey is pressed
    if (!ev.ctrlKey) return
    isPanning = true
    lastMouse = mouse
  })

  canvas.canvas.addEventListener('pointerup', handleComplete)
  canvas.canvas.addEventListener('pointerleave', handleComplete)
}

export const initBlockEventListeners = (
  canvas: Canvas,
  blocks: BlockContainer,
  addToTickQueue: (v: Vec2) => void
) => {
  initBlockSelection(blocks, canvas)
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
      const copyState = storage.selectedBlockState.get() as Block

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
      // console.log('selected block', block.type)

      if (!event.ctrlKey && block.interact) {
        const newBlock = block.interact()
        blocks.setValue(pi, newBlock)
        blocks.setValue(pi, newBlock.update(pi, blocks))
        addToTickQueue(pi)
        // updateCanvas()
      } else {
        // const copyState: BlockState = block.copy
        //   ? block.copy()
        //   : { type: block.type }

        // storage.selectedBlockState.set(copyState)

        setInventorySlot(block)
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
    } else if (event.key === 'a') {
      toggleInventoryVisibility()
    }
  })
}
