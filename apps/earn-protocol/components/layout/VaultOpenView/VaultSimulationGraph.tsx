'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, getDisplayToken, SkeletonLine, Text } from '@summerfi/app-earn-ui'
import { type ForecastData, type SDKVaultishType, type TimeframesType } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'
import dayjs from 'dayjs'

import { OpenPositionForecastChart } from '@/components/organisms/Charts/OpenPositionForecastChart'

const timeframeLabels: { [key in TimeframesType]: string } = {
  '7d': '7 days',
  '30d': '30 days',
  '90d': '90 days',
  '6m': '6 months',
  '1y': '1 year',
  '3y': '3 years',
}

export const VaultSimulationGraph = ({
  amount,
  vault,
  forecast,
  isLoadingForecast,
  isManage = false,
}: {
  amount?: BigNumber
  vault: SDKVaultishType
  forecast?: ForecastData
  isLoadingForecast?: boolean
  isManage?: boolean
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
    const today = dayjs().startOf('day')

    if (['1y', '3y'].includes(timeframe)) {
      return forecast.dataPoints.weekly.filter((point) => {
        if (timeframe === '1y') {
          return dayjs(point.timestamp).isBefore(today.add(1, 'day').add(1, 'year'))
        }

        // if else its 3y
        return dayjs(point.timestamp).isBefore(today.add(1, 'day').add(3, 'year'))
      })
    }

    return forecast.dataPoints.daily.filter((point) => {
      if (timeframe === '7d') {
        return dayjs(point.timestamp).isBefore(today.add(1, 'day').add(7, 'days'))
      }
      if (timeframe === '30d') {
        return dayjs(point.timestamp).isBefore(today.add(1, 'day').add(30, 'days'))
      }
      if (timeframe === '6m') {
        return dayjs(point.timestamp).isBefore(today.add(1, 'day').add(6, 'month'))
      }

      // if else its 90d
      return dayjs(point.timestamp).isBefore(today.add(1, 'day').add(90, 'day'))
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

  return (
    <Card
      style={{
        flexDirection: 'column',
        marginBottom: 'var(--general-space-16)',
        textAlign: 'center',
      }}
      variant="cardSecondary"
    >
      <Text
        variant="p1semi"
        style={{
          marginTop: 'var(--general-space-8)',
          marginBottom: 'var(--general-space-4)',
          color: 'var(--color-text-primary-disabled)',
        }}
      >
        You could earn
      </Text>
      <Text
        variant="h2"
        style={{
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--general-space-4)',
        }}
      >
        {maxEarnInTimeframeToken ? (
          `${formatCryptoBalance(maxEarnInTimeframeToken)} ${getDisplayToken(vault.inputToken.symbol)}`
        ) : (
          <SkeletonLine style={{ display: 'inline-block' }} width={150} height={20} />
        )}
      </Text>
      <Text
        variant="p2semi"
        style={{
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--general-space-8)',
        }}
      >
        after {timeframeLabels[timeframe]}
      </Text>
      <OpenPositionForecastChart
        tokenPrice={tokenPrice}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        parsedData={parsedData}
        isLoadingForecast={isLoadingForecast}
        isManage={isManage}
        cardVariant="cardPrimary"
      />
    </Card>
  )
}
