import { LoadingSpinner } from '@summerfi/app-earn-ui'
import { type ForecastDataPoint } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
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

type ForecastChartProps = {
  data: ForecastDataPoint
  isLoading?: boolean
}

export const ForecastChart = ({ data, isLoading = true }: ForecastChartProps) => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      {isLoading && <LoadingSpinner size={200} fast={!!data} />}
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart
          data={data}
          style={{ opacity: isLoading ? 0.5 : 1 }}
          margin={{
            top: 50,
            right: 0,
            left: 30,
            bottom: 0,
          }}
        >
          <XAxis
            dataKey="timestamp"
            fontSize={12}
            interval={Math.floor(data.length / 5)}
            tickMargin={10}
          />
          <YAxis strokeWidth={0} width={45} tickFormatter={formatCryptoBalance} />
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
          <Area
            type="monotone"
            dataKey="bounds"
            stroke="none"
            legendType="none"
            fill="rgba(255, 73, 164, 0.1)"
            connectNulls
            dot={false}
            activeDot={false}
            animationDuration={200}
          />
          <Line
            dot={false}
            type="natural"
            dataKey="forecast"
            stroke="#ff00ff"
            connectNulls
            animationDuration={200}
          />
          <Legend iconType="circle" iconSize={8} align="center" layout="horizontal" height={60} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
