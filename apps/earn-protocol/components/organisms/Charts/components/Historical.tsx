import { RechartResponsiveWrapper } from '@summerfi/app-earn-ui'
import { type TimeframesType } from '@summerfi/app-types'
import dayjs from 'dayjs'
import { ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { PerformanceLegend } from '@/components/organisms/Charts/components/PerformanceLegend'
import { CHART_TIMESTAMP_FORMAT } from '@/constants/charts'
import { formatChartCryptoValue } from '@/features/forecast/chart-formatters'

export type HistoricalChartProps = {
  data: unknown[]
  timeframe: TimeframesType
}

export const HistoricalChart = ({ data }: HistoricalChartProps) => {
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
            domain={['dataMin', 'dataMax + 5']}
          />
          <Tooltip
            formatter={(val) =>
              Array.isArray(val)
                ? val.map((v) => `${formatChartCryptoValue(Number(v))}`).join(' - ')
                : `${formatChartCryptoValue(Number(val))}`
            }
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
          <Legend
            content={<PerformanceLegend />}
            iconType="circle"
            iconSize={10}
            align="center"
            layout="horizontal"
            height={60}
            wrapperStyle={{ bottom: '-10px' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </RechartResponsiveWrapper>
  )
}
