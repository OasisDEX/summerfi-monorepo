import { RechartResponsiveWrapper } from '@summerfi/app-earn-ui'
import { type PerformanceChartData, type TimeframesType } from '@summerfi/app-types'
import dayjs from 'dayjs'
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

import { NotEnoughData } from '@/components/organisms/Charts/components/NotEnoughData'
import { PerformanceLegend } from '@/components/organisms/Charts/components/PerformanceLegend'
import { historicalPerformanceLabelMap } from '@/components/organisms/Charts/labels'
import {
  CHART_TIMESTAMP_FORMAT_DETAILED,
  CHART_TIMESTAMP_FORMAT_SHORT,
  POINTS_REQUIRED_FOR_CHART,
} from '@/constants/charts'
import { formatChartCryptoValue } from '@/features/forecast/chart-formatters'
import { isStablecoin } from '@/helpers/is-stablecoin'

type PerformanceChartProps = {
  data?:
    | PerformanceChartData['forecast'][TimeframesType]
    | PerformanceChartData['historic'][TimeframesType]
  timeframe: TimeframesType
  inputToken: string
  showForecast: boolean
}

export const PerformanceChart = ({
  data,
  inputToken,
  showForecast,
  timeframe,
}: PerformanceChartProps) => {
  const chartHidden = !data || data.length < POINTS_REQUIRED_FOR_CHART[timeframe]

  return (
    <RechartResponsiveWrapper>
      {chartHidden && (
        <NotEnoughData
          style={{
            width: '100%',
            height: '340px',
            marginTop: '35px',
            backgroundColor: 'var(--color-surface-subtle)',
          }}
        />
      )}
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart
          data={data}
          margin={{
            top: 30,
            right: 0,
            left: 0,
            bottom: 10,
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
            tickFormatter={(label: string) =>
              `${formatChartCryptoValue(Number(label), !isStablecoin(inputToken))}`
            }
            scale="linear"
            width={80}
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
            formatter={(val, valueName) => [
              Array.isArray(val)
                ? `${val.map((v) => `${formatChartCryptoValue(Number(v))}`).join(' - ')} ${inputToken}`
                : `${formatChartCryptoValue(Number(val))} ${inputToken}`,
              historicalPerformanceLabelMap[valueName] ?? valueName,
            ]}
            labelFormatter={(value) =>
              dayjs(value).format(
                timeframe === '7d' || timeframe === '30d'
                  ? CHART_TIMESTAMP_FORMAT_DETAILED
                  : CHART_TIMESTAMP_FORMAT_SHORT,
              )
            }
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
          {showForecast ? (
            <>
              <Area
                type="natural"
                dataKey="bounds"
                stroke="none"
                legendType="none"
                fill="#8D3360"
                dot={false}
                activeDot={false}
                animationDuration={200}
                animationBegin={200}
                animateNewValues
              />
              <Line
                dot={false}
                type="natural"
                dataKey="forecast"
                stroke="#FF80BF"
                activeDot={false}
                connectNulls
                animationDuration={400}
                strokeDasharray="5 5"
                animateNewValues
              />
            </>
          ) : (
            <>
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
            </>
          )}
          {data?.length && (
            <Legend
              content={<PerformanceLegend showForecast={showForecast} />}
              iconType="circle"
              iconSize={10}
              align="center"
              layout="horizontal"
              height={30}
              wrapperStyle={{ bottom: '-10px' }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </RechartResponsiveWrapper>
  )
}
