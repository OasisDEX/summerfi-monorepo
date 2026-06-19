'use client'

import { type ReactNode, useMemo, useState } from 'react'
import { Card, RechartResponsiveWrapper } from '@summerfi/app-earn-ui'
import { type SingleSourceChartData, type TimeframesType } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'
import dayjs from 'dayjs'
import { ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { NotEnoughData } from '@/components/organisms/Charts/components/NotEnoughData'
import { CHART_TIMESTAMP_FORMAT_DETAILED, CHART_TIMESTAMP_FORMAT_SHORT } from '@/constants/charts'
import { formatChartCryptoValue } from '@/features/forecast/chart-formatters'
import { getRwaNavApySeries } from '@/helpers/chart-helpers/get-rwa-nav-apy-series'
import { useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'
import { useTimeframes } from '@/hooks/use-timeframes'

type RwaNavPriceChartProps = {
  chartData?: SingleSourceChartData
  chartId: string
}

export const RwaNavPriceChart = ({ chartData, chartId }: RwaNavPriceChartProps) => {
  const buttonClickEventHandler = useHandleButtonClickEvent()
  // Switch between the raw NAV price line and an annualised-APY line derived locally from it.
  const [showApy, setShowApy] = useState(false)
  const { timeframe, setTimeframe, timeframes } = useTimeframes({
    chartData: chartData?.data,
  })

  const navData = useMemo(() => {
    if (!chartData) {
      return []
    }

    return chartData.data[timeframe]
  }, [chartData, timeframe])

  // APY annualised over the selected timeframe (re-based on the window's first NAV point), computed
  // locally from the NAV series — recomputed when the timeframe changes.
  const apyData = useMemo(() => getRwaNavApySeries(navData), [navData])

  const dataKey = showApy ? 'apy' : 'navPrice'
  const parsedData = showApy ? apyData : navData
  const hasData = parsedData.some((point) => dataKey in point)

  const handleSetNextTimeframe = (nextTimeframe: string) => {
    setTimeframe(nextTimeframe as TimeframesType)
    buttonClickEventHandler(`${chartId}-rwa-nav-price-chart-timeframe-set-${nextTimeframe}`)
  }

  const handleToggleApy = (nextShowApy: boolean) => {
    setShowApy(nextShowApy)
    buttonClickEventHandler(`${chartId}-rwa-nav-price-chart-${nextShowApy ? 'apy' : 'nav'}-view`)
  }

  return (
    <Card
      style={{
        marginTop: 'var(--spacing-space-medium)',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {!hasData && <NotEnoughData />}
      <ChartHeader
        timeframes={timeframes}
        timeframe={timeframe}
        setTimeframe={handleSetNextTimeframe}
        checkboxLabel="APY"
        checkboxValue={showApy}
        setCheckboxValue={handleToggleApy}
      />
      <RechartResponsiveWrapper height="270px">
        <ResponsiveContainer
          width="100%"
          height="100%"
          style={{
            marginLeft: '-20px',
          }}
        >
          <ComposedChart
            data={parsedData}
            margin={{
              top: 20,
              right: 0,
              left: 10,
              bottom: 10,
            }}
            dataKey={dataKey}
          >
            <XAxis
              dataKey="timestampParsed"
              fontSize={12}
              tickMargin={10}
              tickFormatter={(timestamp: string) => {
                return timestamp.split(' ')[0]
              }}
            />
            <YAxis
              strokeWidth={0}
              fontSize={12}
              interval="preserveStartEnd"
              tickFormatter={(label: string) =>
                showApy
                  ? formatDecimalAsPercent(Number(label))
                  : formatChartCryptoValue(Number(label))
              }
              scale="linear"
              tickCount={10}
              width={55}
              domain={
                showApy
                  ? ['auto', 'auto']
                  : [
                      (dataMin: number) => {
                        return Math.max(dataMin - Number(dataMin * 0.001), 0)
                      },
                      (dataMax: number) => {
                        return dataMax + Number(dataMax * 0.001)
                      },
                    ]
              }
            />
            <Tooltip
              formatter={(val, valName) => {
                return showApy
                  ? [formatDecimalAsPercent(Number(val)), 'APY']
                  : [
                      formatCryptoBalance(Number(val)),
                      String(valName).replace('navPrice', 'Net Asset Value'),
                    ]
              }}
              wrapperStyle={{
                zIndex: 1000,
                backgroundColor: 'var(--color-surface-subtle)',
                borderRadius: '5px',
                padding: '10px',
              }}
              labelStyle={{
                fontSize: '16px',
                fontWeight: '700',
                marginTop: '10px',
                marginBottom: '10px',
              }}
              contentStyle={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '13px',
                lineHeight: '11px',
                letterSpacing: '-0.5px',
              }}
              labelFormatter={(label: ReactNode) => {
                if (typeof label !== 'string') {
                  return label
                }
                const parsedTimestamp = dayjs(label)

                return parsedTimestamp.format(
                  ['7d', '30d'].includes(timeframe)
                    ? CHART_TIMESTAMP_FORMAT_DETAILED
                    : CHART_TIMESTAMP_FORMAT_SHORT,
                )
              }}
            />
            <Line
              dot={false}
              type="monotone"
              dataKey={dataKey}
              stroke="#FF80BF"
              activeDot={false}
              connectNulls
              animationDuration={400}
              animateNewValues
            />
          </ComposedChart>
        </ResponsiveContainer>
      </RechartResponsiveWrapper>
    </Card>
  )
}
