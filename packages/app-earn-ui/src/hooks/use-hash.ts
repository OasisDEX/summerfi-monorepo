'use client'
import { useEffect, useState } from 'react'

/**
 * Custom React hook to retrieve and track the current URL hash.
 *
 * This hook returns the current URL hash (without the `#` prefix) and updates automatically whenever the hash changes.
 * It listens for the `hashchange` event on the `window` object and updates the hash state accordingly.
 *
 * @template T - An optional type parameter for the expected hash value type. Defaults to `string` if no type is provided.
 *
 * @returns The current URL hash as a string or `undefined` if no hash is present. If a type `T` is provided, the return type will adapt accordingly.
 *
 * @example
 * // Using the hook without a specific type
 * const currentHash = useHash(); // returns the hash as a string (or undefined if no hash is present)
 *
 * @example
 * // Using the hook with a specific type
 * const currentHash = useHash<'myHashType'>(); // returns the hash typed as 'myHashType' (or string)
 *
 * @note This hook only works in a client-side environment as it uses the `window` object.
 */

export const useHash = <T>(): (T extends string ? T : string) | undefined => {
  const [hash, setHash] = useState<T | string>()

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash ? window.location.hash.substring(1) : '')
    }

    handleHashChange()

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return hash as (T extends string ? T : string) | undefined
}
