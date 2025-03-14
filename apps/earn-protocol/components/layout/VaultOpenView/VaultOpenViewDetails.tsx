import { type FC } from 'react'
import { Card, Expander, getUniqueVaultId, Text } from '@summerfi/app-earn-ui'
import {
  type ArksHistoricalChartData,
  type SDKUsersActivityType,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  type UsersActivity,
  type VaultApyData,
} from '@summerfi/app-types'
import { formatDecimalAsPercent } from '@summerfi/app-utils'
import { type GetGlobalRebalancesQuery } from '@summerfi/sdk-client'

import { ArkHistoricalYieldChart } from '@/components/organisms/Charts/ArkHistoricalYieldChart'
import { RebalancingActivity } from '@/features/rebalance-activity/components/RebalancingActivity/RebalancingActivity'
import { UserActivity } from '@/features/user-activity/components/UserActivity/UserActivity'
import { VaultExposure } from '@/features/vault-exposure/components/VaultExposure/VaultExposure'

import { detailsLinks } from './mocks'
import { VaultOpenHeaderBlock } from './VaultOpenHeaderBlock'

interface VaultOpenViewDetailsProps {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates?: { [key: string]: number }
  vaultApyData: VaultApyData
}

export const VaultOpenViewDetails: FC<VaultOpenViewDetailsProps> = ({
  vault,
  vaults,
  userActivity,
  topDepositors,
  arksHistoricalChartData,
  arksInterestRates,
  vaultApyData,
}) => {
  // needed due to type duality
  const rebalancesList =
    `rebalances` in vault ? (vault.rebalances as GetGlobalRebalancesQuery['rebalances']) : []

  const summerVaultName = vault.customFields?.name ?? `Summer ${vault.inputToken.symbol} Vault`

  // "It’s 1% for usd and 0.3% for eth"
  const managementFee = vault.inputToken.symbol.includes('USD') ? 0.01 : 0.003

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
        <VaultExposure vault={vault} arksInterestRates={arksInterestRates} />
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
          rebalancesList={rebalancesList}
          vaultId={getUniqueVaultId(vault)}
          totalRebalances={Number(vault.rebalanceCount)}
          vaultsList={vaults}
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
        <UserActivity
          userActivity={userActivity}
          topDepositors={topDepositors}
          vaultId={getUniqueVaultId(vault)}
          vaultApyData={vaultApyData}
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
            {formatDecimalAsPercent(managementFee)} Management Fee, already included in APY
          </Text>
          <Text
            as="p"
            variant="p2"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            A {formatDecimalAsPercent(managementFee)} management fee is applied to your position,
            but it’s already factored into the APY you see. This means the rate displayed reflects
            your net return - no hidden fees, just straightforward earnings.
          </Text>
        </Card>
      </Expander>
    </div>
  )
}
