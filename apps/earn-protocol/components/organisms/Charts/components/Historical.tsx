import { useState } from 'react'
import { getPositionValues, RechartResponsiveWrapper } from '@summerfi/app-earn-ui'
import {
  type IArmadaPosition,
  type SDKVaultishType,
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
import { formatChartCryptoValue } from '@/features/forecast/chart-formatters'

export type HistoricalChartProps = {
  data?: unknown[]
  tokenSymbol: TokenSymbolsList
  position: {
    positionData: IArmadaPosition
    vaultData: SDKVaultishType
  }
}

export const HistoricalChart = ({ data, tokenSymbol, position }: HistoricalChartProps) => {
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

  return (
    <RechartResponsiveWrapper>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{
            top: 30,
            right: 0,
            left: 0,
            bottom: 10,
          }}
          onMouseMove={({ activePayload }) => {
            if (activePayload) {
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
          />
          <YAxis
            strokeWidth={0}
            tickFormatter={(label: string) => `${formatChartCryptoValue(Number(label))}`}
            domain={['dataMin', 'dataMax + 5']}
          />
          {/* Cursor is needed for the chart cross to work */}
          <Tooltip content={() => null} cursor={false} />
          <Customized component={<ChartCross />} />
          <Line
            dot={false}
            type="monotone"
            dataKey="netValue"
            stroke="#FF80BF"
            activeDot={false}
            connectNulls
            animationDuration={400}
            animateNewValues
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
