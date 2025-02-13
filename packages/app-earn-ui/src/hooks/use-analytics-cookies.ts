'use client'
import { getCookie, setCookie } from '@summerfi/app-utils'

import {
  analyticsCookieName,
  type SavedAnalyticsCookiesSettings,
} from '@/components/molecules/CookieBanner/config'

/**
 * Hook to manage analytics cookies consent
 * @returns Object containing analytics cookies state and methods
 */
export const useAnalyticsCookies = (
  savedFromServer: SavedAnalyticsCookiesSettings | null,
): [SavedAnalyticsCookiesSettings | null, (value: SavedAnalyticsCookiesSettings) => void] => {
  const cookie = getCookie(analyticsCookieName)

  const cookieSettings = cookie
    ? (JSON.parse(cookie) as SavedAnalyticsCookiesSettings)
    : savedFromServer

  const setValue = (value: SavedAnalyticsCookiesSettings) => {
    setCookie(analyticsCookieName, JSON.stringify(value), 365, { secure: true })
  }

  return [cookieSettings, setValue]
}
