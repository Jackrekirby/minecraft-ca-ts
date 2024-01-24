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

export const createState = <T>(
  defaultValue: T,
  localStorageKey: string,
  setCallback: (value: T) => void = () => {}
): StateHandler<T> => {
  // Try to get the initial value from local storage, otherwise use the default value
  const initialValue =
    localStorage.getItem(localStorageKey) !== null
      ? JSON.parse(localStorage.getItem(localStorageKey)!)
      : defaultValue

  setCallback(initialValue)

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
      setCallback(value)
    }
  }
}

export const isEnum = <T>(value: T, enums: string[]): value is T => {
  return enums.includes(String(value))
}

export const areObjectsEqual = (
  obj1: Record<string, any>,
  obj2: Record<string, any>
): boolean => {
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    const value1 = obj1[key]
    const value2 = obj2[key]

    if (
      typeof value1 === 'object' &&
      value1 !== null &&
      typeof value2 === 'object' && value2 !== null
    ) {
      if (!areObjectsEqual(value1, value2)) {
        return false
      }
    }

    // Ignore nested objects and functions
    if (
      (typeof value1 === 'object' && value1 !== null) ||
      typeof value1 === 'function'
    ) {
      continue
    }

    if (value1 !== value2) {
      return false
    }
  }

  return true
}

type ClickCallback = (event: MouseEvent) => void

export const addClickHandlerWithDragCheck = (
  element: HTMLElement,
  clickCallback: ClickCallback,
  allowedMovementRadiusInPixels: number
): void => {
  let isDragging = false
  let startCoordinates: { x: number; y: number } | null = null

  const calculateDistance = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number => {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
  }

  const mouseDownHandler = (event: MouseEvent) => {
    if (event.button !== 0) return // handle left click only
    isDragging = false
    startCoordinates = { x: event.clientX, y: event.clientY }

    const mouseMoveHandler = (moveEvent: MouseEvent) => {
      if (event.button !== 0) return // handle left click only
      if (
        startCoordinates &&
        calculateDistance(
          moveEvent.clientX,
          moveEvent.clientY,
          startCoordinates.x,
          startCoordinates.y
        ) > allowedMovementRadiusInPixels
      ) {
        isDragging = true
      }
    }

    const mouseUpHandler = (event: MouseEvent) => {
      if (event.button !== 0) return // handle left click only
      document.removeEventListener('mousemove', mouseMoveHandler)
      document.removeEventListener('mouseup', mouseUpHandler)

      if (!isDragging) {
        // Invoke the callback for a regular click
        clickCallback(event)
      }
    }

    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
  }

  element.addEventListener('mousedown', mouseDownHandler)
}

export interface GlobalValue<T> {
  set: (value: T) => void
  get: () => T
  display: () => string
}

export const createGlobalValue = <T>(
  name: string,
  initialValue: T,
  formatter: (value: T) => string = (value: T) => String(value)
) => {
  let currentValue: T =
    localStorage.getItem(name) !== null
      ? JSON.parse(localStorage.getItem(name)!)
      : initialValue
  const set = (value: T) => {
    currentValue = value
    localStorage.setItem(name, JSON.stringify(value))
  }
  const get = () => {
    return currentValue
  }
  const display = () => `${name}: ${formatter(get())}`

  const state: GlobalValue<T> = { get, set, display }
  return state
}

export const debounce = (callback: () => void, delay: number): (() => void) => {
  let timeoutId: NodeJS.Timeout
  let isPending = false

  return function () {
    if (isPending) {
      return
    }

    clearTimeout(timeoutId)

    isPending = true

    timeoutId = setTimeout(() => {
      callback()
      isPending = false
    }, delay)
  }
}

export const sleep = (seconds: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000)
  })
}
