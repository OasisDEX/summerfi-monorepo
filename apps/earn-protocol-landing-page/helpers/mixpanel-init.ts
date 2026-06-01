import mixpanelBrowser from 'mixpanel-browser'

const mixpanelKey = process.env.NEXT_PUBLIC_EARN_MIXPANEL_KEY

if (mixpanelKey) {
  mixpanelBrowser.init(mixpanelKey, {
    debug: false,
    ip: false,
  })
} else if (process.env.NODE_ENV !== 'production') {
  // Degrade gracefully instead of throwing at import time (which would hard-fail
  // the bundle). Analytics calls become no-ops when the key is absent.
  // eslint-disable-next-line no-console
  console.warn('NEXT_PUBLIC_EARN_MIXPANEL_KEY is not defined — Mixpanel tracking disabled')
}

export { mixpanelBrowser }
