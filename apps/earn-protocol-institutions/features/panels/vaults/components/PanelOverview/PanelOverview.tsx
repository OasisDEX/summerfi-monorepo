'use client'

import { useMemo, useState } from 'react'
import { Card, LoadingSpinner, Table, Text } from '@summerfi/app-earn-ui'
import { type TimeframesType } from '@summerfi/app-types'

import { ArkHistoricalYieldChart } from '@/components/molecules/Charts/ArkHistoricalYieldChart'
import { AumChart } from '@/components/molecules/Charts/AumChart'
import { ChartHeader } from '@/components/molecules/Charts/ChartHeader'
import { NavPriceChart } from '@/components/molecules/Charts/NavPriceChart'
import { useVaultOverviewChartsQuery } from '@/features/panels/vaults/api/get-vault-overview-charts-data'
import { type GetInstitutionDataQuery } from '@/graphql/clients/institution/client'
import { useInView } from '@/hooks/use-in-view'
import { useTimeframes } from '@/hooks/useTimeframes'

import styles from './PanelOverview.module.css'

const ChartLoading = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '315px',
      width: '100%',
    }}
  >
    <LoadingSpinner size={64} />
  </div>
)

export const PanelOverview = ({
  summerVaultName,
  vaultAddress,
  institutionBasicData,
  institutionName,
  network,
}: {
  summerVaultName: string
  vaultAddress: string
  institutionBasicData: GetInstitutionDataQuery | undefined
  institutionName: string
  network: string
}) => {
  const { ref, isInView } = useInView<HTMLDivElement>()
  const { data, isLoading } = useVaultOverviewChartsQuery(
    institutionName,
    network,
    vaultAddress,
    isInView,
  )

  const navChartData = data?.navChartData
  const aumChartData = data?.aumChartData
  const arksHistoricalChartData = data?.arksHistoricalChartData
  const chartsLoading = !isInView || isLoading

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
      <div ref={ref} className={styles.panelOverviewItem}>
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
          {chartsLoading ? (
            <ChartLoading />
          ) : (
            <NavPriceChart
              chartData={navChartData}
              timeframe={timeframe}
              syncId="vault-overview-performance-chart"
            />
          )}
        </Card>
        <Text as="h5" variant="h5">
          APY
        </Text>
        <Card>
          {chartsLoading ? (
            <ChartLoading />
          ) : (
            <ArkHistoricalYieldChart
              chartData={arksHistoricalChartData}
              summerVaultName={summerVaultName}
              timeframe={timeframe}
              compare={compare}
              syncId="vault-overview-performance-chart"
            />
          )}
        </Card>
      </div>
      <div className={styles.panelOverviewItem}>
        <Text as="h5" variant="h5">
          AUM
        </Text>
        <Card>
          {chartsLoading ? (
            <ChartLoading />
          ) : (
            <AumChart
              chartData={aumChartData}
              timeframe={timeframe}
              syncId="vault-overview-performance-chart"
            />
          )}
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
