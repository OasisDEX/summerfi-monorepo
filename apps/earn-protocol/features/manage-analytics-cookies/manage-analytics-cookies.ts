'use client'

import { type AnalyticsCookieName } from '@summerfi/app-earn-ui'

import { getMixpanelBrowser } from '@/helpers/mixpanel-init'

export const manageAnalyticsCookies: {
  [key in AnalyticsCookieName]: { enable: () => void; disable: () => void }
} = {
  marketing: {
    enable: () => {},
    disable: () => {},
  },
  analytics: {
    enable: () =>
      void getMixpanelBrowser()
        .then((mixpanelBrowser) => mixpanelBrowser.opt_in_tracking())
        .catch(() => undefined),
    disable: () =>
      void getMixpanelBrowser()
        .then((mixpanelBrowser) => mixpanelBrowser.opt_out_tracking())
        .catch(() => undefined),
  },
}
