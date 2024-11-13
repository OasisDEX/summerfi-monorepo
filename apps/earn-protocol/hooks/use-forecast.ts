import { useEffect, useState } from 'react'
import { type ForecastData, type SDKChainId } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'
import debounce from 'lodash-es/debounce'

type UseForecastProps = {
  fleetAddress: string
  chainId: SDKChainId
  amount: string
}

export const useForecast = ({ fleetAddress, chainId, amount }: UseForecastProps) => {
  const [isLoadingForecast, setIsLoadingForecast] = useState(true)
  const [forecast, setForecast] = useState<ForecastData>()

  useEffect(() => {
    if (new BigNumber(amount).isZero()) return () => {}
    setIsLoadingForecast(true)

    const fetchForecast = debounce(() => {
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
  }, [fleetAddress, chainId, amount])

  return { forecast, isLoadingForecast }
}
