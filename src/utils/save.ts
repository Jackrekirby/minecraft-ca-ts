import { deflate, inflate } from 'pako'

export function getLocalStorageKeys (): string[] {
  // Get the number of items in local storage
  const numberOfItems: number = localStorage.length

  // Create an array to store the keys
  const keys: string[] = []

  // Loop through local storage and store the keys
  for (let i: number = 0; i < numberOfItems; i++) {
    const key: string | null = localStorage.key(i)

    if (key !== null) {
      keys.push(key)
    }
  }

  // The 'keys' array now contains all the keys in local storage
  return keys
}

// https://developer.mozilla.org/en-US/docs/Glossary/Base64

export function base64ToBytes (base64: string): Uint8Array {
  const binString: string = atob(base64)
  return Uint8Array.from(binString, m => m.codePointAt(0)!)
}

export function bytesToBase64 (bytes: Uint8Array): string {
  const binString: string = String.fromCodePoint(...bytes)
  return btoa(binString)
}

export function compressObject<T> (obj: T): string {
  const jsonString: string = JSON.stringify(obj)
  const bytes = new TextEncoder().encode(jsonString)
  const compressedBytes = deflate(bytes)
  const base64 = bytesToBase64(compressedBytes)
  return base64
}

export function decompressObject<T> (base64: string): T {
  const compressedBytes: Uint8Array = base64ToBytes(base64)
  const bytes = inflate(compressedBytes)
  const jsonString = new TextDecoder().decode(bytes)
  const obj = JSON.parse(jsonString)
  return obj
}

// localStorageKey: string,
// defaultValue: T,
// saveInterval: number = 5000,
// validator: (value: T) => boolean = () => true,
// valueToStorage: (value: T) => string = JSON.stringify,
// storageToValue: (storage: string) => T = JSON.parse,
// setCallback: (value: T) => void = () => {}

export class LocalStorageVariable<T> {
  private value: T
  private localStorageKey?: string
  private saveInterval: number
  private intervalId: NodeJS.Timeout | undefined
  public setCallback: (value: T) => void
  private valueToStorage: (value: T) => string
  public saveCallback: (value: T, storedValue: string) => void

  constructor ({
    defaultValue,
    localStorageKey,
    saveInterval = 5000,
    validator = value => value !== undefined,
    valueToStorage = JSON.stringify,
    storageToValue = JSON.parse,
    setCallback = () => {},
    saveCallback = () => {}
  }: {
    defaultValue: T
    localStorageKey?: string
    saveInterval?: number
    validator?: (value: T) => boolean
    valueToStorage?: (value: T) => string
    storageToValue?: (storage: string) => T
    setCallback?: (value: T) => void
    saveCallback?: (value: T, storedValue: string) => void
  }) {
    this.setCallback = setCallback
    this.value = defaultValue
    this.saveInterval = saveInterval
    this.valueToStorage = valueToStorage
    this.saveCallback = saveCallback
    this.localStorageKey = localStorageKey

    let usedLocalStorage = false
    try {
      const rawStorageValue: string | null = localStorageKey
        ? localStorage.getItem(localStorageKey)
        : null
      if (rawStorageValue !== null) {
        const storageValue: T = storageToValue(rawStorageValue)
        if (validator(storageValue)) {
          this.set(storageValue)
          usedLocalStorage = true
        } else {
          console.warn(
            `Value in storage '${localStorageKey}' failed validation. Reverting to default value.`
          )
        }
      }
    } catch (error) {
      console.warn(
        `Value in storage '${localStorageKey}' could not be parsed. Reverting to default value.`
      )
    }

    if (!usedLocalStorage) {
      this.set(defaultValue)
    }

    if (localStorageKey && saveInterval > 0) {
      this.intervalId = setInterval(() => {
        this.save()
      }, saveInterval)
    }
  }

  public save () {
    const storedValue: string = this.valueToStorage(this.value)
    if (this.localStorageKey) {
      localStorage.setItem(this.localStorageKey, storedValue)
    }
    this.saveCallback(this.value, storedValue)
  }

  public destructor () {
    clearInterval(this.intervalId)
  }

  public get () {
    return this.value
  }

  public set (value: T) {
    this.value = value
    if (this.saveInterval === 0) {
      this.save()
    }
    this.setCallback(value)
  }
}
