'use client'
import { useState } from 'react'
import { Card, LoadingSpinner, Text } from '@summerfi/app-earn-ui'
import { type MultipleSourceChartData, type TimeframesType } from '@summerfi/app-types'

import { ChartHeader } from '@/components/molecules/Charts/ChartHeader'
import { TvlChart } from '@/components/molecules/Charts/TvlChart'
import { useTimeframes } from '@/hooks/useTimeframes'

import panelInstitutionOverviewStyles from './PanelInstitutionOverview.module.css'

export const TvlChartIntermediary = ({
  vaultsTvlChartData,
  isLoading,
}: {
  vaultsTvlChartData?: MultipleSourceChartData
  isLoading?: boolean
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
      {isLoading ? (
        <div className={panelInstitutionOverviewStyles.tvlChartLoading}>
          <LoadingSpinner size={64} />
        </div>
      ) : (
        <TvlChart chartData={vaultsTvlChartData} timeframe={timeframe} stacked={stacked} />
      )}
    </Card>
  )
}
