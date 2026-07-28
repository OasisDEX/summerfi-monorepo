'use client'
import { type FC } from 'react'
import { Card, Expander, getUniqueVaultId, Text, VaultExposure } from '@summerfi/app-earn-ui'
import {
  type ArksHistoricalChartData,
  type InterestRates,
  type SDKVaultishType,
  type SDKVaultType,
  type VaultApyData,
} from '@summerfi/app-types'
import {
  formatDecimalAsPercent,
  getVaultNiceName,
  sdkNetworkToHumanNetwork,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'

import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { VaultExposureDescription } from '@/components/molecules/VaultExposureDescription/VaultExposureDescription'
import { ArkHistoricalYieldChart } from '@/components/organisms/Charts/ArkHistoricalYieldChart'
import { vaultExposureColumnsToHideOpenManage } from '@/constants/tables'
import { CurationActivity } from '@/features/curation-activity/components/CurationActivity/CurationActivity'
import { type VaultCurationEvent } from '@/features/curation-activity/types'
import { LatestActivity } from '@/features/latest-activity/components/LatestActivity/LatestActivity'
import { RebalancingActivity } from '@/features/rebalance-activity/components/RebalancingActivity/RebalancingActivity'
import { getManagementFee } from '@/helpers/get-management-fee'

import { getDetailsLinks } from './vault-details-links'
import { VaultOpenHeaderBlock } from './VaultOpenHeaderBlock'

import styles from './VaultOpenViewDetails.module.css'

interface VaultOpenViewDetailsProps {
  vault: SDKVaultType | SDKVaultishType
  topDepositors: TopDepositorsPagination
  latestActivity: LatestActivityPagination
  rebalanceActivity: RebalanceActivityPagination
  curationEvents?: VaultCurationEvent[]
  arksHistoricalChartData?: ArksHistoricalChartData
  arksInterestRates: InterestRates
  vaultApyData: VaultApyData
  isDaoManaged?: boolean
}

export const VaultOpenViewDetails: FC<VaultOpenViewDetailsProps> = ({
  vault,
  latestActivity,
  topDepositors,
  rebalanceActivity,
  curationEvents = [],
  arksHistoricalChartData,
  arksInterestRates,
  vaultApyData,
  isDaoManaged,
}) => {
  const summerVaultName = getVaultNiceName({ vault })
  const vaultBenchmarkAsset = ['ETH', 'WETH'].includes(vault.inputToken.symbol.toUpperCase())
    ? 'ETH'
    : 'USD'
  const vaultBenchmarkName = `${vaultBenchmarkAsset} Vault Benchmark`

  // Prefer the on-chain management fee (tipRate) decorated server-side; fall back to the
  // token-symbol heuristic for any path that didn't fetch fees.
  const managementFee = vault.managementFee ?? getManagementFee(vault.inputToken.symbol)
  // RWA fleets also charge a performance fee (performanceFeeRate); non-RWA fleets don't implement it.
  const performanceFee =
    typeof vault.performanceFee === 'number' && vault.performanceFee > 0
      ? vault.performanceFee
      : null

  const humanReadableNetwork = capitalize(
    sdkNetworkToHumanNetwork(supportedSDKNetwork(vault.protocol.network)),
  )

  return (
    <div className={styles.vaultOpenViewDetailsWrapper}>
      <VaultOpenHeaderBlock
        detailsLinks={getDetailsLinks()}
        vault={vault}
        isDaoManaged={isDaoManaged}
      />
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Historical yield
          </Text>
        }
        defaultExpanded
      >
        {arksHistoricalChartData && (
          <ArkHistoricalYieldChart
            chartData={arksHistoricalChartData}
            summerVaultName={summerVaultName}
            vaultBenchmarkName={vaultBenchmarkName}
          />
        )}
      </Expander>
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Vault exposure
          </Text>
        }
        defaultExpanded
      >
        <VaultExposureDescription humanReadableNetwork={humanReadableNetwork} vault={vault}>
          <VaultExposure
            vault={vault}
            arksInterestRates={arksInterestRates}
            vaultApyData={vaultApyData}
            columnsToHide={vaultExposureColumnsToHideOpenManage}
            isDaoManaged={isDaoManaged}
          />
        </VaultExposureDescription>
      </Expander>
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Rebalancing activity
          </Text>
        }
        defaultExpanded
      >
        <RebalancingActivity
          rebalanceActivity={rebalanceActivity}
          vaultId={getUniqueVaultId(vault)}
        />
      </Expander>
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Portfolio Composition History
          </Text>
        }
        defaultExpanded
      >
        <CurationActivity vault={vault} curationEvents={curationEvents} />
      </Expander>
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Users activity
          </Text>
        }
        defaultExpanded
      >
        <LatestActivity
          latestActivity={latestActivity}
          topDepositors={topDepositors}
          vaultId={getUniqueVaultId(vault)}
          page="open"
          noHighlight
        />
      </Expander>
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Strategy fees
          </Text>
        }
        defaultExpanded
      >
        <Card style={{ flexDirection: 'column', marginTop: 'var(--general-space-16)' }}>
          <Text
            as="p"
            variant="p2semi"
            style={{
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--general-space-24)',
            }}
          >
            {formatDecimalAsPercent(managementFee)} management fee
            {performanceFee !== null
              ? ` + ${formatDecimalAsPercent(performanceFee)} performance fee`
              : ''}
          </Text>
          <Text
            as="p"
            variant="p2"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            {performanceFee !== null
              ? `A ${formatDecimalAsPercent(managementFee)} annualised management fee and a ${formatDecimalAsPercent(performanceFee)} performance fee are charged for using this strategy. `
              : `A ${formatDecimalAsPercent(managementFee)} annualised management fee is charged for using this strategy. `}
            The fees are continually accounted for and reflected in the market value of your
            position.
            {performanceFee === null ? ' This strategy has no other fees.' : ''}{' '}
            {vaultApyData.sma30d
              ? ` The 30d APY for this strategy after fees is ${formatDecimalAsPercent(vaultApyData.sma30d - managementFee)}.`
              : ''}
          </Text>
        </Card>
      </Expander>
    </div>
  )
}
