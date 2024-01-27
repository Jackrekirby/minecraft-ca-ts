// TODO: put globals in a class and pass it around

export const convertStringToObject = (
  input: string
): Record<string, string> => {
  const parts = input.replace(/\[|\]/g, '').split(/\s+/)
  console.log({ parts })

  const type = parts[0]
  const obj: Record<string, string> = { type }

  if (parts.length > 1) {
    const props = parts.slice(1)
    props.forEach(prop => {
      const [key, value] = prop.split('=')
      obj[key] = value
    })
  }

  return obj
}

export const convertObjectToString = (obj: Record<string, string>): string => {
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

// export const GLOBALS: StringDict<GlobalValue<any>> = {
//   build: createGlobalValue('BUILD', process.env.BUILD_TIME?.replace(',', '')),
//   tick: createGlobalValue('TICK', 0),
//   subtick: createGlobalValue('SUBTICK', 0),
//   selectedBlock: createStoredGlobalValue<BlockState>(
//     'PICKED',
//     { type: BlockType.Air },
//     (blockState: BlockState) =>
//       convertObjectToString((blockState as unknown) as Record<string, string>)
//   )
// }

// export const setGlobal = (name: string, value: any) => {
//   GLOBALS[name].set(value)
//   debouncedUpdateDebugInfo()
// }
