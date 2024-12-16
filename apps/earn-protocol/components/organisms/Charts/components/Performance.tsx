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

type PerformanceChartProps = {
  data: ({
    name: number
  } & (
    | {
        value: number
        deposits: number
      }
    | {
        bounds: [number, number]
        forecast: number
      }
  ))[]
  timeframe: TimeframesType
}

const mockData: PerformanceChartProps['data'] = [
  { name: 16803072000000, value: 1300 + Number(Math.random() * 150), deposits: 1300 }, // 2023-04-01
  { name: 16828992000000, value: 1400 + Number(Math.random() * 150), deposits: 1300 }, // 2023-05-01
  { name: 16855776000000, value: 1500 + Number(Math.random() * 150), deposits: 1300 }, // 2023-06-01
  { name: 16881696000000, value: 1600 + Number(Math.random() * 180), deposits: 1300 }, // 2023-07-01
  { name: 16908480000000, value: 1700 + Number(Math.random() * 200), deposits: 1300 }, // 2023-08-01
  { name: 16935264000000, value: 1800 + Number(Math.random() * 210), deposits: 1300 }, // 2023-09-01
  { name: 16961184000000, value: 1900 + Number(Math.random() * 220), deposits: 1300 }, // 2023-10-01
  { name: 16987968000000, value: 2000 + Number(Math.random() * 230), deposits: 1450 }, // 2023-11-01
  // forecast starts here
  { name: 17013888000000, value: 2300, deposits: 1450, bounds: [2299, 2301], forecast: 2300 }, // 2023-12-01
  {
    name: 17067456000000,
    deposits: 1450,
    bounds: [2200, 2400],
    forecast: 2300 + Number(Math.random() * 50),
  }, // 2024-02-01
  {
    name: 17067456000000,
    deposits: 1450,
    bounds: [2300, 2500],
    forecast: 2400 + Number(Math.random() * 50),
  }, // 2024-03-01
]

export const PerformanceChart = (_props: PerformanceChartProps) => {
  return (
    <RechartResponsiveWrapper>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart
          data={mockData}
          margin={{
            top: 50,
            right: 0,
            left: 0,
            bottom: 10,
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
            tickFormatter={(label: string) => `${formatChartPercentageValue(Number(label))}`}
          />
          <Tooltip
            formatter={(val) => `${formatChartPercentageValue(Number(val), true)}`}
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
            fill="rgba(255, 73, 164, 0.4)"
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
            animateNewValues
          />
          <Line
            dot={false}
            type="natural"
            dataKey="value"
            stroke="#FF80BF"
            activeDot={false}
            connectNulls
            animationDuration={400}
            animateNewValues
          />
          <Line
            dot={false}
            type="step"
            dataKey="deposits"
            stroke="#FF80BF"
            activeDot={false}
            connectNulls
            animationDuration={400}
            animateNewValues
          />
          <Legend
            wrapperStyle={{
              userSelect: 'none',
              padding: '20px 40px 0',
              fontSize: '14px',
            }}
            iconType="circle"
            iconSize={10}
            align="center"
            layout="horizontal"
            height={60}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </RechartResponsiveWrapper>
  )
}
