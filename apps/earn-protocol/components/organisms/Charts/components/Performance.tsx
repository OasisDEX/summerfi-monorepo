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

import { PerformanceLegend } from '@/components/organisms/Charts/components/PerformanceLegend'
import { historicalPerformanceLabelMap } from '@/components/organisms/Charts/labels'
import { CHART_TIMESTAMP_FORMAT } from '@/constants/charts'
import { formatChartCryptoValue } from '@/features/forecast/chart-formatters'

export type PerformanceChartProps = {
  data:
    | PerformanceChartData['forecast'][TimeframesType]
    | PerformanceChartData['historic'][TimeframesType]
  timeframe: TimeframesType
  inputToken: string
  showForecast: boolean
}

export const PerformanceChart = ({ data, inputToken, showForecast }: PerformanceChartProps) => {
  return (
    <RechartResponsiveWrapper>
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
            tickFormatter={(label: string) => `${formatChartCryptoValue(Number(label))}`}
            scale="linear"
            width={80}
            domain={[
              (dataMin: number) => {
                return Math.max(dataMin - 2, 0)
              },
              (dataMax: number) => {
                return Math.min(dataMax + 2, dataMax * 2)
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
            labelFormatter={(label) => dayjs(label).format(CHART_TIMESTAMP_FORMAT)}
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
          <Area
            type="natural"
            dataKey="bounds"
            stroke="none"
            legendType="none"
            fill="#8D3360"
            connectNulls
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
          {data.length && (
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
