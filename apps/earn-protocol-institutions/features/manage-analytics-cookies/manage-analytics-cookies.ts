'use client'

import { type AnalyticsCookieName } from '@summerfi/app-earn-ui'

import { mixpanelBrowser } from '@/helpers/mixpanel-init'

export const manageAnalyticsCookies: {
  [key in AnalyticsCookieName]: { enable: () => void; disable: () => void }
} = {
  marketing: {
    enable: () => {},
    disable: () => {},
  },
  analytics: {
    enable: () => mixpanelBrowser.opt_in_tracking(),
    disable: () => mixpanelBrowser.opt_out_tracking(),
  },
}
