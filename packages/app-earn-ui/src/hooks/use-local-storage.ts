'use client'
import { type Dispatch, type SetStateAction, useCallback, useEffect, useState } from 'react'
import { useEventCallback, useEventListener } from 'usehooks-ts'

type SetValue<T> = Dispatch<SetStateAction<T>>
type isValidFunction<T> = (element?: T) => element is T

/**
 * Parses a JSON string from localStorage.
 *
 * @param value - The JSON string to parse.
 * @param key - The key associated with the JSON string, used for error logging.
 * @returns The parsed value, or undefined if parsing fails.
 */
const parseJSON = <T>(value: string | null, key: string): T | undefined => {
  try {
    return typeof value === 'undefined' || value === null ? undefined : JSON.parse(value)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('parsing error on', { value, key, error })

    return undefined
  }
}

/**
 * Retrieves a value from localStorage and parses it into a usable format.
 *
 * @param key - The localStorage key to retrieve the value from.
 * @param defaultValue - The default value to return if the key does not exist or parsing fails.
 * @param isValid - An optional validation function to check the validity of the parsed value.
 * @returns The stored value if valid, otherwise the default value.
 */
export const getStorageValue = <V>(
  key: string,
  defaultValue: unknown,
  isValid?: isValidFunction<V>,
): V => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key)
    const parsed = parseJSON<V>(saved, key)

    if (isValid) {
      return isValid(parsed) ? parsed : (defaultValue as V)
    } else {
      return parsed ?? (defaultValue as V)
    }
  }

  return defaultValue as V
}

/**
 * Custom hook to manage state synchronized with localStorage.
 *
 * @param key - The localStorage key to store the value under.
 * @param initialValue - The initial value to use if the key does not exist in localStorage.
 * @param isValid - An optional validation function to ensure the stored value is valid.
 * @returns A tuple with the current value and a setter function to update it.
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  isValid?: isValidFunction<T>,
): [T, SetValue<T | null>] => {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      const parsedItem = item ? parseJSON<T>(item, key) : initialValue

      if (isValid) {
        return isValid(parsedItem) ? parsedItem : initialValue
      } else {
        return parsedItem ?? initialValue
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Error reading localStorage key “${key}”:`, error)

      return initialValue
    }
  }, [initialValue, isValid, key])

  const [storedValue, setStoredValue] = useState<T>(readValue)

  const setValue: SetValue<T | null> = useEventCallback((value: unknown) => {
    if (typeof window === 'undefined') {
      // eslint-disable-next-line no-console
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`,
      )
    }

    try {
      const newValue = value instanceof Function ? value(storedValue) : value

      window.localStorage.setItem(key, JSON.stringify(newValue))
      if (newValue) {
        setStoredValue(newValue)
      }
      window.dispatchEvent(new Event('local-storage'))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Error setting localStorage key “${key}”:`, error)
    }
  })

  useEffect(() => {
    setStoredValue(readValue())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleStorageChange = useCallback(
    (ev: StorageEvent | CustomEvent) => {
      if ((ev as StorageEvent).key && (ev as StorageEvent).key !== key) {
        return
      }
      setStoredValue(readValue())
    },
    [key, readValue],
  )

  useEventListener('storage', handleStorageChange)
  useEventListener('local-storage', handleStorageChange)

  return [storedValue, setValue]
}
