import { Dict2D } from '../containers/array2d'
import { Vec2 } from '../containers/vec2'
import { Canvas } from '../rendering/canvas'
import { downloadFile, isEnum } from '../utils/general'
import { compressObject, LocalStorageVariable } from '../utils/save'
import { Block, BlockContainer, BlockState, BlockType } from './block'
import {
  commandFailure,
  commandInfo,
  CommandManager,
  commandSuccess
} from './command_line'

import { updateCanvasBlocks } from './game_loop'
import { convertObjectToString, convertStringToObject } from './globals'
import { storage } from './storage'
import {
  createDemoWorld,
  createEmptyWorld,
  placeAllBlocks
} from './world_loading'

export const clearFallingBlocksRequested = new LocalStorageVariable<boolean>({
  defaultValue: false
})

export const initialiseCommands = (
  commandManager: CommandManager,
  blocks: BlockContainer,
  canvas: Canvas,
  fillUpdateQueue: () => void
) => {
  commandManager.createCommand('/world load {name:string}', async input => {
    blocks.clone(await createDemoWorld())
    // blocks.chunks = (await loadChunksFromStorage(false, true)).chunks
    // updateCanvas()
    updateCanvasBlocks(blocks, canvas)
    fillUpdateQueue()
    return commandSuccess(`loaded world ${input.name}`)
  })
  commandManager.createCommand('/world clear', async () => {
    // blocks.chunks = (await loadChunksFromStorage(false, false)).chunks
    blocks.clone(await createEmptyWorld())
    placeAllBlocks(blocks)
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
    const x = Number(input.x),
      y = Number(input.y)
    if (isNaN(x) || isNaN(y)) {
      return commandFailure(`failed to teleport. x or y is not a valid number`)
    }
    canvas.moveTo({ x, y })
    return commandSuccess(`teleported to {x: ${x}, y: ${y}}`)
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
    const blocksForStorage: Dict2D<Block> = blocks.mapToDict2D(
      (block: Block, v: Vec2) => {
        return block
      }
    )

    const stringValue = JSON.stringify(
      Object.fromEntries(blocksForStorage.items),
      null,
      2
    )
    downloadFile(stringValue, 'world.json')
    return commandSuccess(`downloaded world`)
  })

  commandManager.createCommand('/world download compressed', async input => {
    const blocksForStorage: Dict2D<Block> = blocks.mapToDict2D(
      (block: Block, v: Vec2) => {
        return block
      }
    )

    const stringValue = compressObject(
      Object.fromEntries(blocksForStorage.items)
    )
    downloadFile(stringValue, 'world.txt')
    return commandSuccess(`downloaded world`)
  })

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
    const blockList = (Object.values(BlockType) as String[]).join(', ')
    return commandInfo(`blocks: ${blockList}`)
  })

  commandManager.createCommand('/block pick {type:string}', async input => {
    const block = (convertStringToObject(input.type) as unknown) as BlockState
    if (isEnum<BlockType>(block.type as BlockType, Object.values(BlockType))) {
      storage.selectedBlockState.set(block)
      return commandSuccess(
        `picked block ${convertObjectToString(
          (block as unknown) as Record<string, string>
        )}`
      )
    } else {
      return commandFailure(
        `cannot pick invalid block ${convertObjectToString(
          (block as unknown) as Record<string, string>
        )}`
      )
    }
  })

  commandManager.createCommand(
    '/block pick {type:string} {meta:string}',
    async input => {
      const block = (convertStringToObject(
        `${input.type} ${input.meta}`
      ) as unknown) as BlockState
      console.log(block)
      if (
        isEnum<BlockType>(block.type as BlockType, Object.values(BlockType))
      ) {
        storage.selectedBlockState.set(block)
        return commandSuccess(
          `picked block ${convertObjectToString(
            (block as unknown) as Record<string, string>
          )}`
        )
      } else {
        return commandFailure(
          `cannot pick invalid block ${convertObjectToString(
            (block as unknown) as Record<string, string>
          )}`
        )
      }
    }
  )
}
