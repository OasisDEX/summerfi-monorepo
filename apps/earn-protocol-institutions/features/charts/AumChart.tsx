'use client'

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

import { ChartCross } from '@/features/charts/ChartCross'
import { CHART_TIMESTAMP_FORMAT_DETAILED, formatChartCryptoValue } from '@/features/charts/helpers'

import aumChartStyles from './AumChart.module.css'

export const AumChart = ({ chartData }: { chartData?: { timestamp: string; value: number }[] }) => {
  const legendFormatter = (value: string) => <span>{value.replace('value', 'AUM')}</span>

  return (
    <div className={aumChartStyles.aumChartWrapper}>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 20,
          }}
        >
          <XAxis
            dataKey="timestamp"
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
                ? `${val.map((v) => `${formatChartCryptoValue(Number(v))}`).join(' - ')}`
                : `${formatChartCryptoValue(Number(val))}`,
              (valueName as string).replace('value', 'AUM'),
            ]}
            labelFormatter={(value) => dayjs(value).format(CHART_TIMESTAMP_FORMAT_DETAILED)}
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
          <Legend
            iconType="circle"
            iconSize={10}
            align="center"
            layout="horizontal"
            height={30}
            wrapperStyle={{ bottom: '-10px' }}
            formatter={legendFormatter}
          />
          <Line
            dot={false}
            type="monotone"
            dataKey="value"
            stroke="#FF80BF"
            activeDot={false}
            connectNulls
            animationDuration={400}
            animateNewValues
          />
          <Customized component={<ChartCross />} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
