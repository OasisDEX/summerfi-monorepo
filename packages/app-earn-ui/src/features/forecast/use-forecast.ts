'use client'
import { useEffect, useState } from 'react'
import { type ForecastData, type SDKChainId } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'
import debounce from 'lodash-es/debounce'

import { getOneYearEarnings } from '@/helpers/get-one-year-earnings'

type UseForecastProps = {
  fleetAddress: string
  chainId: SDKChainId
  amount: string
  disabled?: boolean
}

export const useForecast = ({
  fleetAddress,
  chainId,
  amount,
  disabled = false,
}: UseForecastProps) => {
  const [isLoadingForecast, setIsLoadingForecast] = useState(true)
  const [forecast, setForecast] = useState<ForecastData | undefined>()
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
        setOneYearEarningsForecast(undefined)
        setIsLoadingForecast(false)

        return () => {}
      }
      const controller = new AbortController()

      fetch(`/api/forecast/${fleetAddress}/${chainId}/${amount}`, {
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
          setIsLoadingForecast(false)
        })

      return () => controller.abort()
    }, 300)

    fetchForecast()

    return () => {
      fetchForecast.cancel()
    }
  }, [fleetAddress, chainId, amount, disabled])

  return { forecast, isLoadingForecast, oneYearEarningsForecast }
}
