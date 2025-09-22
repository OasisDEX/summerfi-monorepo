/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from 'react'
import { throttle } from 'lodash-es'
import { usePathname, useSearchParams } from 'next/navigation'

import { EarnProtocolEvents } from '@/helpers/mixpanel'

type EP = typeof EarnProtocolEvents
type HandlerKey = keyof EP
type EventArgs<K extends HandlerKey> = K extends HandlerKey ? Parameters<EP[K]>[0] : never

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
 * Global hook that adds user/context params and handles queueing while account loads.
 * Returns a `track` function: (handlerKey, params) => void
 */

export const useMixpanelTracker = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

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

      try {
        const handler = EarnProtocolEvents[handlerKey]

        if (typeof handler === 'function') {
          // cast to EventArgs<K> at the callsite — we intentionally accept Partial input and merge userData
          const fn = handler as unknown as (p: EventArgs<K>) => void

          fn({
            ...baseParams,
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
    [pathname, searchParams],
  )

  return track
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
