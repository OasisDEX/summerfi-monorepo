'use client'
import { useEffect, useState } from 'react'
import { type ForecastData, type SDKChainId } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'
import debounce from 'lodash-es/debounce'

import {
  type EarningsEstimationsMap,
  getEarningsEstimationsMap,
} from '@/helpers/get-earnings-estimations-map'
import { getOneYearEarnings } from '@/helpers/get-one-year-earnings'

type UseForecastProps = {
  fleetAddress: string
  chainId: SDKChainId
  amount: string
  disabled?: boolean
  isEarnApp?: boolean
}

export const useForecast = ({
  fleetAddress,
  chainId,
  amount,
  disabled = false,
  isEarnApp = false,
}: UseForecastProps): {
  forecast: ForecastData | undefined
  isLoadingForecast: boolean
  oneYearEarningsForecast: string | undefined
  forecastSummaryMap: EarningsEstimationsMap | undefined
} => {
  const [isLoadingForecast, setIsLoadingForecast] = useState(true)
  const [forecast, setForecast] = useState<ForecastData | undefined>()
  const [forecastSummaryMap, setForecastSummaryMap] = useState<EarningsEstimationsMap | undefined>()
  const [oneYearEarningsForecast, setOneYearEarningsForecast] = useState<string | undefined>()

  useEffect(() => {
    if (disabled) {
      return () => {}
    }
    setIsLoadingForecast(true)
    const fetchForecast = debounce(() => {
      if (
        new BigNumber(amount).isZero() // Don't fetch forecast for zero amounts
      ) {
        setForecastSummaryMap(undefined)
        setOneYearEarningsForecast(undefined)
        setIsLoadingForecast(false)

        return () => {}
      }
      const controller = new AbortController()

      fetch(`${isEarnApp ? '/earn' : ''}/api/forecast/${fleetAddress}/${chainId}/${amount}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: ForecastData) => {
          setForecast(data)
          setOneYearEarningsForecast(
            getOneYearEarnings({
              forecast: data,
              inputValue: amount,
            }),
          )
          setForecastSummaryMap(
            getEarningsEstimationsMap({
              forecast: data,
              inputValue: amount,
            }),
          )
          setIsLoadingForecast(false)
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            return // Ignore abort errors
          }
          // eslint-disable-next-line no-console
          console.error(
            'Failed to fetch forecast:',
            error instanceof Error ? error.message : 'Unknown error',
          )
          setForecast(undefined)
          setIsLoadingForecast(false)
        })

      return () => controller.abort()
    }, 300)

    fetchForecast()

    return () => {
      fetchForecast.cancel()
    }
  }, [fleetAddress, chainId, amount, disabled, isEarnApp])

  return { forecast, isLoadingForecast, oneYearEarningsForecast, forecastSummaryMap }
}
