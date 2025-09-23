/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useChain, useUser } from '@account-kit/react'
import { useUserWallet } from '@summerfi/app-earn-ui'
import { type EarnProtocolTransactionEventProps } from '@summerfi/app-types'
import { debounce, throttle } from 'lodash-es'
import { usePathname, useSearchParams } from 'next/navigation'

import { EarnProtocolEvents } from '@/helpers/mixpanel'

type EP = typeof EarnProtocolEvents
type HandlerKey = keyof EP
type EventArgs<K extends HandlerKey> = K extends HandlerKey ? Parameters<EP[K]>[0] : never

type PendingEvent = {
  handlerKey: HandlerKey
  params: {
    [key: string]: any
  }
}

const searchParamsList = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
  'utm_campaign_id',
  'utm_source_platform',
  'utm_creative_format',
  'utm_marketing_tactic',
] as const

/**
 * Module-level queue of events fired while account is loading.
 * Each hook can use `useMixpanelTracker()` to get a `track` function that:
 * - immediately sends event when account is ready
 * - enqueues event (including page + minimal params) while account is loading
 * When any hook observing `isLoadingAccount` sees it switch to false, it flushes the queue
 * merging the latest userData into each event.
 */

const pendingQueue: PendingEvent[] = []

const flushPending = (userData: { [key: string]: any } = {}) => {
  while (pendingQueue.length) {
    const { handlerKey, params } = pendingQueue.shift() as PendingEvent

    try {
      const handler = EarnProtocolEvents[handlerKey]

      if (typeof handler === 'function') {
        // cast to any to avoid TS requiring full event shape for flushed items
        const fn = handler as unknown as (p: { [key: string]: any }) => void

        fn({
          ...params,
          ...userData,
        })
      } else {
        // eslint-disable-next-line no-console
        console.warn('Mixpanel handler missing for', handlerKey)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error tracking flushed event', error)
    }
  }
}

/**
 * Global hook that adds user/context params and handles queueing while account loads.
 * Returns a `track` function: (handlerKey, params) => void
 */

const useMixpanelTracker = () => {
  const pathname = usePathname()
  const user = useUser()
  const searchParams = useSearchParams()
  const { userWalletAddress: walletAddress, isLoadingAccount } = useUserWallet()
  const { chain } = useChain()

  const userData = useMemo(() => {
    if (isLoadingAccount) return {}

    return {
      walletAddress,
      connectionMethod: user?.type ?? null,
      network: chain.name,
    } as { [key: string]: any }
  }, [chain.name, isLoadingAccount, user?.type, walletAddress])

  useEffect(() => {
    if (!isLoadingAccount) {
      flushPending(userData)
    }
  }, [isLoadingAccount, userData])

  const track = useCallback(
    <K extends HandlerKey>(
      handlerKey: K,
      params: Partial<EventArgs<K>> = {} as Partial<EventArgs<K>>,
    ) => {
      const baseParams = { page: pathname, ...(params as { [key: string]: any }) }
      const utmSearchParams = Object.fromEntries(
        Array.from(searchParams.entries()).filter(([key]) =>
          searchParamsList.includes(key as (typeof searchParamsList)[number]),
        ),
      )

      if (isLoadingAccount) {
        pendingQueue.push({ handlerKey, params: baseParams })

        return
      }

      try {
        const handler = EarnProtocolEvents[handlerKey]

        if (typeof handler === 'function') {
          // cast to EventArgs<K> at the callsite — we intentionally accept Partial input and merge userData
          const fn = handler as unknown as (p: EventArgs<K>) => void

          fn({
            ...baseParams,
            ...userData,
            ...utmSearchParams,
          } as EventArgs<K>)
        } else {
          // eslint-disable-next-line no-console
          console.warn('Mixpanel handler missing for', handlerKey)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error tracking event', error)
      }
    },
    [isLoadingAccount, pathname, userData, searchParams],
  )

  return track
}

export const useHandleTooltipOpenEvent = () => {
  const track = useMixpanelTracker()

  return useMemo(
    () =>
      debounce((tooltipName: string) => {
        track('tooltipHovered', { tooltipName: `ep-${tooltipName}` })
      }, 500) as unknown as (tooltipName: string) => void,
    [track],
  )
}

export const useHandleButtonClickEvent = () => {
  const track = useMixpanelTracker()

  return useMemo(
    () =>
      debounce((buttonName: string) => {
        track('buttonClicked', { buttonName: `ep-${buttonName}` })
      }, 500) as unknown as (buttonName: string) => void,
    [track],
  )
}

export const useHandleTransactionEvent = () => {
  const track = useMixpanelTracker()

  return ({
    transactionType,
    txEvent,
    txAmount,
    vaultSlug,
    txHash,
    result,
  }: {
    transactionType: EarnProtocolTransactionEventProps['transactionType']
    vaultSlug?: EarnProtocolTransactionEventProps['vaultSlug']
    txHash?: EarnProtocolTransactionEventProps['txHash']
    txAmount?: EarnProtocolTransactionEventProps['txAmount']
    result?: EarnProtocolTransactionEventProps['result']
    txEvent:
      | 'transactionSimulated'
      | 'transactionSubmitted'
      | 'transactionConfirmed'
      | 'transactionSuccess'
      | 'transactionFailure'
  }) => {
    const handlerKey = txEvent as keyof typeof EarnProtocolEvents

    track(handlerKey, { transactionType, vaultSlug, txAmount, txHash, result })
  }
}

export const useHandleDropdownChangeEvent = () => {
  const track = useMixpanelTracker()

  const handleEvent = useCallback(
    ({ inputName, value }: { inputName: string; value: string }) => {
      track('dropdownChanged', { dropdownName: `ep-${inputName}`, value })
    },
    [track],
  )

  return useMemo(
    () =>
      debounce(handleEvent, 500) as unknown as (payload: {
        inputName: string
        value: string
      }) => void,
    [handleEvent],
  )
}

export const useHandleInputChangeEvent = () => {
  const track = useMixpanelTracker()

  const handleEvent = useCallback(
    ({ inputName, value }: { inputName: string; value: string }) => {
      track('inputChanged', { inputName: `ep-${inputName}`, value })
    },
    [track],
  )

  return useMemo(
    () =>
      debounce(handleEvent, 500) as unknown as (payload: {
        inputName: string
        value: string
      }) => void,
    [handleEvent],
  )
}

export const useDisplayBannerEvent: () => ({ bannerName }: { bannerName: string }) => void = () => {
  const track = useMixpanelTracker()
  const hasFiredRef = useRef(false)

  const handleEvent = useCallback(
    ({ bannerName }: { bannerName: string }) => {
      if (hasFiredRef.current) return
      track('customEvent', { customEventName: `ep-banner-displayed-${bannerName}` })
      hasFiredRef.current = true
    },
    [track],
  )

  return useMemo(
    () =>
      throttle(handleEvent, 10000) as unknown as ({ bannerName }: { bannerName: string }) => void,
    [handleEvent],
  )
}

export const usePageviewEvent = () => {
  const track = useMixpanelTracker()

  return useMemo(
    () =>
      throttle((page: string) => {
        track('pageViewed', { page })
      }, 500) as unknown as (page: string) => void,
    [track],
  )
}
