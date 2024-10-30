'use client'
import { useEffect, useState } from 'react'

/**
 * A custom React hook for managing query parameters in the URL.
 * It allows you to read, update, and synchronize query parameters with the URL.
 *
 * @returns An object containing:
 *  - `queryParams`: An object representing the current query parameters as key-value pairs.
 *  - `setQueryParams`: A function to update the query parameters.
 *
 * @example
 * const { queryParams, setQueryParams } = useQueryParams();
 *
 * // To access a specific query parameter
 * const value = queryParams['paramName'];
 *
 * // To update query parameters
 * setQueryParams({ param1: 'value1', param2: ['value2', 'value3'] });
 */

export const useQueryParams = () => {
  const [queryParams, setQueryParams] = useState(() => {
    if (typeof window === 'undefined') return {}

    return Object.fromEntries(new URLSearchParams(window.location.search))
  })

  const updateQueryParams = (
    params: { [key: string]: string | string[] | undefined },
    separator = ',',
  ) => {
    const url = new URL(window.location.href)
    const searchParams = new URLSearchParams(url.search)

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length === 0) {
        // Remove the key if the value is undefined
        searchParams.delete(key)
      } else if (Array.isArray(value)) {
        // Join array values with the specified separator
        searchParams.set(key, value.join(separator))
      } else if (value) {
        // Set single value directly
        searchParams.set(key, value)
      }
    })

    // Update URL without reloading
    window.history.pushState({}, '', `${url.pathname}?${searchParams.toString()}`)
    setQueryParams(Object.fromEntries(searchParams)) // Update local state
  }

  // Sync the state with URL changes
  useEffect(() => {
    const handlePopState = () => {
      setQueryParams(Object.fromEntries(new URLSearchParams(window.location.search)))
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return { queryParams, setQueryParams: updateQueryParams }
}
