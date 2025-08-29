import { MixpanelEventProduct, MixpanelEventTypes } from '@summerfi/app-types'
import browserDetect from 'browser-detect'
import upperFirst from 'lodash-es/upperFirst'

import { basePath } from '@/helpers/base-path'
import { mixpanelBrowser } from '@/helpers/mixpanel-init'

export const optedOutCheck = () =>
  process.env.NODE_ENV !== 'development' && mixpanelBrowser.has_opted_out_tracking()

const includeBasePath = (path: string) => `${basePath}${path.replace(/\/$/u, '')}`

export const trackEvent = (eventName: string, eventBody: { [key: string]: unknown }) => {
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

  void fetch(`${basePath}/api/t`, {
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
export const trackPageView = ({ path, userAddress }: PageViewType) => {
  try {
    const eventBody = {
      product: MixpanelEventProduct.Rays,
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
  network: string
  connectionMethod: string
  walletLabel: string | undefined
}

// account change
export const trackAccountChange = ({
  account,
  network,
  connectionMethod,
  walletLabel,
}: AccountChangeType) => {
  try {
    const eventBody = {
      product: MixpanelEventProduct.Rays,
      id: 'AccountChange',
      account,
      network,
      connectionMethod,
      walletLabel,
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
      product: MixpanelEventProduct.Rays,
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

type InputChangeType = {
  id: string
  page: string
  userAddress?: string
  [key: string]: unknown
}

// input change
export const trackInputChange = ({ id, page, userAddress, ...rest }: InputChangeType) => {
  try {
    const eventBody = {
      product: MixpanelEventProduct.Rays,
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
    console.error('Error tracking button click', error)
  }
}
