'use client'

import { type AnalyticsCookieName } from '@summerfi/app-earn-ui'

/**
 * Consent handlers for the cookie banner. No analytics provider is wired up, so
 * both categories are no-ops — the banner only persists the user's choice.
 */
export const manageAnalyticsCookies: {
  [key in AnalyticsCookieName]: { enable: () => void; disable: () => void }
} = {
  marketing: {
    enable: () => {},
    disable: () => {},
  },
  analytics: {
    enable: () => {},
    disable: () => {},
  },
}
