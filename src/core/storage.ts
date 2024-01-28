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
  const latestVersion = 6
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

export const framesPerSecondState = new LocalStorageVariable<number>({
  defaultValue: 60,
  localStorageKey: 'frames-per-second',
  saveInterval: 0
})

export const updatesPerSecondState = new LocalStorageVariable<number>({
  defaultValue: 5,
  localStorageKey: 'updates-per-second',
  saveInterval: 0
})

export const viewSubTicksState = new LocalStorageVariable<boolean>({
  defaultValue: false,
  localStorageKey: 'view-subticks',
  saveInterval: 0
})

export const blockStorage = new LocalStorageVariable<BlockContainer>({
  localStorageKey: 'world',
  defaultValue: createEmptyWorld(),
  valueToStorage: (blocks: BlockContainer) => {
    const blocksForStorage: Dict2D<Block> = blocks.mapToDict2D(
      (block: Block, v: Vec2) => {
        return block
      }
    )

    // console.log('save', blocksForStorage.items)

    return compressObject(blocksForStorage.items)
  },
  storageToValue: (storage: string) => {
    const blocks: BlockContainer = createEmptyBlockContainer()
    const chunks = decompressObject(storage) as StringDict<Block>
    loadChunks(chunks, blocks)
    return blocks
  }
})

export const tickState = new LocalStorageVariable<number>({
  defaultValue: 0,
  saveInterval: 0
})

export const subtickState = new LocalStorageVariable<number>({
  defaultValue: 0,
  saveInterval: 0
})

export const selectedBlockState = new LocalStorageVariable<BlockState>({
  defaultValue: { type: BlockType.Air },
  localStorageKey: 'selected-block',
  saveInterval: 0
})

export const actualTicksPerSecondState = new LocalStorageVariable<number>({
  defaultValue: 0
})

export const actualSubticksPerSecondState = new LocalStorageVariable<number>({
  defaultValue: 0
})

export const actualFramesPerSecondState = new LocalStorageVariable<number>({
  defaultValue: 0
})

// build: createGlobalValue('BUILD', process.env.BUILD_TIME?.replace(',', '')),
// tick: createGlobalValue('TICK', 0),
// subtick: createGlobalValue('SUBTICK', 0),
// selectedBlock: createStoredGlobalValue<BlockState>(
//   'PICKED',
//   { type: BlockType.Air },
//   (blockState: BlockState) =>
//     convertObjectToString((blockState as unknown) as Record<string, string>)
// )

export const downloadFile = (value: string, fileName: string): void => {
  const blob = new Blob([value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)

  a.click()

  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
