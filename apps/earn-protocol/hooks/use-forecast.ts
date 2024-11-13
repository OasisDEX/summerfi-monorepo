import { useEffect, useState } from 'react'
import { type ForecastData, type SDKChainId } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'
import debounce from 'lodash-es/debounce'

type UseForecastProps = {
  fleetAddress: string
  chainId: SDKChainId
  amount: string
  preloadedForecast?: ForecastData
}

export const useForecast = ({
  fleetAddress,
  chainId,
  amount,
  preloadedForecast,
}: UseForecastProps) => {
  const [isLoadingForecast, setIsLoadingForecast] = useState(false)
  const [forecast, setForecast] = useState<ForecastData | undefined>(preloadedForecast)

  useEffect(() => {
    const fetchForecast = debounce(() => {
      if (
        new BigNumber(amount).isZero() || // Don't fetch forecast for zero amounts
        (forecast && new BigNumber(amount).eq(forecast.amount)) // Don't refetch if the amount hasn't changed (including preloaded)
      ) {
        return () => {}
      }
      setIsLoadingForecast(true)
      const controller = new AbortController()

      fetch(`/api/forecast/${fleetAddress}/${chainId}/${amount}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: ForecastData) => {
          setForecast(data)
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
  }, [fleetAddress, chainId, amount, forecast])

  return { forecast, isLoadingForecast }
}
