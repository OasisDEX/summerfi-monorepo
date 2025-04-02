'use client'

import { useMemo, useState } from 'react'
import { Card, type CardVariant } from '@summerfi/app-earn-ui'
import { type TimeframesType } from '@summerfi/app-types'
import { memoize, random } from 'lodash-es'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { ComparisonChart } from '@/components/organisms/Charts/components/Comparison'

const dataNames = [
  'Median Defi Yield',
  'Median Aave Lending',
  'Median Morpho Lending',
  'Median USDS',
  'Summer USDS Strategy',
]

const colors = {
  'Median Defi Yield-color': '#777576',
  'Median Aave Lending-color': '#B6509E',
  'Median Morpho Lending-color': '#5786FE',
  'Median USDS-color': '#D8762D',
  'Summer USDS Strategy-color': '#FF49A4',
}

const data = memoize(
  // just to simulate data change
  (_timeframe) => [
    {
      name: 'Jun 2024',
      'Median Defi Yield': random(0, 1, true),
      'Median Aave Lending': random(0, 1, true),
      'Median Morpho Lending': random(0, 1, true),
      'Median USDS': random(0, 1, true),
      'Summer USDS Strategy': random(0, 2, true),
    },
    {
      name: 'Jul 2024',
      'Median Defi Yield': random(0, 3, true),
      'Median Aave Lending': random(0, 3, true),
      'Median Morpho Lending': random(0, 3, true),
      'Median USDS': random(0, 3, true),
      'Summer USDS Strategy': random(1, 3, true),
    },
    {
      name: 'Aug 2024',
      'Median Defi Yield': random(1, 7, true),
      'Median Aave Lending': random(1, 7, true),
      'Median Morpho Lending': random(1, 7, true),
      'Median USDS': random(1, 7, true),
      'Summer USDS Strategy': random(1, 7, true),
    },
    {
      name: 'Sep 2024',
      'Median Defi Yield': random(2, 9, true),
      'Median Aave Lending': random(2, 9, true),
      'Median Morpho Lending': random(2, 9, true),
      'Median USDS': random(2, 9, true),
      'Summer USDS Strategy': random(6, 14, true),
    },
    {
      name: 'Oct 2024',
      'Median Defi Yield': random(1, 8, true),
      'Median Aave Lending': random(1, 8, true),
      'Median Morpho Lending': random(1, 8, true),
      'Median USDS': random(1, 8, true),
      'Summer USDS Strategy': random(7, 15, true),
    },
    {
      name: 'Nov 2024',
      'Median Defi Yield': random(1, 8, true),
      'Median Aave Lending': random(1, 8, true),
      'Median Morpho Lending': random(1, 8, true),
      'Median USDS': random(1, 8, true),
      'Summer USDS Strategy': random(7, 15, true),
    },
    {
      name: 'Dec 2024',
      'Median Defi Yield': random(3, 12, true),
      'Median Aave Lending': random(3, 12, true),
      'Median Morpho Lending': random(3, 12, true),
      'Median USDS': random(3, 12, true),
      'Summer USDS Strategy': random(7, 15, true),
    },
  ],
  // just to simulate data change
  (timeframe) => timeframe,
)

export const MockedLineChart = ({
  cardVariant = 'cardSecondary',
}: {
  cardVariant?: CardVariant
}) => {
  const [compare, setCompare] = useState(true)
  const [timeframe, setTimeframe] = useState<TimeframesType>('3y')

  // just to simulate data change
  const simulatedData = useMemo(() => ({ timeframe, data: data(timeframe) }), [timeframe])

  return (
    <Card
      variant={cardVariant}
      style={{ marginTop: 'var(--spacing-space-medium)', flexDirection: 'column' }}
    >
      <ChartHeader
        timeframes={{
          '7d': true,
          '30d': true,
          '90d': true,
          '6m': true,
          '1y': true,
          '3y': true,
        }}
        checkboxValue={compare}
        setCheckboxValue={(nextCompare) => setCompare(nextCompare)}
        checkboxLabel="Compare to others"
        timeframe={timeframe}
        setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
      />
      <ComparisonChart
        timeframe={timeframe}
        colors={colors}
        data={simulatedData.data}
        compare={compare}
        dataNames={dataNames}
      />
    </Card>
  )
}
