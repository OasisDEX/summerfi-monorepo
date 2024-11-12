'use client'

import { useMemo, useState } from 'react'
import { type TimeframesType } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'

import { YieldsChart } from '@/components/organisms/Charts/DumbCharts/Yields'

const dataNames = ['Summer Strategy']

const colors = {
  'Summer Strategy-color': '#FF49A4',
}

export const HistoricalYieldChart = ({ aprHourlyList }: { aprHourlyList: string[] }) => {
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
    <YieldsChart timeframe={timeframe} colors={colors} data={parsedData} dataNames={dataNames} />
  )
}
