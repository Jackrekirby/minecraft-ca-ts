import { Dict2D, StringDict } from '../containers/array2d'
import { Vec2 } from '../containers/vec2'
import {
  compressObject,
  decompressObject,
  LocalStorageVariable
} from '../utils/save'
import { Block, BlockContainer, BlockState, BlockType } from './block'
import {
  createEmptyBlockContainer,
  createEmptyWorld,
  loadChunks
} from './world_loading'

export const clearStorageOnVersionIncrease = () => {
  const latestVersion = 10
  const savedVersion = Number(localStorage.getItem('version'))
  const hasVersionIncreased =
    isNaN(savedVersion) || savedVersion !== latestVersion
  if (hasVersionIncreased) {
    console.log('cleared local storage', { latestVersion, savedVersion })
    localStorage.clear()
  }

  localStorage.setItem('version', JSON.stringify(latestVersion))

  return hasVersionIncreased
}

export const storage: StringDict<LocalStorageVariable<any>> = {}
export const initialiseStorage = () => {
  storage.framesPerSecondState = new LocalStorageVariable<number>({
    defaultValue: 60,
    localStorageKey: 'frames-per-second',
    saveInterval: 0
  })

  storage.updatesPerSecondState = new LocalStorageVariable<number>({
    defaultValue: 5,
    localStorageKey: 'updates-per-second',
    saveInterval: 0
  })

  storage.viewSubTicksState = new LocalStorageVariable<boolean>({
    defaultValue: false,
    localStorageKey: 'view-subticks',
    saveInterval: 0
  })

  storage.viewSignalStrengthState = new LocalStorageVariable<boolean>({
    defaultValue: true,
    localStorageKey: 'view-signal-strength',
    saveInterval: 0
  })

  storage.blockStorage = new LocalStorageVariable<BlockContainer>({
    localStorageKey: 'world',
    defaultValue: createEmptyWorld(),
    valueToStorage: (blocks: BlockContainer) => {
      const blocksForStorage: Dict2D<Block> = blocks.mapToDict2D(
        (block: Block, v: Vec2) => {
          return block
        }
      )

      // console.log('save', Object.fromEntries(blocksForStorage.items))

      return compressObject(Object.fromEntries(blocksForStorage.items))
    },
    storageToValue: (storage: string) => {
      const blocks: BlockContainer = createEmptyBlockContainer()
      const chunks = decompressObject(storage) as StringDict<Block>
      loadChunks(chunks, blocks)
      return blocks
    }
  })

  storage.selectedBlockStorage = new LocalStorageVariable<BlockContainer>({
    localStorageKey: 'selected-blocks',
    defaultValue: createEmptyWorld(),
    valueToStorage: (blocks: BlockContainer) => {
      const blocksForStorage: Dict2D<Block> = blocks.mapToDict2D(
        (block: Block, v: Vec2) => {
          return block
        }
      )

      // console.log('save', Object.fromEntries(blocksForStorage.items))

      return compressObject(Object.fromEntries(blocksForStorage.items))
    },
    storageToValue: (storage: string) => {
      const blocks: BlockContainer = createEmptyBlockContainer()
      const chunks = decompressObject(storage) as StringDict<Block>
      loadChunks(chunks, blocks)
      return blocks
    }
  })

  storage.tickState = new LocalStorageVariable<number>({
    defaultValue: 0,
    saveInterval: 0
  })

  storage.subtickState = new LocalStorageVariable<number>({
    defaultValue: 0,
    saveInterval: 0
  })

  storage.selectedBlockState = new LocalStorageVariable<BlockState>({
    defaultValue: { type: BlockType.Air },
    localStorageKey: 'selected-block',
    saveInterval: 0
  })

  storage.actualTicksPerSecondState = new LocalStorageVariable<number>({
    defaultValue: 0
  })

  storage.actualSubticksPerSecondState = new LocalStorageVariable<number>({
    defaultValue: 0
  })

  storage.actualFramesPerSecondState = new LocalStorageVariable<number>({
    defaultValue: 0
  })

  storage.actualUpdatesPerSecondState = new LocalStorageVariable<number>({
    defaultValue: 0
  })
}
