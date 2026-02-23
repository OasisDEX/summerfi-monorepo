'use client'

import { type ReactNode, useMemo } from 'react'
import { RechartResponsiveWrapper } from '@summerfi/app-earn-ui'
import { type MultipleSourceChartData, type TimeframesType } from '@summerfi/app-types'
import dayjs from 'dayjs'
import { Area, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import {
  CHART_TIMESTAMP_FORMAT_DETAILED,
  CHART_TIMESTAMP_FORMAT_SHORT,
  formatChartCryptoValue,
} from '@/features/charts/helpers'

import tvlChartStyles from './TvlChart.module.css'

type TvlChartProps = {
  chartData?: MultipleSourceChartData
  timeframe?: TimeframesType
  syncId?: string
  stacked: boolean
}

export const TvlChart = ({ chartData, timeframe, syncId, stacked }: TvlChartProps) => {
  const defaultTimeframe = '7d'

  const parsedData = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!chartData) {
      return []
    }

    return chartData.data[timeframe ?? defaultTimeframe]
  }, [chartData, timeframe])

  const stackedAreaComponents = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!chartData?.colors || !chartData?.dataNames) {
      return null
    }

    return chartData.colors.map((color, index) => {
      return (
        <Area
          key={`Tvl_Area_${color}`}
          type="monotone"
          dataKey={chartData.dataNames[index]}
          stroke={color}
          strokeWidth={2}
          fill={color}
          fillOpacity={0.5}
          stackId={stacked ? 'Tvl_Stack_ID' : undefined}
          dot={false}
          animationDuration={500}
        />
      )
    })
  }, [chartData, stacked])

  return (
    <div className={tvlChartStyles.tvlChart}>
      <RechartResponsiveWrapper height="350px">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            syncId={syncId}
            data={parsedData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 10,
            }}
            dataKey="netValue"
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
              tickFormatter={(label: string) => {
                return Number(label) > 0 ? `$${formatChartCryptoValue(Number(label))}` : '0'
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
            />
            <Tooltip
              formatter={(val, valName) => {
                return [
                  formatChartCryptoValue(Number(val)),
                  String(valName).replace('netValue', 'Assets Under Management'),
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
                const formattedDate = parsedTimestamp.format(
                  ['7d', '30d'].includes(timeframe ?? defaultTimeframe)
                    ? CHART_TIMESTAMP_FORMAT_DETAILED
                    : CHART_TIMESTAMP_FORMAT_SHORT,
                )

                return formattedDate
              }}
            />
            {stackedAreaComponents}
          </ComposedChart>
        </ResponsiveContainer>
      </RechartResponsiveWrapper>
    </div>
  )
}
