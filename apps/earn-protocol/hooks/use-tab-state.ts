'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * Extracts the values from an enum-like object or returns the array as-is.
 */
function extractTabValues<T extends string>(
  tabs: readonly T[] | { [key: string]: T },
): readonly T[] {
  return Array.isArray(tabs) ? tabs : Object.values(tabs)
}

/**
 * A generic hook to manage tab state using query parameters.
 * @param tabs - Enum-like object or array of tab values.
 * @param defaultTab - Default tab if none is present in the URL.
 * @param queryParam - optional query param name that will be visible in the URL.
 * @returns A tuple of activeTab and a function to update it.
 */
export function useTabStateQuery<T extends string>({
  tabs,
  defaultTab,
  queryParam = 'tab',
}: {
  tabs:
    | readonly T[]
    | {
        [key: string]: T
      }
  defaultTab?: T
  queryParam?: string
}): [T, (tab: T) => void] {
  const tabValues = extractTabValues(tabs)
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<T>(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (searchParams.get(queryParam) as T) ?? defaultTab ?? tabValues[0],
  )

  useEffect(() => {
    const paramTab = searchParams.get(queryParam)

    if (paramTab && tabValues.includes(paramTab as T)) {
      setActiveTab(paramTab as T)
    } else if (defaultTab) {
      setActiveTab(defaultTab)
    } else {
      setActiveTab(tabValues[0])
    }
  }, [searchParams, tabValues, defaultTab, queryParam])

  const updateTab = (tab: T) => {
    const query = new URLSearchParams(searchParams)

    query.set(queryParam, tab)
    window.history.pushState(null, '', `?${query.toString()}`)
  }

  return [activeTab, updateTab]
}
