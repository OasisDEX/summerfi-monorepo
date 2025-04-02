'use client'
import { useEffect, useState } from 'react'

/**
 * A React hook that returns the current URL, updating automatically on route changes.
 *
 * @returns The current URL as a string or `/` if not yet set (e.g., during server-side rendering).
 *
 * @example
 * const currentUrl = useCurrentUrl();
 * console.log(currentUrl); // Logs the current full URL.
 */
export const useCurrentUrl = (): string => {
  const [currentUrl, setCurrentUrl] = useState<string>('/')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [])

  return currentUrl
}
