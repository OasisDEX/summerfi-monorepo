import { type ReactNode, useEffect, useState } from 'react'
import {
  getDisplayToken,
  getPositionValues,
  RechartResponsiveWrapper,
  useHoldAlt,
  useMobileCheck,
  useSumrRewardsToDate,
} from '@summerfi/app-earn-ui'
import {
  type ChartDataPoints,
  type IArmadaPosition,
  type SDKVaultishType,
  type TimeframesType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import dayjs from 'dayjs'
import {
  type ActiveDotProps,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  useActiveTooltipDataPoints,
  useIsTooltipActive,
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

import historicalChartStyles from './Historical.module.css'

type HistoricalChartProps = {
  data?: ChartDataPoints[]
  tokenSymbol: TokenSymbolsList
  portfolioPosition: {
    position: IArmadaPosition
    vault: SDKVaultishType
  }
  timeframe: TimeframesType
}

type LegendData = {
  netValue: string
  netValueRaw?: number | string
  depositedValue: string
  earnings: string
  sumrEarned: string
}

const renderNetValueChartCross = (dotProps: ActiveDotProps) => {
  return <ChartCross coordinateDataKeySelector="netValue" {...dotProps} />
}

const TooltipDataIntermediary = ({
  legendBaseData,
  setHighlightedData,
  positionToken,
}: {
  legendBaseData: LegendData
  setHighlightedData: (data: LegendData) => void
  positionToken: string
}) => {
  const isTooltipActive = useIsTooltipActive()
  const activeData = useActiveTooltipDataPoints<LegendData>()

  useEffect(() => {
    if (isTooltipActive) {
      if (activeData?.[0]) {
        setHighlightedData({
          netValue: `${formatCryptoBalance(activeData[0].netValue)} ${positionToken}`,
          netValueRaw: Number(activeData[0].netValue),
          depositedValue: `${formatCryptoBalance(activeData[0].depositedValue)} ${positionToken}`,
          earnings: legendBaseData.earnings,
          sumrEarned: legendBaseData.sumrEarned,
        })
      }
    } else {
      setHighlightedData(legendBaseData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTooltipActive, activeData])

  return null
}

const NetValueTooltip = ({
  formattedDate,
  netValue,
}: {
  formattedDate: string
  netValue: string | number | undefined
}) => {
  return (
    <div>
      Net value on {formattedDate}: {netValue}
    </div>
  )
}

export const HistoricalChart = ({
  data,
  tokenSymbol,
  portfolioPosition,
  timeframe,
}: HistoricalChartProps) => {
  const isAltPressed = useHoldAlt()
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

  const [highlightedData, setHighlightedData] = useState<LegendData>(legendBaseData)

  const chartHidden = !data || data.length < POINTS_REQUIRED_FOR_CHART[timeframe]

  const handleLabelFormatter = (label: ReactNode) => {
    if (typeof label !== 'string') {
      return label
    }
    const parsedTimestamp = dayjs(label)
    const formattedDate = parsedTimestamp.format(
      ['7d', '30d'].includes(timeframe)
        ? CHART_TIMESTAMP_FORMAT_DETAILED
        : CHART_TIMESTAMP_FORMAT_SHORT,
    )

    if (isAltPressed) {
      return (
        <NetValueTooltip formattedDate={formattedDate} netValue={highlightedData.netValueRaw} />
      )
    }

    return formattedDate
  }

  return (
    <div className={historicalChartStyles.historicalChartWrapper}>
      <RechartResponsiveWrapper height="340px">
        {chartHidden && (
          <NotEnoughData
            style={{
              backgroundColor: 'var(--color-surface-subtle)',
            }}
          />
        )}
        <ResponsiveContainer
          width={chartHidden ? 0 : '100%'}
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
            data={data}
            margin={{
              top: chartHidden ? 0 : 20,
              right: 0,
              left: 10,
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
              hide={chartHidden}
            />
            <YAxis
              strokeWidth={0}
              tickFormatter={(label: string) => formatChartCryptoValue(Number(label))}
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
              labelFormatter={handleLabelFormatter}
              contentStyle={{
                borderRadius: '14px',
                backgroundColor: 'var(--color-surface-subtle)',
                border: 'none',
              }}
              cursor={false}
            />
            <Line
              dot={false}
              type="monotone"
              dataKey="netValue"
              stroke="#FF80BF"
              activeDot={renderNetValueChartCross}
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
            <TooltipDataIntermediary
              setHighlightedData={setHighlightedData}
              legendBaseData={legendBaseData}
              positionToken={positionToken}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </RechartResponsiveWrapper>
      <HistoricalLegend
        tokenSymbol={tokenSymbol}
        highlightedData={highlightedData}
        isMobile={isMobile}
      />
    </div>
  )
}
