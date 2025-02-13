import { RechartResponsiveWrapper } from '@summerfi/app-earn-ui'
import { type TimeframesType } from '@summerfi/app-types'
import dayjs from 'dayjs'
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
import { type CategoricalChartState } from 'recharts/types/chart/types'

import { PerformanceLegend } from '@/components/organisms/Charts/components/PerformanceLegend'
import { historicalPerformanceLabelMap } from '@/components/organisms/Charts/labels'
import { CHART_TIMESTAMP_FORMAT } from '@/constants/charts'
import { formatChartCryptoValue } from '@/features/forecast/chart-formatters'

export type PerformanceChartProps = {
  data: unknown[]
  timeframe: TimeframesType
  inputToken: string
}

const CustomizedCross = (props: CategoricalChartState) => {
  const { formattedGraphicalItems, prevData, offset } = props

  const meetingPointIndex = prevData?.findIndex(
    (item) => 'bounds' in item && 'forecast' in item && 'netValue' in item,
  )
  const [firstSeries] = formattedGraphicalItems
  const meetingPoint = firstSeries.props?.points[meetingPointIndex ?? 0] ?? { x: 0, y: 0 }
  const textStyle = {
    color: '#777576',
    fontFamily: 'var(--font-inter)',
    fontSize: '12px',
    fontWeight: '600',
  }

  if (!meetingPoint) {
    return null
  }

  return (
    <>
      {meetingPoint.x - 60 > 60 && (
        // hides historic text if it's too close to the left edge
        <text x={meetingPoint.x - 60} y={offset?.top ?? 5} style={textStyle}>
          Historic
        </text>
      )}
      <text x={meetingPoint.x + 15} y={offset?.top ?? 5} style={textStyle}>
        Forecast
      </text>
      <line
        // historic/forecast line
        x1={meetingPoint.x}
        x2={meetingPoint.x}
        y1={(offset?.top ?? 5) - 10}
        y2={`calc(100% - ${offset?.bottom}px)`}
        stroke="#474747"
        strokeWidth={2}
        strokeDasharray="5 10"
      />
      <line
        // forecast deposit line
        x1={meetingPoint.x}
        x2={`calc(100% - ${offset?.right}px)`}
        y1={meetingPoint.y}
        y2={meetingPoint.y}
        stroke="#3D3D3D"
        strokeWidth={2}
        strokeDasharray="5 10"
      />
    </>
  )
}

export const PerformanceChart = ({ data, inputToken }: PerformanceChartProps) => {
  return (
    <RechartResponsiveWrapper>
      <ResponsiveContainer width="100%" height="90%" minHeight={300} minWidth={100}>
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
            interval="preserveStartEnd"
            scale="linear"
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
          <Customized component={<CustomizedCross />} />
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
              content={<PerformanceLegend />}
              iconType="circle"
              iconSize={10}
              align="center"
              layout="horizontal"
              height={60}
              wrapperStyle={{ bottom: '-10px' }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </RechartResponsiveWrapper>
  )
}
