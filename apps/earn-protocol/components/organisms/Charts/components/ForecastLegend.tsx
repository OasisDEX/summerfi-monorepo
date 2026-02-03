import { DefaultLegendContent, type DefaultLegendContentProps } from 'recharts'

export const ForecastLegend = ({ payload, ref: _ref, ...rest }: DefaultLegendContentProps) => {
  const nextPayload = payload
    ?.filter((entry) => entry.dataKey !== 'bounds')
    .map(({ dataKey: _dataKey, inactive: _inactive, ...entry }) => ({
      // dataKey and inactive should not be here, react is throwing errors because of them
      ...entry,
      color: 'white',
      legendIcon: <circle cx="10" cy="10" r="10" fill="#FF80BF" />,
      value: entry.value === 'forecast' ? 'Forecast Market Value' : entry.value,
    }))

  return <DefaultLegendContent payload={nextPayload} {...rest} />
}
