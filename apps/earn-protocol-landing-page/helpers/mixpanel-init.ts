import * as mixpanelBrowser from 'mixpanel-browser'

if (!process.env.NEXT_PUBLIC_EARN_MIXPANEL_KEY) {
  throw new Error('NEXT_PUBLIC_EARN_MIXPANEL_KEY is not defined')
}

mixpanelBrowser.init(process.env.NEXT_PUBLIC_EARN_MIXPANEL_KEY, {
  debug: false,
  ip: false,
})

export { mixpanelBrowser }
