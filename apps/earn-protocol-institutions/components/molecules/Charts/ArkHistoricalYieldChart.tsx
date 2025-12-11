'use client'

import { useMemo, useState } from 'react'
import { Card, RechartResponsiveWrapper } from '@summerfi/app-earn-ui'
import { type ArksHistoricalChartData, type TimeframesType } from '@summerfi/app-types'
import dayjs from 'dayjs'
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { YieldsLegend } from '@/components/molecules/Charts/YieldsLegend'
import {
  CHART_TIMESTAMP_FORMAT_DETAILED,
  CHART_TIMESTAMP_FORMAT_SHORT,
  formatChartPercentageValue,
  POINTS_REQUIRED_FOR_CHART,
} from '@/features/charts/helpers'

import arkHistoricalChartStyles from './ArkHistoricalYieldChart.module.css'

type ArkHistoricalYieldChartProps = {
  chartData?: ArksHistoricalChartData
  summerVaultName: string
  timeframe: TimeframesType
  compare: boolean
  syncId?: string
}

export const ArkHistoricalYieldChart = ({
  chartData,
  summerVaultName,
  timeframe,
  compare,
  syncId,
}: ArkHistoricalYieldChartProps) => {
  const colors = {
    [`${summerVaultName}`]: '#FF49A4',
    ...chartData?.colors,
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const dataNames = [summerVaultName, ...(compare ? chartData?.dataNames ?? [] : [])]

  const parsedData = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!chartData) {
      return []
    }

    if (!compare) {
      return chartData.data[timeframe].map((point) => ({
        timestamp: point.timestamp,
        [summerVaultName]: point[summerVaultName],
      }))
    }

    return chartData.data[timeframe]
  }, [timeframe, chartData, compare, summerVaultName])

  const parsedDataWithCutoff =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    !chartData || chartData.data['7d'].length <= POINTS_REQUIRED_FOR_CHART['7d'] ? [] : parsedData

  const [highlightedProtocol, setHighlightedProtocol] = useState<string>()

  return (
    <Card
      style={{
        flexDirection: 'column',
      }}
      className={arkHistoricalChartStyles.arkHistoricalYieldChartCardWrapper}
    >
      <div className={arkHistoricalChartStyles.arkHistoricalYieldChart}>
        <RechartResponsiveWrapper height="270px">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              syncId={syncId}
              data={parsedDataWithCutoff}
              margin={{
                top: 20,
                right: 20,
                left: 10,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="summerYieldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF49A4" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#333333" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timestamp"
                fontSize={12}
                interval="preserveStartEnd"
                tickMargin={10}
                tickFormatter={(timestamp: string) => {
                  return timestamp.split(' ')[0]
                }}
                style={{
                  userSelect: 'none',
                }}
              />
              <YAxis
                strokeWidth={0}
                tickFormatter={(label: string) => `${formatChartPercentageValue(Number(label))}`}
                style={{
                  userSelect: 'none',
                }}
              />
              <Tooltip
                formatter={(val) => `${formatChartPercentageValue(Number(val), true)}`}
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
                labelFormatter={(label: string) => {
                  const parsedTimestamp = dayjs(label)
                  const formattedDate = parsedTimestamp.format(
                    ['7d', '30d'].includes(timeframe)
                      ? CHART_TIMESTAMP_FORMAT_DETAILED
                      : CHART_TIMESTAMP_FORMAT_SHORT,
                  )

                  return formattedDate
                }}
              />
              {dataNames.map((dataName, dataIndex) => {
                return dataName === summerVaultName ? (
                  <Area
                    key={dataName}
                    type={parsedDataWithCutoff.length > 100 ? 'linear' : 'natural'}
                    animationDuration={300}
                    animationBegin={dataIndex * 50}
                    animationEasing="ease-out"
                    connectNulls
                    dataKey={dataName}
                    strokeWidth={highlightedProtocol === dataName ? 2 : 1}
                    stroke={colors[dataName as keyof typeof colors]}
                    opacity={highlightedProtocol && highlightedProtocol !== dataName ? 0.1 : 1}
                    fillOpacity={1}
                    style={{
                      transition: 'opacity 0.3s',
                    }}
                    fill="url(#summerYieldGradient)"
                  />
                ) : (
                  <Line
                    key={dataName}
                    type="monotone"
                    animationDuration={300}
                    animationBegin={dataIndex * 50}
                    animationEasing="ease-out"
                    dataKey={dataName}
                    stroke={colors[dataName as keyof typeof colors]}
                    strokeWidth={highlightedProtocol === dataName ? 2 : 1}
                    style={{
                      transition: 'opacity 0.3s',
                    }}
                    opacity={highlightedProtocol && highlightedProtocol !== dataName ? 0.1 : 1}
                    dot={false}
                  />
                )
              })}
            </ComposedChart>
          </ResponsiveContainer>
        </RechartResponsiveWrapper>
        <YieldsLegend
          dataNames={dataNames}
          colors={colors}
          highlightedProtocol={highlightedProtocol}
          onMouseEnter={setHighlightedProtocol}
          onMouseLeave={() => setHighlightedProtocol(undefined)}
        />
      </div>
    </Card>
  )
}
