import {
  type EarnProtocolBaseEventProps,
  type EarnProtocolButtonClickedEventProps,
  type EarnProtocolDropdownChangedEventProps,
  EarnProtocolEventNames,
  type EarnProtocolEventPropsMap,
  type EarnProtocolInputChangedEventProps,
  type EarnProtocolScrolledEventProps,
  type EarnProtocolTooltipHoveredEventProps,
  type EarnProtocolTransactionEventProps,
  type EarnProtocolViewPositionEventProps,
} from '@summerfi/app-types'
import { type EarnProtocolCustomEventProps } from '@summerfi/app-types/types/src/mixpanel/earn-protocol-events'
import browserDetect from 'browser-detect'
import { upperFirst } from 'lodash-es'

import { mixpanelBrowser } from '@/helpers/mixpanel-init'

const optedOutCheck = () =>
  process.env.NODE_ENV !== 'development' && mixpanelBrowser.has_opted_out_tracking()

const includeBasePath = (path: string) => `/earn${path.replace(/\/$/u, '')}`

// --- Generic trackEvent helper ---
export function trackEvent<E extends EarnProtocolEventNames>(
  ev: E,
  props: EarnProtocolEventPropsMap[E],
) {
  const eventData = {
    eventName: ev,
    eventBody: {
      ...props,
      timestamp: new Date().toISOString(),
      page: includeBasePath(props.page),
    },
  }

  // eslint-disable-next-line turbo/no-undeclared-env-vars, @typescript-eslint/prefer-nullish-coalescing
  if (process.env.TURBOPACK || window.location.hostname.includes('staging')) {
    // eslint-disable-next-line no-console
    console.info('Mixpanel event:', JSON.stringify(eventData, null, 2))

    return
  }
  const isOptedOut = optedOutCheck()

  if (isOptedOut && eventData.eventName !== EarnProtocolEventNames.PageViewed) {
    // if the user is opted out, we track just the page view event
    return
  }

  const baseWindowObject = {
    navigator: { userAgent: '' },
    document: { location: { hostname: '' }, referrer: '' },
    screen: { width: 0, height: 0 },
    location: { href: '' },
  } as Window

  const win = typeof window !== 'undefined' ? window : baseWindowObject

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
      ...eventData,
      distinctId: mixpanelBrowser.get_distinct_id(),
      currentUrl: includeBasePath(win.location.href),
      ...(!isOptedOut && {
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

// --- Specific Event Handlers ---

export const EarnProtocolEvents = {
  pageViewed: (props: EarnProtocolBaseEventProps) =>
    trackEvent(EarnProtocolEventNames.PageViewed, props),

  scrolled: (props: EarnProtocolScrolledEventProps) =>
    trackEvent(EarnProtocolEventNames.Scrolled, props),

  walletConnected: (props: EarnProtocolBaseEventProps) =>
    trackEvent(EarnProtocolEventNames.WalletConnected, props),

  accountChanged: (props: EarnProtocolBaseEventProps) =>
    trackEvent(EarnProtocolEventNames.AccountChanged, props),

  walletDisconnected: (props: EarnProtocolBaseEventProps) =>
    trackEvent(EarnProtocolEventNames.WalletDisconnected, props),

  viewPosition: (props: EarnProtocolViewPositionEventProps) =>
    trackEvent(EarnProtocolEventNames.ViewPosition, props),

  transactionSimulated: (props: EarnProtocolTransactionEventProps) =>
    trackEvent(EarnProtocolEventNames.TransactionSimulated, props),

  transactionSubmitted: (props: EarnProtocolTransactionEventProps) =>
    trackEvent(EarnProtocolEventNames.TransactionSubmitted, props),

  transactionConfirmed: (props: EarnProtocolTransactionEventProps) =>
    trackEvent(EarnProtocolEventNames.TransactionConfirmed, props),

  transactionSuccess: (props: EarnProtocolTransactionEventProps) =>
    trackEvent(EarnProtocolEventNames.TransactionSuccess, props),

  transactionFailure: (props: EarnProtocolTransactionEventProps) =>
    trackEvent(EarnProtocolEventNames.TransactionFailure, props),

  buttonClicked: (props: EarnProtocolButtonClickedEventProps) =>
    trackEvent(EarnProtocolEventNames.ButtonClicked, props),

  inputChanged: (props: EarnProtocolInputChangedEventProps) =>
    trackEvent(EarnProtocolEventNames.InputChanged, props),

  dropdownChanged: (props: EarnProtocolDropdownChangedEventProps) =>
    trackEvent(EarnProtocolEventNames.DropdownChanged, props),

  tooltipHovered: (props: EarnProtocolTooltipHoveredEventProps) =>
    trackEvent(EarnProtocolEventNames.TooltipHovered, props),

  errorOccurred: (props: EarnProtocolBaseEventProps) =>
    trackEvent(EarnProtocolEventNames.ErrorOccurred, props),

  customEvent: (props: EarnProtocolCustomEventProps) =>
    trackEvent(EarnProtocolEventNames.CustomEvent, props),
}
