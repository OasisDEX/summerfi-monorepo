import { LoadingSpinner, RechartResponsiveWrapper } from '@summerfi/app-earn-ui'
import { type ForecastDataPoints } from '@summerfi/app-types'
import {
  Area,
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
import { ForecastLegend } from '@/components/organisms/Charts/components/ForecastLegend'
import { ForecastTooltip } from '@/components/organisms/Charts/components/ForecastTooltip'
import { formatChartCryptoValue, formatChartDate } from '@/features/forecast/chart-formatters'

type ForecastChartProps = {
  data: ForecastDataPoints
  isLoading?: boolean
  tokenPrice?: string | null
}

export const ForecastChart = ({ data, isLoading, tokenPrice }: ForecastChartProps) => {
  return (
    <RechartResponsiveWrapper>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={data} style={{ opacity: isLoading ? 0.5 : 1 }}>
          <XAxis
            dataKey="timestamp"
            fontSize={12}
            tickFormatter={formatChartDate}
            interval={Math.ceil(data.length / 6)}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            strokeWidth={0}
            width={70}
            interval="preserveStartEnd"
            scale="linear"
            tickFormatter={(label: string) => formatChartCryptoValue(Number(label))}
            startOffset={20}
            domain={['dataMin', 'dataMax']}
            padding={{
              top: 20,
              bottom: 20,
            }}
          />
          <Tooltip
            content={<ForecastTooltip tokenPrice={tokenPrice} />}
            cursor={false}
            offset={20}
            allowEscapeViewBox={{ y: true }}
            wrapperStyle={{ top: '-80%', opacity: isLoading ? 0 : 1 }}
          />
          <Area
            type="natural"
            dataKey="bounds"
            stroke="none"
            legendType="none"
            fill="rgba(255, 73, 164, 0.1)"
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
          <Legend
            content={<ForecastLegend />}
            iconType="circle"
            iconSize={14}
            align="center"
            layout="horizontal"
            wrapperStyle={{ bottom: '-10px' }}
          />
          <Customized component={<ChartCross graphicalItemIndex={1} />} />
        </ComposedChart>
      </ResponsiveContainer>
      {isLoading && (
        <LoadingSpinner
          size={100}
          appear
          color="#ff49a4"
          fast={!!data.length}
          style={{
            position: 'absolute',
            top: 'calc(50% - 50px)',
            left: 'calc(50% - 50px)',
          }}
        />
      )}
    </RechartResponsiveWrapper>
  )
}
