import { MixpanelEventProduct, MixpanelEventTypes } from '@summerfi/app-types'
import browserDetect from 'browser-detect'
import { upperFirst } from 'lodash-es'

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

type PageViewType = {
  path: string
  userAddress?: string
}

// page view
const trackPageView = ({ path, userAddress }: PageViewType) => {
  try {
    const eventBody = {
      product: MixpanelEventProduct.EarnProtocol,
      id: includeBasePath(path),
      userAddress,
    }

    if (!optedOutCheck()) {
      trackEvent(MixpanelEventTypes.Pageview, eventBody)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error tracking page view', error)
  }
}

export const trackPageViewTimed = ({ path, userAddress }: PageViewType) => {
  setTimeout(() => {
    trackPageView({ path, userAddress })
  }, 1000)
}

type AccountChangeType = {
  account: `0x${string}`
  accountType?: string
  network: string
  connectionMethod: string
}

// account change
export const trackAccountChange = ({
  account,
  network,
  accountType,
  connectionMethod,
}: AccountChangeType) => {
  try {
    const eventBody = {
      product: MixpanelEventProduct.EarnProtocol,
      id: 'AccountChange',
      account,
      network,
      connectionMethod,
      accountType,
    }

    if (!optedOutCheck()) {
      trackEvent(MixpanelEventTypes.AccountChange, eventBody)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error tracking account change', error)
  }
}

type ButtonClickType = {
  id: string
  page: string
  userAddress?: string
  [key: string]: unknown
}

// button click
export const trackButtonClick = ({ id, page, userAddress, ...rest }: ButtonClickType) => {
  try {
    const eventBody = {
      product: MixpanelEventProduct.EarnProtocol,
      id,
      page: includeBasePath(page),
      userAddress,
      ...rest,
    }

    if (!optedOutCheck()) {
      trackEvent(MixpanelEventTypes.ButtonClick, eventBody)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error tracking button click', error)
  }
}

type MixpanelEventData = {
  id: string
  page: string
  userAddress?: string
  [key: string]: unknown
}

// input change
export const trackInputChange = ({ id, page, userAddress, ...rest }: MixpanelEventData) => {
  try {
    const eventBody = {
      product: MixpanelEventProduct.EarnProtocol,
      id,
      page: includeBasePath(page),
      userAddress,
      ...rest,
    }

    if (!optedOutCheck()) {
      trackEvent(MixpanelEventTypes.InputChange, eventBody)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error tracking input change', error)
  }
}

// game finished
export const trackGameFinished = ({ id, page, userAddress, ...rest }: MixpanelEventData) => {
  try {
    const eventBody = {
      product: MixpanelEventProduct.EarnProtocol,
      id,
      page: includeBasePath(page),
      userAddress,
      ...rest,
    }

    if (!optedOutCheck()) {
      trackEvent(MixpanelEventTypes.GameFinished, eventBody)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error tracking game finished', error)
  }
}

export const trackVaultSwitched = ({ id, page, userAddress, ...rest }: MixpanelEventData) => {
  try {
    const eventBody = {
      product: MixpanelEventProduct.EarnProtocol,
      id,
      page: includeBasePath(page),
      userAddress,
      ...rest,
    }

    if (!optedOutCheck()) {
      trackEvent(MixpanelEventTypes.VaultSwitched, eventBody)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error tracking vault switched', error)
  }
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
    console.error('Error tracking app error', error)
  }
}
