import { RechartResponsiveWrapper } from '@summerfi/app-earn-ui'
import { type TimeframesType } from '@summerfi/app-types'
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

import { formatChartPercentageValue } from '@/features/forecast/chart-formatters'

type YieldsChartProps = {
  data: unknown[]
  dataNames: string[]
  colors: { [key: string]: string }
  timeframe: TimeframesType
}

export const YieldsChart = ({ data, dataNames, colors }: YieldsChartProps) => {
  return (
    <RechartResponsiveWrapper>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart
          data={data}
          margin={{
            top: 50,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="summerYieldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF49A4" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#333333" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" fontSize={12} interval={2} tickMargin={10} />
          <YAxis
            strokeWidth={0}
            tickFormatter={(label: string) => `${formatChartPercentageValue(Number(label))}`}
          />
          <Tooltip
            formatter={(val) => `${formatChartPercentageValue(Number(val), true)}`}
            useTranslate3d
            contentStyle={{
              zIndex: 1000,
              backgroundColor: 'var(--color-surface-subtler)',
              borderRadius: '5px',
              padding: '20px 30px',
              border: 'none',
            }}
          />
          {dataNames.map((dataName, dataIndex) =>
            dataName === 'Summer Strategy' ? (
              <Area
                key={dataName}
                type="natural"
                animationDuration={300}
                animationBegin={dataIndex * 50}
                animationEasing="ease-out"
                dataKey={dataName}
                strokeWidth={1}
                stroke={colors[`${dataName}-color` as keyof typeof colors]}
                fillOpacity={1}
                fill="url(#summerYieldGradient)"
              />
            ) : (
              <Line
                key={dataName}
                type="natural"
                animationId={dataIndex}
                animationDuration={300}
                animationBegin={dataIndex * 50}
                animationEasing="ease-out"
                dataKey={dataName}
                strokeDasharray="3 3"
                stroke={colors[`${dataName}-color` as keyof typeof colors]}
                strokeWidth={0}
                dot={false}
                connectNulls
              />
            ),
          )}
          <Legend iconType="circle" iconSize={8} align="center" layout="horizontal" height={60} />
        </ComposedChart>
      </ResponsiveContainer>
    </RechartResponsiveWrapper>
  )
}
