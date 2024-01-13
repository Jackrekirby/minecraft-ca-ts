// TODO: put globals in a class and pass it around

import { StringDict } from '../containers/array2d'
import { createGlobalValue, GlobalValue } from '../utils/general'
import { BlockType } from './block'

export const GLOBALS: StringDict<GlobalValue<any>> = {
  build: createGlobalValue('BUILD', process.env.BUILD_TIME?.replace(',', '')),
  tick: createGlobalValue('TICK', 0),
  subtick: createGlobalValue('SUBTICK', 0),
  selectedBlock: createGlobalValue('PICKED', BlockType.Air)
}
