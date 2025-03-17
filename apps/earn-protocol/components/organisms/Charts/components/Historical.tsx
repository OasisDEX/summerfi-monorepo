import { useState } from 'react'
import {
  getDisplayToken,
  getPositionValues,
  RechartResponsiveWrapper,
  useMobileCheck,
} from '@summerfi/app-earn-ui'
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
import { POINTS_REQUIRED_FOR_CHART } from '@/constants/charts'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { formatChartCryptoValue } from '@/features/forecast/chart-formatters'

export type HistoricalChartProps = {
  data?: unknown[]
  tokenSymbol: TokenSymbolsList
  portfolioPosition: {
    position: IArmadaPosition
    vault: SDKVaultishType
  }
  timeframe: TimeframesType
}

export const HistoricalChart = ({
  data,
  tokenSymbol,
  portfolioPosition,
  timeframe,
}: HistoricalChartProps) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const { netValue, netDeposited, netEarnings } = getPositionValues(portfolioPosition)
  const positionToken = getDisplayToken(portfolioPosition.vault.inputToken.symbol)

  const legendBaseData = {
    netValue: `${formatCryptoBalance(netValue)} ${positionToken}`,
    depositedValue: `${formatCryptoBalance(netDeposited)} ${positionToken}`,
    earnings: `${formatCryptoBalance(netEarnings)} ${positionToken}`,
    // sumrEarned: `TBD `,
  }
  const [highlightedData, setHighlightedData] = useState<{
    [key: string]: string | number
  }>(legendBaseData)

  const chartHidden = !data || data.length < POINTS_REQUIRED_FOR_CHART[timeframe]

  return (
    <RechartResponsiveWrapper height="340px">
      {chartHidden && (
        <NotEnoughData
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
            : {
                marginLeft: '-20px',
              }
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
                    [dataKey]: `${formatCryptoBalance(value)} ${positionToken}`,
                  }),
                  {},
                ),
              }))
            }
          }}
          onMouseLeave={() => {
            setHighlightedData(legendBaseData)
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
            hide={chartHidden}
          />
          <YAxis
            strokeWidth={0}
            tickFormatter={(label: string) => `${formatChartCryptoValue(Number(label))}`}
            interval="preserveStartEnd"
            scale="linear"
            domain={[
              (dataMin: number) => {
                return Math.max(dataMin - 2, 0)
              },
              (dataMax: number) => {
                return Math.min(dataMax + 2, dataMax * 2)
              },
            ]}
            hide={chartHidden}
          />
          {/* Tooltip is needed for the chart cross to work */}
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
              align={isMobile ? 'center' : 'right'}
              verticalAlign={isMobile ? 'bottom' : 'top'}
              layout="vertical"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </RechartResponsiveWrapper>
  )
}
