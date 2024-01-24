// TODO: put globals in a class and pass it around

import { StringDict } from '../containers/array2d'
import { createGlobalValue, GlobalValue } from '../utils/general'
import { BlockState, BlockType } from './block'

const convertObjectToString = (obj: Record<string, string>): string => {
  let output = `${obj.type}`
  const props: string[] = Object.entries(obj)
    .filter(([key, value]) => key !== 'type')
    .map(([key, value]) => {
      return `${key}=${value}`
    })

  if (props.length > 0) {
    output += ` [${props.join(' ')}]`
  }
  return output
}

export const GLOBALS: StringDict<GlobalValue<any>> = {
  build: createGlobalValue('BUILD', process.env.BUILD_TIME?.replace(',', '')),
  tick: createGlobalValue('TICK', 0),
  subtick: createGlobalValue('SUBTICK', 0),
  selectedBlock: createGlobalValue<BlockState>(
    'PICKED',
    { type: BlockType.Air },
    (blockState: BlockState) =>
      convertObjectToString((blockState as unknown) as Record<string, string>)
  )
}
