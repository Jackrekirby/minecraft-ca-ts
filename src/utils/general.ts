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

export type StateHandler<T> = {
  get: () => T
  set: (value: T) => void
}

export function createState<T> (
  defaultValue: T,
  localStorageKey: string
): StateHandler<T> {
  // Try to get the initial value from local storage, otherwise use the default value
  const initialValue =
    localStorage.getItem(localStorageKey) !== null
      ? JSON.parse(localStorage.getItem(localStorageKey)!)
      : defaultValue

  // Internal state variable
  let state: T = initialValue

  // Return the object with get and set functions
  return {
    get: () => state,
    set: (value: T) => {
      // Update the internal state
      state = value
      // Set the value in local storage
      localStorage.setItem(localStorageKey, JSON.stringify(value))
    }
  }
}
