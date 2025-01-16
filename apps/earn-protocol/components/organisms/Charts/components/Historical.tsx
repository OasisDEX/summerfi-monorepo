import { useState } from 'react'
import { getPositionValues, RechartResponsiveWrapper } from '@summerfi/app-earn-ui'
import {
  type IArmadaPosition,
  type SDKVaultishType,
  type TimeframesType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import {
  ComposedChart,
  Customized,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ChartCross } from '@/components/organisms/Charts/components/ChartCross'
import { HistoricalLegend } from '@/components/organisms/Charts/components/HistoricalLegend'
import { NotEnoughData } from '@/components/organisms/Charts/components/NotEnoughData'
import { DAYS_TO_WAIT_FOR_CHART, POINTS_REQUIRED_FOR_CHART } from '@/constants/charts'
import { formatChartCryptoValue } from '@/features/forecast/chart-formatters'

export type HistoricalChartProps = {
  data?: unknown[]
  tokenSymbol: TokenSymbolsList
  position: {
    positionData: IArmadaPosition
    vaultData: SDKVaultishType
  }
  timeframe: TimeframesType
}

export const HistoricalChart = ({
  data,
  tokenSymbol,
  position,
  timeframe,
}: HistoricalChartProps) => {
  const { netDeposited, netEarnings } = getPositionValues(position)
  const legendBaseData = {
    netValue: `$${formatCryptoBalance(netEarnings)}`,
    depositedValue: `$${formatCryptoBalance(netDeposited)}`,
    earnings: `$${formatCryptoBalance(netEarnings.minus(netDeposited))}`,
    sumrEarned: `TBD `,
  }
  const [highlightedData, setHighlightedData] = useState<{
    [key: string]: string | number
  }>(legendBaseData)

  const chartHidden = !data || data.length < POINTS_REQUIRED_FOR_CHART[timeframe]

  return (
    <RechartResponsiveWrapper height="340px">
      {chartHidden && (
        <NotEnoughData
          daysToWait={DAYS_TO_WAIT_FOR_CHART}
          style={{
            width: '80%',
            backgroundColor: 'var(--color-surface-subtle)',
          }}
        />
      )}
      <ResponsiveContainer
        width={chartHidden ? '30%' : '100%'}
        height="100%"
        style={
          chartHidden
            ? {
                marginLeft: '70%',
              }
            : {}
        }
      >
        <ComposedChart
          data={data}
          margin={{
            top: chartHidden ? 0 : 20,
            right: 0,
            left: 0,
            bottom: 10,
          }}
          onMouseMove={({ activePayload }) => {
            if (activePayload && !chartHidden) {
              setHighlightedData((prevData) => ({
                ...prevData,
                ...activePayload.reduce(
                  (acc, { dataKey, value }) => ({
                    ...acc,
                    [dataKey]: `$${formatCryptoBalance(value)}`,
                  }),
                  {},
                ),
              }))
            }
          }}
          onMouseLeave={() => {
            setHighlightedData(legendBaseData)
          }}
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
            tickFormatter={(label: string) => `${formatChartCryptoValue(Number(label))}`}
            domain={['dataMin', 'dataMax + 5']}
            hide={chartHidden}
          />
          {/* Cursor is needed for the chart cross to work */}
          <Tooltip content={() => null} cursor={false} />
          {!chartHidden ? <Customized component={<ChartCross />} /> : null}
          <Line
            dot={false}
            type="monotone"
            dataKey="netValue"
            stroke="#FF80BF"
            activeDot={false}
            connectNulls
            animationDuration={400}
            animateNewValues
            hide={chartHidden}
          />
          <Line
            dot={false}
            type="stepAfter"
            dataKey="depositedValue"
            stroke="#FF49A4"
            activeDot={false}
            connectNulls
            animationDuration={400}
            animateNewValues
            hide={chartHidden}
          />
          {data?.length && (
            <Legend
              content={
                <HistoricalLegend tokenSymbol={tokenSymbol} highlightedData={highlightedData} />
              }
              iconType="circle"
              iconSize={10}
              align="right"
              verticalAlign="top"
              layout="vertical"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </RechartResponsiveWrapper>
  )
}
