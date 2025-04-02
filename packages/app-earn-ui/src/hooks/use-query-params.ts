'use client'
import { useEffect, useState } from 'react'

const parseSearchParams = (searchParams: URLSearchParams) =>
  Object.fromEntries(
    Object.entries(Object.fromEntries(searchParams)).map(([key, value]) => [key, value.split(',')]),
  )

/**
 * A custom React hook for managing query parameters in the URL.
 * It allows you to read, update, and synchronize query parameters with the URL.
 *
 * @param initialQueryParams - An optional object representing the initial query parameters.
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

export const useQueryParams = (initialQueryParams?: {
  [key: string]: string[] | undefined
}): {
  queryParams: {
    [key: string]: string[] | undefined
  }
  setQueryParams: (
    params: { [key: string]: string | string[] | undefined },
    separator?: string,
  ) => void
} => {
  const [queryParams, setQueryParams] = useState<{ [key: string]: string[] | undefined }>(() => {
    if (typeof window === 'undefined') return initialQueryParams ?? {}

    return initialQueryParams ?? parseSearchParams(new URLSearchParams(window.location.search))
  })

  const updateQueryParams = (
    params: { [key: string]: string | string[] | undefined },
    separator = ',',
  ): void => {
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
    setQueryParams(parseSearchParams(searchParams)) // Update local state
  }

  // Sync the state with URL changes
  useEffect(() => {
    const handlePopState = () => {
      setQueryParams(parseSearchParams(new URLSearchParams(window.location.search)))
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return { queryParams, setQueryParams: updateQueryParams }
}
