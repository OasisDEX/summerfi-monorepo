'use client'
import { useState } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'
import { type TimeframesType } from '@summerfi/app-types'
import { type MultipleSourceChartData } from '@summerfi/app-types/types/src/earn-protocol'

import { ChartHeader } from '@/components/molecules/Charts/ChartHeader'
import { TvlChart } from '@/components/molecules/Charts/TvlChart'
import { useTimeframes } from '@/hooks/useTimeframes'

import panelInstitutionOverviewStyles from './PanelInstitutionOverview.module.css'

export const TvlChartIntermediary = ({
  vaultsTvlChartData,
}: {
  vaultsTvlChartData?: MultipleSourceChartData
}) => {
  const { timeframe, setTimeframe, timeframes } = useTimeframes({
    chartData: vaultsTvlChartData?.data,
  })
  const [stacked, setStacked] = useState(true)

  return (
    <Card variant="cardSecondary" className={panelInstitutionOverviewStyles.yourVaultsWrapper}>
      <div className={panelInstitutionOverviewStyles.tvlHeader}>
        <Text as="h5" variant="h5">
          Total Value Locked
        </Text>
        <ChartHeader
          timeframes={timeframes}
          timeframe={timeframe}
          setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
          wrapperStyle={{
            width: '65%',
            justifyContent: 'space-between',
          }}
          checkboxValue={stacked}
          setCheckboxValue={setStacked}
          checkboxLabel="Stacked"
        />
      </div>
      <TvlChart chartData={vaultsTvlChartData} timeframe={timeframe} stacked={stacked} />
    </Card>
  )
}
