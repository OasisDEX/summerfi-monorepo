'use client'
import { type FC } from 'react'
import {
  Card,
  Expander,
  getUniqueVaultId,
  Text,
  useMobileCheck,
  VaultExposure,
} from '@summerfi/app-earn-ui'
import {
  type ArksHistoricalChartData,
  type InterestRates,
  type SDKVaultishType,
  type SDKVaultType,
  type VaultApyData,
} from '@summerfi/app-types'
import { formatDecimalAsPercent, getVaultNiceName } from '@summerfi/app-utils'

import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { ArkHistoricalYieldChart } from '@/components/organisms/Charts/ArkHistoricalYieldChart'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { LatestActivity } from '@/features/latest-activity/components/LatestActivity/LatestActivity'
import { RebalancingActivity } from '@/features/rebalance-activity/components/RebalancingActivity/RebalancingActivity'
import { getManagementFee } from '@/helpers/get-management-fee'

import { detailsLinks } from './vault-details-links'
import { VaultOpenHeaderBlock } from './VaultOpenHeaderBlock'

interface VaultOpenViewDetailsProps {
  vault: SDKVaultType | SDKVaultishType
  topDepositors: TopDepositorsPagination
  latestActivity: LatestActivityPagination
  rebalanceActivity: RebalanceActivityPagination
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates: InterestRates
  vaultApyData: VaultApyData
}

export const VaultOpenViewDetails: FC<VaultOpenViewDetailsProps> = ({
  vault,
  latestActivity,
  topDepositors,
  rebalanceActivity,
  arksHistoricalChartData,
  arksInterestRates,
  vaultApyData,
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const summerVaultName = getVaultNiceName({ vault })

  const managementFee = getManagementFee(vault.inputToken.symbol)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-space-x-large)',
        width: '100%',
      }}
    >
      <VaultOpenHeaderBlock detailsLinks={detailsLinks} vault={vault} />
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Historical yield
          </Text>
        }
        defaultExpanded
      >
        <ArkHistoricalYieldChart
          chartData={arksHistoricalChartData}
          summerVaultName={summerVaultName}
        />
      </Expander>
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Vault exposure
          </Text>
        }
        defaultExpanded
      >
        <VaultExposure
          vault={vault}
          arksInterestRates={arksInterestRates}
          vaultApyData={vaultApyData}
          isMobile={isMobile}
        />
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
            Strategy management fee
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
          </Text>
          <Text
            as="p"
            variant="p2"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            A {formatDecimalAsPercent(managementFee)} annualised management fee is charged for using
            this strategy. The fees are continually accounted for and reflected in the market value
            of your position. This strategy has no other fees, and there are no restrictions or
            delays when withdrawing.
            {vaultApyData.sma30d
              ? ` The 30d APY for this strategy after fees is ${formatDecimalAsPercent(vaultApyData.sma30d - managementFee)}.`
              : ''}
          </Text>
        </Card>
      </Expander>
    </div>
  )
}
