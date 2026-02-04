import { DefaultLegendContent, type DefaultLegendContentProps } from 'recharts'

const performanceLegendLabelMap: {
  [key: string]: string
} = {
  forecast: 'Forecast Market Value',
  netValue: 'Market Value',
  depositedValue: 'Net Contributions',
  bounds: 'Forecast Bounds',
}

export const PerformanceLegend = ({
  payload,
  showForecast,
  ...rest
}: DefaultLegendContentProps & { showForecast: boolean }) => {
  const nextPayload = payload
    ?.filter(({ value }) => {
      if (showForecast && value && ['depositedValue', 'netValue'].includes(value)) {
        return false
      }
      if (!showForecast && value && ['bounds', 'forecast'].includes(value)) {
        return false
      }

      return true
    })
    .map(({ dataKey: _dataKey, inactive: _inactive, ...entry }) => ({
      // dataKey and inactive should not be here, react is throwing errors because of them
      ...entry,
      color: 'white',
      legendIcon: <circle cx="10" cy="10" r="10" fill={entry.color} />,
      value: performanceLegendLabelMap[entry.value as string] ?? entry.value,
    }))

  return <DefaultLegendContent payload={nextPayload} {...rest} />
}
