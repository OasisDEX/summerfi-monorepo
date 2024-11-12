import { Fragment } from 'react'
import { Box, LoadingSpinner, Text } from '@summerfi/app-earn-ui'
import { type ForecastDataPoint } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import {
  Area,
  ComposedChart,
  DefaultLegendContent,
  Legend,
  type LegendProps,
  Line,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'
import {
  type NameType as TooltipNameType,
  type ValueType as TooltipValueType,
} from 'recharts/types/component/DefaultTooltipContent'

type ForecastChartProps = {
  data: ForecastDataPoint
  isLoading?: boolean
}

const ForecastTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<TooltipValueType, TooltipNameType>) => {
  return active ? (
    <Box style={{ display: 'flex', flexDirection: 'column' }}>
      <Text variant="p3">{label}</Text>
      {payload?.map((entry, index) => (
        <Fragment key={`item-${index}`}>
          {Array.isArray(entry.value) ? (
            <>
              <Text as="p" variant="p3">
                Lower Bound: {formatCryptoBalance(entry.value[0])}
              </Text>
              <Text as="p" variant="p3">
                Upper Bound: {formatCryptoBalance(entry.value[1])}
              </Text>
            </>
          ) : (
            <Text as="p" variant="p3">
              Forecast: {formatCryptoBalance(entry.value as string | number)}
            </Text>
          )}
        </Fragment>
      ))}
    </Box>
  ) : null
}

const ForecastLegend = ({ payload, ref: _ref, ...rest }: LegendProps) => {
  const nextPayload = payload
    ?.filter((entry) => entry.dataKey !== 'bounds')
    .map((entry) => ({
      ...entry,
      color: 'white',
      legendIcon: <circle cx="10" cy="10" r="10" fill="#FF80BF" />,
      value: entry.value === 'forecast' ? 'Forecast Market Value' : entry.value,
    }))

  return <DefaultLegendContent payload={nextPayload} {...rest} />
}

export const ForecastChart = ({ data, isLoading }: ForecastChartProps) => {
  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart
          data={data}
          style={{ opacity: isLoading ? 0.5 : 1 }}
          margin={{
            top: 50,
            right: 0,
            left: 0,
            bottom: -30,
          }}
        >
          <XAxis
            dataKey="timestamp"
            fontSize={12}
            interval={Math.floor(data.length / 5)}
            tickMargin={20}
          />
          <YAxis
            strokeWidth={0}
            width={70}
            tickFormatter={formatCryptoBalance}
            padding={{
              top: 20,
              bottom: 20,
            }}
          />
          <Tooltip
            content={<ForecastTooltip />}
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
            animationBegin={100}
            animateNewValues
          />
          <Line
            dot={false}
            type="natural"
            dataKey="forecast"
            stroke="#FF80BF"
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
            wrapperStyle={{
              paddingTop: 40,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      {isLoading && (
        <LoadingSpinner
          size={100}
          color="#ff49a4"
          fast={!!data.length}
          style={{
            position: 'absolute',
            top: 'calc(50% - 50px)',
            left: 'calc(50% - 50px)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </div>
  )
}
