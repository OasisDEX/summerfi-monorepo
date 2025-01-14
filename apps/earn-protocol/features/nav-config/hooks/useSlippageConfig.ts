'use client'
import { useEffect } from 'react'
import {
  LocalConfigDispatchActions,
  type SlippageConfig,
  slippageConfigCookieName,
  useLocalConfig,
} from '@summerfi/app-earn-ui'
import { getCookie, setCookie } from '@summerfi/app-utils'

/**
 * Custom hook to manage slippage configuration.
 *
 * This hook provides the current slippage configuration and a function to update it.
 * The configuration is stored in a cookie and in the local state managed by the LocalConfigContext.
 *
 * @returns {[SlippageConfig, (value: SlippageConfig) => void]} - The current slippage configuration and a function to update it.
 */
export const useSlippageConfig = (): [SlippageConfig, (value: SlippageConfig) => void] => {
  const {
    state: { slippageConfig },
    dispatch,
  } = useLocalConfig()
  const cookie = getCookie(slippageConfigCookieName)

  const setValue = (value: SlippageConfig) => {
    setCookie(
      slippageConfigCookieName,
      JSON.stringify({ slippage: value.slippage.replaceAll(',', '') }),
      365,
      { secure: true },
    )
    dispatch({ type: LocalConfigDispatchActions.UPDATE_SLIPPAGE_CONFIG, payload: value })
  }

  useEffect(() => {
    if (!cookie) {
      setCookie(slippageConfigCookieName, JSON.stringify(slippageConfig), 365, { secure: true })
    }
  }, [cookie, slippageConfig])

  return [slippageConfig, setValue]
}
