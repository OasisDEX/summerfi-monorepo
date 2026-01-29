'use client'

import { useMemo, useState } from 'react'
import { Card, Table, Text } from '@summerfi/app-earn-ui'
import { type TimeframesType } from '@summerfi/app-types'
import {
  type ArksHistoricalChartData,
  type SingleSourceChartData,
} from '@summerfi/app-types/types/src/earn-protocol'

import { ArkHistoricalYieldChart } from '@/components/molecules/Charts/ArkHistoricalYieldChart'
import { AumChart } from '@/components/molecules/Charts/AumChart'
import { ChartHeader } from '@/components/molecules/Charts/ChartHeader'
import { NavPriceChart } from '@/components/molecules/Charts/NavPriceChart'
import { type GetInstitutionDataQuery } from '@/graphql/clients/institution/client'
import { useTimeframes } from '@/hooks/useTimeframes'

import styles from './PanelOverview.module.css'

export const PanelOverview = ({
  navChartData,
  aumChartData,
  arksHistoricalChartData,
  summerVaultName,
  vaultAddress,
  institutionBasicData,
}: {
  navChartData?: SingleSourceChartData
  aumChartData?: SingleSourceChartData
  arksHistoricalChartData?: ArksHistoricalChartData
  summerVaultName: string
  vaultAddress: string
  institutionBasicData: GetInstitutionDataQuery | undefined
}) => {
  const { timeframe, setTimeframe, timeframes } = useTimeframes({
    chartData: navChartData?.data,
  })

  const [compare, setCompare] = useState(false)

  const aqAddress = useMemo(() => {
    return institutionBasicData?.institution?.admiralsQuarters ?? ''
  }, [institutionBasicData])

  const hcAddress = useMemo(() => {
    return institutionBasicData?.institution?.harborCommand ?? ''
  }, [institutionBasicData])

  return (
    <Card variant="cardSecondary" className={styles.panelOverviewWrapper}>
      <div className={styles.panelOverviewItem}>
        <div className={styles.panelOverviewHeader}>
          <Text as="h5" variant="h5">
            Performance
          </Text>
          <ChartHeader
            timeframes={timeframes}
            timeframe={timeframe}
            setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
            wrapperStyle={{
              width: '70%',
              justifyContent: 'space-between',
            }}
            checkboxValue={compare}
            setCheckboxValue={setCompare}
            checkboxLabel="Show ark APYs"
          />
        </div>
        <Card>
          <NavPriceChart
            chartData={navChartData}
            timeframe={timeframe}
            syncId="vault-overview-performance-chart"
          />
        </Card>
        <Text as="h5" variant="h5">
          APY
        </Text>
        <Card>
          <ArkHistoricalYieldChart
            chartData={arksHistoricalChartData}
            summerVaultName={summerVaultName}
            timeframe={timeframe}
            compare={compare}
            syncId="vault-overview-performance-chart"
          />
        </Card>
      </div>
      <div className={styles.panelOverviewItem}>
        <Text as="h5" variant="h5">
          AUM
        </Text>
        <Card>
          <AumChart
            chartData={aumChartData}
            timeframe={timeframe}
            syncId="vault-overview-performance-chart"
          />
        </Card>
      </div>
      <div className={styles.panelOverviewItem}>
        <Text as="h5" variant="h5">
          Contracts
        </Text>
        <Card>
          <Table
            columns={[
              {
                key: 'contract',
                title: 'Contract',
              },
              {
                key: 'address',
                title: 'Address',
              },
            ]}
            rows={[
              {
                content: {
                  contract: 'Fleet',
                  address: <span style={{ fontFamily: 'monospace' }}>{vaultAddress}</span>,
                },
              },
              {
                content: {
                  contract: 'Admirals Quarters',
                  address: <span style={{ fontFamily: 'monospace' }}>{aqAddress}</span>,
                },
              },
              {
                content: {
                  contract: 'Harbor Command',
                  address: <span style={{ fontFamily: 'monospace' }}>{hcAddress}</span>,
                },
              },
            ]}
          />
        </Card>
      </div>
    </Card>
  )
}
