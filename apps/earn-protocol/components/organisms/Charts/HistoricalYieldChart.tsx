'use client'

import { useMemo, useState } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import { type CardVariant } from '@summerfi/app-earn-ui/dist/types/src/components/atoms/Card/Card'
import { type TimeframesType } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { ComparisonChart } from '@/components/organisms/Charts/ComparisonChart'

const dataNames = ['Summer Strategy']

const colors = {
  'Summer Strategy-color': '#FF49A4',
}

export const HistoricalYieldChart = ({
  aprHourlyList,
  cardVariant = 'cardSecondary',
}: {
  cardVariant?: CardVariant
  aprHourlyList: string[]
}) => {
  const [compare, setCompare] = useState(true)
  const [timeframe, setTimeframe] = useState<TimeframesType>('90d')
  const _unused = setTimeframe

  const parsedData = useMemo(() => {
    const now = dayjs().startOf('hour')

    return [...aprHourlyList]
      .reverse()
      .map((item, itemIndex) => ({
        name: now.subtract(itemIndex, 'hour').format('MMM DD, HH:mm'),
        'Summer Strategy': new BigNumber(item).toFixed(2),
      }))
      .reverse()
  }, [aprHourlyList])

  return (
    <Card
      variant={cardVariant}
      style={{ marginTop: 'var(--spacing-space-medium)', flexDirection: 'column' }}
    >
      <ChartHeader
        compare={compare}
        setCompare={setCompare}
        timeframe={timeframe}
        setTimeframe={(_nextTimeFrame) => null}
      />
      <ComparisonChart
        timeframe={timeframe}
        colors={colors}
        data={parsedData}
        compare={compare}
        dataNames={dataNames}
      />
    </Card>
  )
}
