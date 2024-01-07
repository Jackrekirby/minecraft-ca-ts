export const zipArrays = <T, U>(arr1: T[], arr2: U[]): [T, U][] => {
  const zippedArray: [T, U][] = []
  const minLength = Math.min(arr1.length, arr2.length)

  for (let i = 0; i < minLength; i++) {
    zippedArray.push([arr1[i], arr2[i]])
  }

  return zippedArray
}

export const getMissingKeys = (a: object, b: object) => {
  const missingKeys = []

  for (const key in b) {
    if (b.hasOwnProperty(key) && !a.hasOwnProperty(key)) {
      missingKeys.push(key)
    }
  }

  return missingKeys
}
