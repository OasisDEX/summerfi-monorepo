import { useState } from 'react'
import {
  getDisplayToken,
  getPositionValues,
  RechartResponsiveWrapper,
  useMobileCheck,
  useSumrRewardsToDate,
} from '@summerfi/app-earn-ui'
import {
  type IArmadaPosition,
  type SDKVaultishType,
  type TimeframesType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import dayjs from 'dayjs'
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
import {
  CHART_TIMESTAMP_FORMAT_DETAILED,
  CHART_TIMESTAMP_FORMAT_SHORT,
  POINTS_REQUIRED_FOR_CHART,
} from '@/constants/charts'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { formatChartCryptoValue } from '@/features/forecast/chart-formatters'

type HistoricalChartProps = {
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

  const sumrRewards = useSumrRewardsToDate(portfolioPosition.position)

  const legendBaseData = {
    netValue: `${formatCryptoBalance(netValue)} ${positionToken}`,
    depositedValue: `${formatCryptoBalance(netDeposited)} ${positionToken}`,
    earnings: `${formatCryptoBalance(netEarnings)} ${positionToken}`,
    sumrEarned: `${formatCryptoBalance(sumrRewards)} SUMR`,
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
                  (acc, { dataKey, value, payload: { timestamp } }) => ({
                    ...acc,
                    timestamp,
                    timeframe,
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
            formatter={() => {
              return ''
            }}
            itemStyle={{
              display: 'none',
            }}
            labelStyle={{
              color: 'white',
              fontSize: '12px',
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
            contentStyle={{
              borderRadius: '14px',
              backgroundColor: 'var(--color-surface-subtle)',
              border: 'none',
            }}
          />
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
        </ComposedChart>
      </ResponsiveContainer>
    </RechartResponsiveWrapper>
  )
}
