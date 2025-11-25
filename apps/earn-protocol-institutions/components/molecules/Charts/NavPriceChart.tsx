'use client'

import { useMemo } from 'react'
import { Card, RechartResponsiveWrapper } from '@summerfi/app-earn-ui'
import { type TimeframesType } from '@summerfi/app-types'
import { type NavPriceChartData } from '@summerfi/app-types/types/src/earn-protocol'
import dayjs from 'dayjs'
import { ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import {
  CHART_TIMESTAMP_FORMAT_DETAILED,
  CHART_TIMESTAMP_FORMAT_SHORT,
  formatChartCryptoValue,
  POINTS_REQUIRED_FOR_CHART,
} from '@/features/charts/helpers'

import navPriceChartStyles from './NavPriceChart.module.css'

type NavPriceChartProps = {
  chartData?: NavPriceChartData
  timeframe?: TimeframesType
}

export const NavPriceChart = ({ chartData, timeframe }: NavPriceChartProps) => {
  const defaultTimeframe = '7d'

  const parsedData = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!chartData) {
      return []
    }

    return chartData.data[timeframe ?? defaultTimeframe]
  }, [chartData, timeframe])

  const chartHidden = parsedData.length < POINTS_REQUIRED_FOR_CHART[timeframe ?? defaultTimeframe]

  return (
    <Card
      style={{
        marginTop: 'var(--spacing-space-medium)',
        flexDirection: 'column',
        padding: 0,
        position: 'relative',
      }}
      className={navPriceChartStyles.navPriceChartCardWrapper}
    >
      <div className={navPriceChartStyles.navPriceChart}>
        <RechartResponsiveWrapper height="340px">
          <ResponsiveContainer
            width={chartHidden ? '0' : '100%'}
            height="100%"
            style={
              chartHidden
                ? {
                    marginLeft: '0',
                  }
                : {
                    marginLeft: '-20px',
                  }
            }
          >
            <ComposedChart
              data={parsedData}
              margin={{
                top: chartHidden ? 0 : 20,
                right: 0,
                left: 10,
                bottom: 10,
              }}
              dataKey="navValue"
            >
              <XAxis
                dataKey="timestampParsed"
                fontSize={12}
                tickMargin={10}
                tickFormatter={(timestamp: string) => {
                  return timestamp.split(' ')[0]
                }}
                hide={chartHidden}
              />
              <YAxis
                strokeWidth={0}
                tickFormatter={(label: string) => {
                  return formatChartCryptoValue(Number(label))
                }}
                interval="preserveStartEnd"
                scale="linear"
                width={65}
                domain={[
                  (dataMin: number) => {
                    return Math.max(dataMin - Number(dataMin * 0.001), 0)
                  },
                  (dataMax: number) => {
                    return dataMax + Number(dataMax * 0.001)
                  },
                ]}
                hide={chartHidden}
              />
              {/* Tooltip is needed for the chart cross to work */}
              <Tooltip
                formatter={(val, valName) => {
                  return [
                    formatChartCryptoValue(Number(val)),
                    String(valName).replace('navValue', 'Net Asset Value'),
                  ]
                }}
                labelStyle={{
                  color: 'white',
                  fontSize: '12px',
                }}
                labelFormatter={(label: string) => {
                  const parsedTimestamp = dayjs(label)
                  const formattedDate = parsedTimestamp.format(
                    ['7d', '30d'].includes(timeframe ?? defaultTimeframe)
                      ? CHART_TIMESTAMP_FORMAT_DETAILED
                      : CHART_TIMESTAMP_FORMAT_SHORT,
                  )

                  return formattedDate
                }}
                contentStyle={{
                  borderRadius: '14px',
                  backgroundColor: 'var(--color-surface-subtle)',
                  border: 'none',
                }}
              />
              <Line
                dot={false}
                type="monotone"
                dataKey="navValue"
                stroke="#FF80BF"
                activeDot={false}
                connectNulls
                animationDuration={400}
                animateNewValues
                hide={chartHidden}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </RechartResponsiveWrapper>
      </div>
    </Card>
  )
}
