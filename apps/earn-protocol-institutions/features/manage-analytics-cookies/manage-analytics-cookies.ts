'use client'

import { type AnalyticsCookieName } from '@summerfi/app-earn-ui'

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
