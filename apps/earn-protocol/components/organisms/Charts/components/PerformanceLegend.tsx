import { DefaultLegendContent, type LegendProps } from 'recharts'

const performanceLegendLabelMap: {
  [key: string]: string
} = {
  forecast: 'Forecast Market Value',
  netValue: 'Market Value',
  depositedValue: 'Net Contributions',
  bounds: 'Forecast Bounds',
}

export const PerformanceLegend = ({ payload, ref: _ref, ...rest }: LegendProps) => {
  const nextPayload = payload?.map(({ dataKey: _dataKey, inactive: _inactive, ...entry }) => ({
    // dataKey and inactive should not be here, react is throwing errors because of them
    ...entry,
    color: 'white',
    legendIcon: <circle cx="10" cy="10" r="10" fill={entry.color} />,
    value: performanceLegendLabelMap[entry.value as string] ?? entry.value,
  }))

  return <DefaultLegendContent payload={nextPayload} {...rest} />
}
