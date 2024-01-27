import { Dict2D } from '../containers/array2d'
import { Vec2 } from '../containers/vec2'
import { isEnum } from '../utils/general'
import { compressObject } from '../utils/save'
import { Block, BlockContainer, BlockState, BlockType } from './block'
import {
  commandFailure,
  commandInfo,
  commandLineVisibilityState,
  CommandManager,
  commandSuccess
} from './command_line'
import { debugPanelState } from './debug_panel'
import { convertObjectToString, convertStringToObject } from './globals'
import {
  downloadFile,
  selectedBlockState,
  updatesPerSecondState,
  viewSubTicksState
} from './storage'
import { createDemoWorld, createEmptyWorld } from './world_loading'

export const initialiseCommands = (
  commandManager: CommandManager,
  blocks: BlockContainer
) => {
  commandManager.createCommand('/world load {name:string}', async input => {
    blocks.clone(await createDemoWorld())
    // blocks.chunks = (await loadChunksFromStorage(false, true)).chunks
    // updateCanvas()
    return commandSuccess(`loaded world ${input.name}`)
  })
  commandManager.createCommand('/world clear', async () => {
    // blocks.chunks = (await loadChunksFromStorage(false, false)).chunks
    blocks.clone(await createEmptyWorld())
    // updateCanvas()
    return commandSuccess(`cleared world`)
  })

  commandManager.createCommand('/world download', async input => {
    const blocksForStorage: Dict2D<Block> = blocks.mapToDict2D(
      (block: Block, v: Vec2) => {
        return block
      }
    )

    const stringValue = JSON.stringify(blocksForStorage.items, null, 2)
    downloadFile(stringValue, 'world.json')
    return commandSuccess(`downloaded world`)
  })

  commandManager.createCommand('/world download compressed', async input => {
    const blocksForStorage: Dict2D<Block> = blocks.mapToDict2D(
      (block: Block, v: Vec2) => {
        return block
      }
    )

    const stringValue = compressObject(blocksForStorage.items)
    downloadFile(stringValue, 'world.txt')
    return commandSuccess(`downloaded world`)
  })

  // commandManager.createCommand('/tick step', async () => {

  //   return commandSuccess(
  //     `stepped tick to ${GLOBALS.tick.get()}.${GLOBALS.subtick.get()}`
  //   )
  // })
  commandManager.createCommand('/toggle view_subticks', async () => {
    viewSubTicksState.set(!viewSubTicksState.get())
    return commandSuccess(`toggled view subticks to ${viewSubTicksState.get()}`)
  })

  commandManager.createCommand(
    '/set updates_per_second {ups:float}',
    async input => {
      const ups = Number(input.ups)
      if (!isNaN(ups)) {
        updatesPerSecondState.set(ups)
        return commandSuccess(`set updates per second ${ups}`)
      } else {
        return commandFailure(`updates per second was not a number`)
      }
    }
  )

  commandManager.createCommand('/toggle debug_window', async input => {
    if (debugPanelState.get()) {
      debugPanelState.set(false)
      return commandSuccess('debug window hidden')
    } else {
      debugPanelState.set(true)
      return commandSuccess('debug window revealed')
    }
  })

  commandManager.createCommand(
    '/toggle command_line_visibility',
    async input => {
      if (commandLineVisibilityState.get()) {
        commandLineVisibilityState.set(false)
        return commandSuccess('command line hidden')
      } else {
        commandLineVisibilityState.set(true)
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
      selectedBlockState.set(block)
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
        selectedBlockState.set(block)
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
