'use client'
import { useEffect } from 'react'
import {
  LocalConfigDispatchActions,
  type SumrNetApyConfig,
  sumrNetApyConfigCookieName,
  useLocalConfig,
} from '@summerfi/app-earn-ui'
import { getCookie, setCookie } from '@summerfi/app-utils'

/**
 * Custom hook to manage SUMR Net APY configuration.
 *
 * This hook provides the current SUMR Net APY configuration and a function to update it.
 * The configuration is stored in a cookie and in the local state managed by the LocalConfigContext.
 *
 * @returns {[SumrNetApyConfig, (value: SumrNetApyConfig) => void]} - The current SUMR Net APY configuration and a function to update it.
 */
export const useSumrNetApyConfig = (): [SumrNetApyConfig, (value: SumrNetApyConfig) => void] => {
  const {
    state: { sumrNetApyConfig },
    dispatch,
  } = useLocalConfig()
  const cookie = getCookie(sumrNetApyConfigCookieName)

  const setValue = (value: SumrNetApyConfig) => {
    setCookie(
      sumrNetApyConfigCookieName,
      JSON.stringify({ ...value, dilutedValuation: value.dilutedValuation.replaceAll(',', '') }),
      365,
      { secure: true },
    )
    dispatch({ type: LocalConfigDispatchActions.UPDATE_SUMR_NET_APY_CONFIG, payload: value })
  }

  useEffect(() => {
    if (!cookie) {
      setCookie(sumrNetApyConfigCookieName, JSON.stringify(sumrNetApyConfig), 365, { secure: true })
    }
  }, [cookie, sumrNetApyConfig])

  return [sumrNetApyConfig, setValue]
}
