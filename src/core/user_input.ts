import { Air } from '../blocks/air'
import { Vec2, vec2Apply, vec2Subtract } from '../containers/vec2'
import { Canvas } from '../rendering/canvas'
import { createBlock } from '../utils/create_block'
import {
  addClickHandlerWithDragCheck,
  interpretCastString
} from '../utils/general'
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

export const isBodyCurrentlyFocused = () => {
  return document.activeElement === document.body
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
    const deleteBlocks = event.shiftKey
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
          if (deleteBlocks) {
            blocks.setValue(v, new Air())
          }
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

const stringifyBlock = (
  block: Record<string, any>,
  isNested: boolean = false
): string => {
  return Object.entries(block)
    .map(([key, value]) => {
      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null
      ) {
        // Handle nested objects recursively
        return `${key}=[${stringifyBlock(value, true)}]`
      } else if (Array.isArray(value)) {
        // Surround arrays with angled brackets
        return `${key}=[${value.join(',')}]`
      } else {
        return `${key}=${value}`
      }
    })
    .join(isNested ? ',' : '@')
}

const parseBlockString = (input: string): Record<string, any> => {
  const result: Record<string, any> = {}
  const texts = input.split('@')

  for (const text of texts) {
    const key = text.split('=')[0]
    const valueRaw = text
      .split('=')
      .slice(1)
      .join('=')
    let value: any = valueRaw

    // console.log('parse ?', valueRaw)
    if (valueRaw.startsWith('[') && value.endsWith(']')) {
      if (valueRaw.includes('=')) {
        // parse object
        // console.log('parse object', valueRaw)

        value = Object.fromEntries(
          valueRaw
            .substring(1, valueRaw.length - 1)
            .split(',')
            .map(item => {
              const [key, value] = item.trim().split('=')
              return [key, interpretCastString(value)]
            })
        )
      } else {
        // console.log('parse array', valueRaw)
        // Parse array
        value = valueRaw
          .substring(1, valueRaw.length - 1)
          .split(',')
          .map(item => interpretCastString(item.trim()))
      }
    } else {
      value = interpretCastString(valueRaw)
    }

    result[key] = value
  }

  return result
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
        if (typeof newBlock === 'string') {
        } else {
          blocks.setValue(pi, newBlock)
          blocks.setValue(pi, newBlock.update(pi, blocks))
          addToTickQueue(pi)
        }

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

  addClickHandlerWithDragCheck(canvasElement, placeBlock, 8)

  const blockStateDebugElement = document.getElementById('block-state-debug')!
  let blockStateDebugInterval: NodeJS.Timeout
  const handleBlockStateDebug = (event: MouseEvent): void => {
    const pixelRatio = window.devicePixelRatio || 1
    const mouse: Vec2 = {
      x: event.offsetX * pixelRatio,
      y: event.offsetY * pixelRatio
    }

    const v: Vec2 = vec2Apply(canvas.getMouseWorldPosition(mouse), Math.floor)

    clearInterval(blockStateDebugInterval)
    const block = blocks.getValue(v)
    if (block.type === BlockType.Air) {
      // do not show tracking for an air block (used to turn debug off)
      blockStateDebugElement.classList.add('hide')
      return
    }

    const updateBlockDebugState = () => {
      const block = blocks.getValue(v)

      const x = stringifyBlock(block)

      if (x !== lastBlockText) {
        // console.log(x, parseBlockString(x))
        lastBlockText = x
        blockStateDebugElement.innerHTML = ''
        x.split('@').map(text => {
          const key = text.split('=')[0]
          const value = text
            .split('=')
            .slice(1)
            .join('=')

          const item = document.createElement('div')
          item.className = 'item'
          const label = document.createElement('label')
          const input = document.createElement('span')
          input.className = 'input'
          input.contentEditable = 'true'
          const id = `block-field-${key}`
          input.id = id
          label.textContent = key + ':'
          label.htmlFor = id
          input.innerHTML = value

          const updateBlockState = () => {
            const newBlockState: any = { ...block }
            newBlockState[key] = interpretCastString(input.innerHTML)
            const newBlock = createBlock(block.type, newBlockState)
            // console.log(newBlock)
            blocks.setValue(v, newBlock)
            updateCanvasBlocks(blocks, canvas)
          }

          document.addEventListener('keydown', event => {
            if (input !== document.activeElement) {
              return
            }
            if (event.key === 'Enter' && !event.shiftKey) {
              updateBlockState()
              event.preventDefault()
            }
          })

          input.onblur = updateBlockState
          item.appendChild(label)
          item.appendChild(input)
          blockStateDebugElement.appendChild(item)
        })
      }
    }

    let lastBlockText = ''
    blockStateDebugInterval = setInterval(updateBlockDebugState, 100)

    updateBlockDebugState()
    blockStateDebugElement.classList.remove('hide')
  }

  document.addEventListener('keydown', event => {
    if (!isBodyCurrentlyFocused()) {
      return
    }
    if (event.key === 'e') {
      const p = canvas.getMouseWorldPosition()
      const pi = vec2Apply(p, Math.floor)
      console.log(blocks.getValue(pi))
    } else if (event.key === 'a') {
      toggleInventoryVisibility()
    }
  })

  canvasElement.addEventListener('contextmenu', function (event) {
    // right click
    event.preventDefault() // Prevent the default context menu from appearing
    if (event.ctrlKey) {
      deleteBlock()
    } else {
      handleBlockStateDebug(event)
    }
  })
}
