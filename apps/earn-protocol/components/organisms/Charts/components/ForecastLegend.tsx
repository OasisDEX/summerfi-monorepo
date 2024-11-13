import { DefaultLegendContent, type LegendProps } from 'recharts'

export const ForecastLegend = ({ payload, ref: _ref, ...rest }: LegendProps) => {
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
