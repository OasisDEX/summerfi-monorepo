import { useState } from 'react'
import { RechartResponsiveWrapper } from '@summerfi/app-earn-ui'
import { type ArksHistoricalChartData, type TimeframesType } from '@summerfi/app-types'
import {
  Area,
  ComposedChart,
  Line,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { formatChartPercentageValue } from '@/features/forecast/chart-formatters'

import { YieldsLegend } from './YieldsLegend'

type YieldsChartProps = {
  data: ArksHistoricalChartData['data'][TimeframesType]
  dataNames: string[]
  filteredDataList?: string[]
  colors: { [key: string]: string }
  timeframe: TimeframesType
  summerVaultName: string
  isSelectingZoom?: boolean
  selectionZoomStart?: number | null
  selectionZoomEnd?: number | null
  selectionHandlers?: {
    handleMouseDown: (ev: unknown) => void
    handleMouseMove: (ev: unknown) => void
    handleMouseUp: () => void
  }
}

export const YieldsChart = ({
  data,
  dataNames,
  colors,
  summerVaultName,
  isSelectingZoom = false,
  selectionZoomStart = null,
  selectionZoomEnd = null,
  selectionHandlers,
  filteredDataList,
}: YieldsChartProps) => {
  const [highlightedProtocol, setHighlightedProtocol] = useState<string>()

  return (
    <>
      <RechartResponsiveWrapper height="450px">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            onMouseDown={selectionHandlers?.handleMouseDown}
            onMouseMove={selectionHandlers?.handleMouseMove}
            onMouseUp={selectionHandlers?.handleMouseUp}
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
                display: isSelectingZoom ? 'none' : 'block',
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
                  hide={filteredDataList && !filteredDataList.includes(dataName)}
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
                  hide={filteredDataList && !filteredDataList.includes(dataName)}
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
            {isSelectingZoom && selectionZoomStart !== null && selectionZoomEnd !== null && (
              <ReferenceArea
                x1={data[selectionZoomStart]?.timestamp}
                x2={data[selectionZoomEnd]?.timestamp}
                strokeOpacity={0.3}
                fillOpacity={0.2}
                fill="#FF49A4"
                stroke="#FF49A4"
              />
            )}
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
    </>
  )
}
