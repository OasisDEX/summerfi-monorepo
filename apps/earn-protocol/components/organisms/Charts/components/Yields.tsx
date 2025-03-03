import { useState } from 'react'
import { RechartResponsiveWrapper } from '@summerfi/app-earn-ui'
import { type ArksHistoricalChartData, type TimeframesType } from '@summerfi/app-types'
import {
  Area,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { formatChartPercentageValue } from '@/features/forecast/chart-formatters'

type YieldsChartProps = {
  data: ArksHistoricalChartData['data'][TimeframesType]
  dataNames: string[]
  colors: { [key: string]: string }
  timeframe: TimeframesType
  summerVaultName: string
}

export const YieldsChart = ({ data, dataNames, colors, summerVaultName }: YieldsChartProps) => {
  const [highlightedProtocol, setHighlightedProtocol] = useState<string>()
  const xAxisInterval = Math.ceil(data.length / 7)

  return (
    <RechartResponsiveWrapper>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart
          data={data}
          margin={{
            top: 50,
            right: 0,
            left: 0,
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
            interval={xAxisInterval}
            tickMargin={10}
            tickFormatter={(timestamp: string) => {
              return timestamp.split(' ')[0]
            }}
          />
          <YAxis
            strokeWidth={0}
            tickFormatter={(label: string) => `${formatChartPercentageValue(Number(label))}`}
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
          />
          {dataNames.map((dataName, dataIndex) => {
            return dataName === summerVaultName ? (
              <Area
                key={dataName}
                type={data.length > 100 ? 'linear' : 'natural'}
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
                type={data.length > 100 ? 'linear' : 'natural'}
                animationId={dataIndex}
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
                connectNulls
              />
            )
          })}
          <Legend
            onMouseEnter={({ dataKey }) => {
              setHighlightedProtocol(dataKey as string)
            }}
            onMouseLeave={() => {
              setHighlightedProtocol(undefined)
            }}
            wrapperStyle={{
              userSelect: 'none',
              padding: '20px 40px 0',
              fontSize: '14px',
            }}
            iconType="circle"
            iconSize={10}
            align="center"
            layout="horizontal"
            height={60}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </RechartResponsiveWrapper>
  )
}
