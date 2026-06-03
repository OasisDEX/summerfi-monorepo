'use client'

import { type ReactNode, useMemo } from 'react'
import { RechartResponsiveWrapper } from '@summerfi/app-earn-ui'
import { type MultipleSourceChartData, type TimeframesType } from '@summerfi/app-types'
import dayjs from 'dayjs'
import { ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import {
  CHART_TIMESTAMP_FORMAT_DETAILED,
  CHART_TIMESTAMP_FORMAT_SHORT,
  formatChartCryptoValue,
} from '@/features/charts/helpers'

import multiNavPriceChartStyles from './NavPriceChart.module.css'

type MultiNavPriceChartProps = {
  chartData?: MultipleSourceChartData
  timeframe?: TimeframesType
  syncId?: string
}

export const MultiNavPriceChart = ({ chartData, timeframe, syncId }: MultiNavPriceChartProps) => {
  const defaultTimeframe = '7d'

  const parsedData = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!chartData) {
      return []
    }

    return chartData.data[timeframe ?? defaultTimeframe]
  }, [chartData, timeframe])

  const lineComponents = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!chartData?.colors || !chartData?.dataNames) {
      return null
    }

    return chartData.colors.map((color, index) => (
      <Line
        key={`NavLine_${color}`}
        dot={false}
        type="monotone"
        dataKey={chartData.dataNames[index]}
        stroke={color}
        strokeWidth={2}
        activeDot={false}
        connectNulls
        animationDuration={400}
        animateNewValues
      />
    ))
  }, [chartData])

  return (
    <div className={multiNavPriceChartStyles.navPriceChart}>
      <RechartResponsiveWrapper height="270px">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            syncId={syncId}
            data={parsedData}
            margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
          >
            <XAxis
              dataKey="timestampParsed"
              fontSize={12}
              tickMargin={10}
              tickFormatter={(timestamp: string) => timestamp.split(' ')[0]}
            />
            <YAxis
              strokeWidth={0}
              interval="preserveStartEnd"
              scale="linear"
              width={65}
              domain={[
                (dataMin: number) => Math.max(dataMin - Number(dataMin * 0.001), 0),
                (dataMax: number) => dataMax + Number(dataMax * 0.001),
              ]}
            />
            <Tooltip
              formatter={(val, valName) => [
                formatChartCryptoValue(Number(val)),
                String(valName).replace('navPrice', 'Net Asset Value'),
              ]}
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
                  ['7d', '30d'].includes(timeframe ?? defaultTimeframe)
                    ? CHART_TIMESTAMP_FORMAT_DETAILED
                    : CHART_TIMESTAMP_FORMAT_SHORT,
                )
              }}
            />
            {lineComponents}
          </ComposedChart>
        </ResponsiveContainer>
      </RechartResponsiveWrapper>
    </div>
  )
}
