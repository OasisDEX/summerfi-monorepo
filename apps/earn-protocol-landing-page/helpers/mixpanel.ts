import { MixpanelEventProduct, MixpanelEventTypes } from '@summerfi/app-types'
import browserDetect from 'browser-detect'
import upperFirst from 'lodash-es/upperFirst'

import { mixpanelBrowser } from '@/helpers/mixpanel-init'

const optedOutCheck = () =>
  process.env.NODE_ENV !== 'development' && mixpanelBrowser.has_opted_out_tracking()

const includeBasePath = (path: string) => `/earn${path.replace(/\/$/u, '')}`

const trackEvent = (eventName: string, eventBody: { [key: string]: unknown }) => {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.TURBOPACK) {
    return
  }
  let win: Window

  if (typeof window === 'undefined') {
    const loc = { hostname: '' }

    win = {
      navigator: { userAgent: '' },
      document: { location: loc, referrer: '' },
      screen: { width: 0, height: 0 },
      location: loc,
    } as Window
  } else {
    win = window
  }
  const { name: browserName, mobile, os, versionNumber } = browserDetect()
  const initialReferrer = mixpanelBrowser.get_property('$initial_referrer')
  const initialReferringDomain = initialReferrer
    ? initialReferrer === '$direct'
      ? '$direct'
      : new URL(initialReferrer).hostname
    : ''

  void fetch(`/earn/api/t`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      eventBody,
      eventName,
      distinctId: mixpanelBrowser.get_distinct_id(),
      currentUrl: win.location.href,
      ...(!optedOutCheck() && {
        browser: upperFirst(browserName),
        browserVersion: versionNumber,
        initialReferrer,
        initialReferringDomain,
        mobile,
        os,
        screenHeight: win.innerHeight,
        screenWidth: win.innerWidth,
        userId: mixpanelBrowser.get_property('$user_id'),
      }),
    }),
  })
}

type AppError = {
  id: string
  page: string
  digest?: string
  message?: string
  [key: string]: unknown
}

// app error - global error handler
export const trackError = ({ id, page, message, digest, ...rest }: AppError) => {
  try {
    const eventBody = {
      product: MixpanelEventProduct.EarnProtocol,
      id,
      page: includeBasePath(page),
      digest,
      message,
      ...rest,
    }

    trackEvent(MixpanelEventTypes.AppError, eventBody)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error tracking button click', error)
  }
}
