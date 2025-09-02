'use client'
import {
  Card,
  Expander,
  getDisplayToken,
  getUniqueVaultId,
  getVaultDetailsUrl,
  Text,
  VaultExposure,
  WithArrow,
} from '@summerfi/app-earn-ui'
import {
  type ArksHistoricalChartData,
  type InterestRates,
  type PerformanceChartData,
  type SDKVaultishType,
  type VaultApyData,
} from '@summerfi/app-types'
import {
  formatDecimalAsPercent,
  getVaultNiceName,
  sdkNetworkToHumanNetwork,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'
import Link from 'next/link'

import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { detailsLinks } from '@/components/layout/VaultOpenView/vault-details-links'
import { VaultExposureDescription } from '@/components/molecules/VaultExposureDescription/VaultExposureDescription'
import { ArkHistoricalYieldChart } from '@/components/organisms/Charts/ArkHistoricalYieldChart'
import { PositionPerformanceChart } from '@/components/organisms/Charts/PositionPerformanceChart'
import { vaultExposureColumnsToHideOpenManage } from '@/constants/tables'
import { LatestActivity } from '@/features/latest-activity/components/LatestActivity/LatestActivity'
import { RebalancingActivity } from '@/features/rebalance-activity/components/RebalancingActivity/RebalancingActivity'
import { getManagementFee } from '@/helpers/get-management-fee'

import vaultManageViewStyles from './VaultManageView.module.css'

export const VaultManageViewDetails = ({
  vault,
  arksHistoricalChartData,
  performanceChartData,
  arksInterestRates,
  vaultApyData,
  rebalanceActivity,
  latestActivity,
  topDepositors,
  viewWalletAddress,
}: {
  vault: SDKVaultishType
  arksHistoricalChartData: ArksHistoricalChartData
  performanceChartData: PerformanceChartData
  arksInterestRates: InterestRates
  vaultApyData: VaultApyData
  rebalanceActivity: RebalanceActivityPagination
  latestActivity: LatestActivityPagination
  topDepositors: TopDepositorsPagination
  viewWalletAddress?: string
}) => {
  const managementFee = getManagementFee(vault.inputToken.symbol)

  const humanReadableNetwork = capitalize(
    sdkNetworkToHumanNetwork(supportedSDKNetwork(vault.protocol.network)),
  )

  return [
    <div className={vaultManageViewStyles.leftContentWrapper} key="PerformanceBlock">
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Forecasted Market Value
          </Text>
        }
        defaultExpanded
      >
        <PositionPerformanceChart
          chartData={performanceChartData}
          inputToken={getDisplayToken(vault.inputToken.symbol)}
        />
      </Expander>
    </div>,
    <div className={vaultManageViewStyles.leftContentWrapper} key="AboutTheStrategy">
      <div>
        <Text
          as="p"
          variant="p1semi"
          style={{
            marginBottom: 'var(--spacing-space-medium)',
          }}
        >
          About the strategy
        </Text>
        <Text
          as="p"
          variant="p2"
          style={{
            color: 'var(--color-text-secondary)',
          }}
        >
          The Lazy Summer Protocol is a permissionless passive lending product, which sets out to
          offer effortless and secure optimised yield, while diversifying risk.
        </Text>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            gap: 'var(--general-space-24)',
            marginTop: 'var(--general-space-20)',
          }}
        >
          {detailsLinks.map(({ label, id }) => (
            <Link key={label} href={`${getVaultDetailsUrl(vault)}#${id}`}>
              <Text
                as="p"
                variant="p3semi"
                style={{
                  color: 'var(--color-text-link)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  paddingRight: 'var(--spacing-space-medium)',
                }}
              >
                <WithArrow>{label}</WithArrow>
              </Text>
            </Link>
          ))}
        </div>
      </div>
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Historical yield
          </Text>
        }
      >
        <ArkHistoricalYieldChart
          chartId="manage-view"
          chartData={arksHistoricalChartData}
          summerVaultName={getVaultNiceName({ vault })}
        />
      </Expander>
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Vault exposure
          </Text>
        }
      >
        <VaultExposureDescription humanReadableNetwork={humanReadableNetwork}>
          <VaultExposure
            vault={vault}
            arksInterestRates={arksInterestRates}
            vaultApyData={vaultApyData}
            columnsToHide={vaultExposureColumnsToHideOpenManage}
          />
        </VaultExposureDescription>
      </Expander>
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Strategy management fee
          </Text>
        }
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
            delays when withdrawing.{' '}
            {vaultApyData.sma30d
              ? ` The 30d APY for this strategy after fees is ${formatDecimalAsPercent(vaultApyData.sma30d - managementFee)}.`
              : ''}
          </Text>
        </Card>
      </Expander>
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Rebalancing activity
          </Text>
        }
      >
        <RebalancingActivity
          rebalanceActivity={rebalanceActivity}
          vaultId={getUniqueVaultId(vault)}
        />
      </Expander>
      <Expander
        title={
          <Text as="p" variant="p1semi">
            User activity
          </Text>
        }
      >
        <LatestActivity
          latestActivity={latestActivity}
          topDepositors={topDepositors}
          vaultId={getUniqueVaultId(vault)}
          page="manage"
          noHighlight
          walletAddress={viewWalletAddress}
        />
      </Expander>
    </div>,
  ]
}
