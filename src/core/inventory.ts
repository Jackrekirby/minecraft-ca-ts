import { TileInfo, tilemap } from '../images/tilemap'
import { CanvasGridCellLayer, CanvasGridItem } from '../rendering/canvas'
import { createBlock } from '../utils/create_block'
import { LocalStorageVariable } from '../utils/save'
import { Block, BlockContainer, BlockState } from './block'
import { convertObjectToString } from './globals'
import { storage } from './storage'
import {
  createEmptyBlockContainer,
  listSelectableBlocks
} from './world_loading'

const blockSelectionPanel = document.getElementById(
  'block-selection-panel'
) as HTMLDivElement
const blockSelectionWrapper = document.getElementById(
  'block-selection-wrapper'
) as HTMLDivElement

const canvasElement = document.getElementById('canvas') as HTMLCanvasElement
const inventoryPanel = document.getElementById(
  'inventory-panel'
) as HTMLDivElement
const inventoryWrapper = document.getElementById(
  'inventory-wrapper'
) as HTMLDivElement
let selectedInventorySlot = 0

const inventoryState: { createBlockItem: CreateBlockItem } = {
  createBlockItem: (null as unknown) as CreateBlockItem
}

const drawImage = (
  ctx: CanvasRenderingContext2D,
  images: Map<string, HTMLImageElement>,
  imageName: string,
  imageSize: number
) => {
  const tileInfo: TileInfo = tilemap[imageName]
  if (!tileInfo) {
    console.warn(`ImageName: ${imageName} missing from tilemap`)
    return
  }
  const image = images.get('combinedImage')!
  ctx.drawImage(
    image,
    tileInfo.x,
    tileInfo.y,
    tileInfo.w,
    tileInfo.h,
    0,
    0,
    imageSize,
    imageSize
  )
}

const drawLayer = (
  ctx: CanvasRenderingContext2D,
  images: Map<string, HTMLImageElement>,
  layer: CanvasGridCellLayer,
  imageSize: number
) => {
  if (layer.minSize) return // do not render details

  ctx.globalCompositeOperation = layer.blendMode ?? 'source-over'
  ctx.globalAlpha = layer.alpha ?? 1.0

  drawImage(ctx, images, layer.textureName, imageSize)

  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1.0

  // do not bother with drawing masks
}

const createCopyBlock = (block: Block): BlockState => {
  const copyBlock = block.copy ? block.copy() : { type: block.type }
  return copyBlock
}

const createBlockItemRaw = (
  images: Map<string, HTMLImageElement>,
  blockState: BlockState,
  world: BlockContainer,
  imageSize: number,
  containerDiv?: HTMLDivElement
) => {
  const block = createBlock(blockState.type, blockState)
  const canvasItem: CanvasGridItem = block.getTextureName({ x: 8, y: 8 }, world)
  let canvas: HTMLCanvasElement
  let tooltipDiv: HTMLDivElement

  if (!containerDiv) {
    containerDiv = document.createElement('div')
    containerDiv.className = 'block-container tooltip'

    canvas = document.createElement('canvas')

    canvas.width = imageSize
    canvas.height = imageSize
    tooltipDiv = document.createElement('div')
    tooltipDiv.className = 'tooltiptext'

    containerDiv.appendChild(tooltipDiv)

    containerDiv.appendChild(canvas)
  } else {
    canvas = containerDiv.getElementsByTagName('canvas')[0]
    tooltipDiv = containerDiv.getElementsByClassName(
      'tooltiptext'
    )[0] as HTMLDivElement
  }

  const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = false

  ctx.clearRect(0, 0, imageSize, imageSize)

  if (typeof canvasItem === 'string') {
    drawImage(ctx, images, canvasItem, imageSize)
  } else {
    for (const layer of canvasItem.layers) {
      drawLayer(ctx, images, layer, imageSize)
    }
  }

  tooltipDiv.textContent = convertObjectToString(
    (blockState as unknown) as Record<string, string>
  )

  return containerDiv
}

const selectInventorySlot = () => {
  Array.from(inventoryPanel.getElementsByClassName('selected')).forEach(
    element => element.classList.remove('selected')
  )

  const inventoryItem = inventoryPanel.children[
    selectedInventorySlot
  ] as HTMLDivElement
  inventoryItem.classList.add('selected')
}

export const toggleInventoryVisibility = () => {
  blockSelectionWrapper.classList.toggle('hide')
}

const scrollInventorySlots = (event: WheelEvent) => {
  if (event.ctrlKey) return
  selectedInventorySlot += Math.sign(event.deltaY)
  selectedInventorySlot = Math.max(Math.min(8, selectedInventorySlot), 0)

  const inventoryItem = inventoryPanel.children[
    selectedInventorySlot
  ] as HTMLDivElement
  inventoryItem.click()
}

type CreateBlockItem = (
  blockState: BlockState,
  inventoryItem?: HTMLDivElement
) => HTMLDivElement

const initialiseCreateBlockItem = (
  images: Map<string, HTMLImageElement>,
  world: BlockContainer,
  imageSize: number
): CreateBlockItem => {
  return (blockState: BlockState, inventoryItem?: HTMLDivElement) =>
    createBlockItemRaw(images, blockState, world, imageSize, inventoryItem)
}

const setInventorySlotSave = (blockState: BlockState, slotIndex: number) => {
  const inventorySlots = storage.inventorySlots.get()
  inventorySlots[slotIndex] = blockState
  storage.inventorySlots.set(inventorySlots)
}

const addInventorySlotOnClick = (
  blockComponent: HTMLDivElement,
  blockState: BlockState,
  slotIndex: number
) => {
  blockComponent.onclick = () => {
    storage.selectedBlockState.set(blockState)

    setInventorySlotSave(blockState, slotIndex)
    selectedInventorySlot = slotIndex

    selectInventorySlot()

    const inventoryItem = inventoryPanel.children[slotIndex] as HTMLDivElement

    inventoryState.createBlockItem(blockState, inventoryItem)
  }
}

export const getInventorySlot = (slotIndex: number) => {
  const inventoryItem = inventoryPanel.children[slotIndex] as HTMLDivElement
  return inventoryItem
}

export const setInventorySlot = (block: Block) => {
  const blockState: BlockState = createCopyBlock(block)

  if (gotoExistingSlotItem(blockState)) return
  const blockElement = getInventorySlot(selectedInventorySlot)
  setInventorySlotOnClick(blockState, blockElement)
  blockElement.click()
}

const gotoExistingSlotItem = (blockState: BlockState) => {
  const currentTooltipText = convertObjectToString(
    (blockState as unknown) as Record<string, string>
  )

  const existingInventorySlotIndex = Array.from(
    inventoryPanel.children
  ).findIndex(containerDiv => {
    const tooltipDiv = containerDiv.getElementsByClassName(
      'tooltiptext'
    )[0] as HTMLDivElement

    return tooltipDiv.textContent === currentTooltipText
  }) as number

  // console.log({ block, existingInventorySlotIndex })

  if (existingInventorySlotIndex >= 0) {
    selectedInventorySlot = existingInventorySlotIndex
    storage.selectedBlockState.set(blockState)

    selectInventorySlot()
    return true
  }
  return false
}

const setInventorySlotOnClick = (
  blockState: BlockState,
  blockElement: HTMLDivElement
) => {
  blockElement.onclick = () => {
    storage.selectedBlockState.set(blockState)
    setInventorySlotSave(blockState, selectedInventorySlot)

    const inventoryItem = inventoryPanel.children[
      selectedInventorySlot
    ] as HTMLDivElement
    selectInventorySlot()

    const newInventoryItem = inventoryState.createBlockItem(
      blockState,
      inventoryItem
    )
    addInventorySlotOnClick(newInventoryItem, blockState, selectedInventorySlot)
  }
}

export const initialiseInventory = (images: Map<string, HTMLImageElement>) => {
  const emptyWorld: BlockContainer = createEmptyBlockContainer()
  const blocks = listSelectableBlocks()

  storage.inventorySlots = new LocalStorageVariable<BlockState[]>({
    defaultValue: blocks.slice(0, 9).map(createCopyBlock),
    localStorageKey: 'inventory-slots',
    saveInterval: 0
  })

  inventoryState.createBlockItem = initialiseCreateBlockItem(
    images,
    emptyWorld,
    48
  )

  blocks.forEach(block => {
    const blockState: BlockState = createCopyBlock(block)
    const blockComponent = inventoryState.createBlockItem(blockState)
    setInventorySlotOnClick(blockState, blockComponent)
    blockSelectionPanel.appendChild(blockComponent)
  })

  storage.inventorySlots
    .get()
    .forEach((blockState: BlockState, slotIndex: number) => {
      const blockComponent = inventoryState.createBlockItem(blockState)
      addInventorySlotOnClick(blockComponent, blockState, slotIndex)
      inventoryPanel.appendChild(blockComponent)
    })

  // goto saved selected item otherwise goto slot 0
  if (!gotoExistingSlotItem(storage.selectedBlockState.get())) {
    const inventoryItem = getInventorySlot(selectedInventorySlot)
    inventoryItem.classList.add('selected')
  }

  canvasElement.addEventListener('wheel', scrollInventorySlots)
  inventoryPanel.addEventListener('wheel', scrollInventorySlots)
}
