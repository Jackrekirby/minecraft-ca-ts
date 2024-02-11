import { StringDict } from '../containers/array2d'
import { Vec2, vec2Apply } from '../containers/vec2'
import { Canvas } from '../rendering/canvas'
import { getAllBlockVariants, getBlockFromAlias } from '../utils/block_variants'
import { decompressObject, LocalStorageVariable } from '../utils/save'
import { Block, BlockContainer, getBlockName } from './block'
import {
  commandFailure,
  commandInfo,
  CommandManager,
  commandSuccess
} from './command_line'

import { updateCanvasBlocks } from './game_loop'
import { setInventorySlot } from './inventory'
import { storage } from './storage'
import {
  createDemoWorld,
  createEmptyBlockContainer,
  createEmptyWorld,
  downloadWorld,
  loadChunks
} from './world_loading'

export const clearFallingBlocksRequested = new LocalStorageVariable<boolean>({
  defaultValue: false
})

export const initialiseCommands = (
  commandManager: CommandManager,
  blocks: BlockContainer,
  canvas: Canvas,
  fillUpdateQueue: () => void,
  addToTickQueue: (v: Vec2) => void
) => {
  const processPosition = (xs: string, ys: string): Vec2 | null => {
    const v = vec2Apply(canvas.getMouseWorldPosition(), Math.floor)

    let x: number
    if (xs.startsWith('~')) {
      x = v.x + Number(xs.length === 1 ? '0' : xs.substring(1))
    } else {
      x = Number(xs)
    }

    let y: number
    if (ys.startsWith('~')) {
      y = v.y + Number(ys.length === 1 ? '0' : ys.substring(1))
    } else {
      y = Number(ys)
    }

    if (isNaN(x) || isNaN(y)) {
      return null
    } else {
      return { x, y }
    }
  }

  commandManager.createCommand(
    '/world load by_name {name:string}',
    async input => {
      blocks.clone(await createDemoWorld())
      // blocks.chunks = (await loadChunksFromStorage(false, true)).chunks
      // updateCanvas()
      updateCanvasBlocks(blocks, canvas)
      fillUpdateQueue()
      return commandSuccess(`loaded world ${input.name}`)
    }
  )

  commandManager.createCommand(
    '/world load from_compressed {data:string}',
    async input => {
      const newBlocks: BlockContainer = createEmptyBlockContainer()
      const chunks = decompressObject(input.data) as StringDict<Block>
      loadChunks(chunks, newBlocks)
      blocks.clone(newBlocks)
      console.log(newBlocks, blocks, chunks, input.data)
      return commandSuccess(`loaded world from compressed data`)
    }
  )

  commandManager.createCommand(
    '/world load selected_from_compressed {data:string}',
    async input => {
      const newBlocks: BlockContainer = createEmptyBlockContainer()
      const chunks = decompressObject(input.data) as StringDict<Block>
      loadChunks(chunks, newBlocks)
      storage.selectedBlockStorage.set(newBlocks)
      return commandSuccess(`loaded compressed block data into selection`)
    }
  )

  commandManager.createCommand('/world clear', async () => {
    // blocks.chunks = (await loadChunksFromStorage(false, false)).chunks
    blocks.clone(createEmptyWorld())
    // placeAllBlocks(blocks)
    // updateCanvas()
    updateCanvasBlocks(blocks, canvas)
    fillUpdateQueue()
    return commandSuccess(`cleared world`)
  })

  commandManager.createCommand('/clear falling_blocks', async () => {
    clearFallingBlocksRequested.set(true)
    return commandSuccess(`cleared falling blocks`)
  })

  commandManager.createCommand('/teleport {x:float} {y:float}', async input => {
    const v: Vec2 | null = processPosition(input.x, input.y)
    if (!v) {
      return commandFailure(`failed to teleport. x or y is not a valid number`)
    }
    canvas.moveTo(v)
    return commandSuccess(`teleported to {x: ${v.x}, y: ${v.y}}`)
  })

  commandManager.createCommand(
    '/set scale {pixels_per_block:float}',
    async input => {
      const x = Number(input.pixels_per_block)
      if (isNaN(x)) {
        return commandFailure(
          `failed to scale. pixels_per_block is not a valid number`
        )
      }
      canvas.setScale(x)
      return commandSuccess(`set world scale to ${x} pixels per block`)
    }
  )

  commandManager.createCommand('/world download', async input => {
    downloadWorld(blocks, false)
    return commandSuccess(`downloaded world`)
  })

  commandManager.createCommand('/world download compressed', async input => {
    downloadWorld(blocks, true)

    return commandSuccess(`downloaded compressed world`)
  })

  commandManager.createCommand('/world download selected', async input => {
    downloadWorld(storage.selectedBlockStorage.get(), false)
    return commandSuccess(`downloaded selected world`)
  })

  commandManager.createCommand(
    '/world download selected compressed',
    async input => {
      downloadWorld(storage.selectedBlockStorage.get(), true)

      return commandSuccess(`downloaded compressed selected world`)
    }
  )

  commandManager.createCommand('/toggle view_subticks', async () => {
    storage.viewSubTicksState.set(!storage.viewSubTicksState.get())
    return commandSuccess(
      `toggled view subticks to ${storage.viewSubTicksState.get()}`
    )
  })

  commandManager.createCommand('/toggle view_signal_strength', async () => {
    storage.viewSignalStrengthState.set(!storage.viewSignalStrengthState.get())
    return commandSuccess(
      `toggled view signal strength to ${storage.viewSignalStrengthState.get()}`
    )
  })

  commandManager.createCommand(
    '/set updates_per_second {ups:float}',
    async input => {
      const ups = Number(input.ups)
      if (!isNaN(ups)) {
        storage.updatesPerSecondState.set(ups)
        return commandSuccess(`set updates per second ${ups}`)
      } else {
        return commandFailure(`updates per second was not a number`)
      }
    }
  )

  commandManager.createCommand(
    '/set frames_per_second {fps:float}',
    async input => {
      const ups = Number(input.fps)
      if (!isNaN(ups)) {
        storage.framesPerSecondState.set(ups)
        return commandSuccess(`set frames per second ${ups}`)
      } else {
        return commandFailure(`frames per second was not a number`)
      }
    }
  )

  commandManager.createCommand('/toggle debug_window', async input => {
    if (storage.debugPanelState.get()) {
      storage.debugPanelState.set(false)
      return commandSuccess('debug window hidden')
    } else {
      storage.debugPanelState.set(true)
      return commandSuccess('debug window revealed')
    }
  })

  commandManager.createCommand(
    '/toggle command_line_visibility',
    async input => {
      if (storage.commandLineVisibilityState.get()) {
        storage.commandLineVisibilityState.set(false)
        return commandSuccess('command line hidden')
      } else {
        storage.commandLineVisibilityState.set(true)
        return commandSuccess('command line revealed')
      }
    }
  )

  commandManager.createCommand(
    '/toggle output_command_success',
    async input => {
      if (commandManager.outputSuccessMessages.get()) {
        commandManager.outputSuccessMessages.set(false)
        return commandSuccess('command success messages hidden')
      } else {
        commandManager.outputSuccessMessages.set(true)
        return commandSuccess('command success messages revealed')
      }
    }
  )

  commandManager.createCommand('/clear command_output', async input => {
    commandManager.outputs.set([])
    return commandSuccess('cleared command output history')
  })

  commandManager.createCommand('/block list', async _ => {
    const blockList = getAllBlockVariants()
      .map(getBlockName)
      .join(', ')
    // (Object.values(BlockType) as String[]).join(', ')
    return commandInfo(`blocks: ${blockList}`)
  })

  commandManager.createCommand('/block pick {name:string}', async input => {
    // const block = (convertStringToObject(input.type) as unknown) as BlockState
    const block = getBlockFromAlias(input.name)
    if (block) {
      // storage.selectedBlockState.set(block)
      setInventorySlot(block)
      return commandSuccess(`picked block ${input.name}`)
    } else {
      return commandFailure(`cannot pick invalid block ${input.name}`)
    }
  })

  commandManager.createCommand(
    '/block set {x:float} {y:float} {name:string}',
    async input => {
      const block = getBlockFromAlias(input.name)
      const v: Vec2 | null = processPosition(input.x, input.y)
      if (!v) {
        return commandFailure(
          `failed to set block. x or y is not a valid number`
        )
      }

      if (block) {
        blocks.setValue(v, block)
        addToTickQueue(v)
        return commandSuccess(`set block ${input.name} {x: ${v.x}, y: ${v.y}}`)
      } else {
        return commandFailure(`cannot set invalid block ${input.name}`)
      }
    }
  )

  commandManager.createCommand(
    '/block set {x1:float} {y1:float} {x2:float} {y2:float} {name:string}',
    async input => {
      const v1: Vec2 | null = processPosition(input.x1, input.y1)
      const v2: Vec2 | null = processPosition(input.x2, input.y2)
      if (!v1 || !v2) {
        return commandFailure(
          `failed to set block. position is not a valid number`
        )
      }

      const block = getBlockFromAlias(input.name)
      if (block) {
        for (let y = v1.y; y <= v2.y; ++y) {
          for (let x = v1.x; x <= v2.x; ++x) {
            const v = { x, y }
            blocks.setValue(v, block)
            addToTickQueue(v)
          }
        }
        return commandSuccess(
          `fill blocks ${input.name} {x1: ${v1.x}, y1: ${v1.y}, x2: ${v2.x}, y2: ${v2.y}}`
        )
      } else {
        return commandFailure(`cannot set invalid block ${input.name}`)
      }
    }
  )
}
