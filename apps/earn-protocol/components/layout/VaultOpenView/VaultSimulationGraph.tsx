'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, SkeletonLine, Text } from '@summerfi/app-earn-ui'
import { type ForecastData, type SDKVaultishType, type TimeframesType } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'

import { OpenPositionForecastChart } from '@/components/organisms/Charts/OpenPositionForecastChart'

export const VaultSimulationGraph = ({
  amount,
  vault,
  forecast,
  isLoadingForecast,
}: {
  amount?: BigNumber
  vault: SDKVaultishType
  forecast?: ForecastData
  isLoadingForecast?: boolean
}) => {
  const [timeframe, setTimeframe] = useState<TimeframesType>('3y')
  const [amountCached, setAmountCached] = useState<BigNumber>()

  const tokenPrice = vault.inputTokenPriceUSD

  useEffect(() => {
    if (!amount || amount.eq(0)) {
      return
    }
    setAmountCached(amount)
  }, [amount])

  const parsedData = useMemo(() => {
    if (!forecast && isLoadingForecast) {
      return []
    }
    if (!forecast) {
      return []
    }
    if (['1y', '3y'].includes(timeframe)) {
      return forecast.dataPoints.weekly.filter((point) => {
        if (timeframe === '1y') {
          return dayjs(point.timestamp).isBefore(dayjs().add(1, 'day').add(1, 'year'))
        }

        // if else its 3y
        return dayjs(point.timestamp).isBefore(dayjs().add(1, 'day').add(3, 'year'))
      })
    }

    return forecast.dataPoints.daily.filter((point) => {
      if (timeframe === '6m') {
        return dayjs(point.timestamp).isBefore(dayjs().add(1, 'day').add(6, 'month'))
      }

      // if else its 90d
      return dayjs(point.timestamp).isBefore(dayjs().add(1, 'day').add(90, 'day'))
    })
  }, [forecast, timeframe, isLoadingForecast])

  const maxEarnInTimeframeToken = useMemo(() => {
    if (!parsedData.length || !amountCached || isLoadingForecast) {
      return undefined
    }

    // if we want to show the true earned, not deposit + earned
    // return new BigNumber(parsedData[parsedData.length - 1].forecast).minus(amountCached).toString()
    return parsedData[parsedData.length - 1].forecast
  }, [amountCached, parsedData, isLoadingForecast])

  const maxEarnInTimeframeUSD = useMemo(() => {
    if (!maxEarnInTimeframeToken || !tokenPrice) {
      return undefined
    }

    return new BigNumber(maxEarnInTimeframeToken).times(tokenPrice).toString()
  }, [maxEarnInTimeframeToken, tokenPrice])

  return (
    <Card
      style={{
        flexDirection: 'column',
        marginBottom: 'var(--general-space-16)',
        textAlign: 'center',
      }}
    >
      <Text
        variant="p1semi"
        style={{
          marginTop: 'var(--general-space-8)',
          marginBottom: 'var(--general-space-8)',
          color: 'var(--color-text-primary-disabled)',
        }}
      >
        You could earn
      </Text>
      <Text
        variant="h2"
        style={{
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--general-space-8)',
        }}
      >
        {maxEarnInTimeframeUSD ? (
          `$${formatCryptoBalance(maxEarnInTimeframeUSD)}`
        ) : (
          <SkeletonLine style={{ display: 'inline-block' }} width={200} height={30} />
        )}
      </Text>
      <Text
        variant="p2semi"
        style={{
          color: 'var(--color-text-secondary)',
        }}
      >
        {maxEarnInTimeframeToken ? (
          `${formatCryptoBalance(maxEarnInTimeframeToken)} ${vault.inputToken.symbol}`
        ) : (
          <SkeletonLine style={{ display: 'inline-block' }} width={150} height={20} />
        )}
      </Text>
      <OpenPositionForecastChart
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        parsedData={parsedData}
        isLoadingForecast={isLoadingForecast}
      />
    </Card>
  )
}
