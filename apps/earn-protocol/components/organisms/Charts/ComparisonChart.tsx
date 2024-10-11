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

type ComparisonChartProps = {
  data: unknown[]
  dataNames: string[]
  colors: { [key: string]: string }
  compare: boolean
  timeframe: TimeframesType
}

export const ComparisonChart = ({ data, dataNames, colors, compare }: ComparisonChartProps) => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
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

          <XAxis dataKey="name" fontSize={12} interval={0} />
          <YAxis strokeWidth={0} width={45} tickFormatter={(label: string) => `${label}%`} />
          <Tooltip
            formatter={(val) => `${Number(val).toFixed(2)}`}
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
            dataName === 'Summer USDS Strategy' ? (
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
                animationId={dataIndex}
                key={dataName}
                animationDuration={300}
                animationBegin={dataIndex * 50}
                animationEasing="ease-out"
                type="natural"
                dataKey={dataName}
                strokeDasharray="3 3"
                stroke={colors[`${dataName}-color` as keyof typeof colors]}
                strokeWidth={compare ? 1 : 0}
                dot={false}
                connectNulls
              />
            ),
          )}
          <Legend iconType="circle" iconSize={8} align="center" layout="horizontal" height={60} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
