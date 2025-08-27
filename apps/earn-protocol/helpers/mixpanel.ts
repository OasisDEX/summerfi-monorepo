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
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.TURBOPACK) {
    // eslint-disable-next-line no-console
    console.info(
      'Mixpanel event:',
      JSON.stringify(
        {
          eventName: ev,
          eventBody: {
            timestamp: new Date().toISOString(),
            ...props,
          },
        },
        null,
        2,
      ),
    )

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
      eventName: ev,
      eventBody: {
        timestamp: new Date().toISOString(),
        ...props,
      },
      distinctId: mixpanelBrowser.get_distinct_id(),
      currentUrl: includeBasePath(win.location.href),
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
