'use client'
import { type FC, type ReactNode, useState } from 'react'
import {
  Card,
  Expander,
  getDisplayToken,
  getUniqueVaultId,
  getVaultDetailsUrl,
  SkeletonLine,
  Text,
  VaultExposure,
  WithArrow,
} from '@summerfi/app-earn-ui'
import {
  type SDKVaultishType,
  type SupportedSDKNetworks,
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

import {
  useVaultManageCurationQuery,
  useVaultManageExposureQuery,
  useVaultManagePerformanceQuery,
  useVaultManageRebalancingQuery,
  useVaultManageUserActivityQuery,
  useVaultManageYieldChartQuery,
} from '@/components/layout/VaultManageView/useVaultManageQuery'
import { getDetailsLinks } from '@/components/layout/VaultOpenView/vault-details-links'
import { VaultExposureDescription } from '@/components/molecules/VaultExposureDescription/VaultExposureDescription'
import { ArkHistoricalYieldChart } from '@/components/organisms/Charts/ArkHistoricalYieldChart'
import { PositionPerformanceChart } from '@/components/organisms/Charts/PositionPerformanceChart'
import { vaultExposureColumnsToHideOpenManage } from '@/constants/tables'
import { CurationActivity } from '@/features/curation-activity/components/CurationActivity/CurationActivity'
import { LatestActivity } from '@/features/latest-activity/components/LatestActivity/LatestActivity'
import { RebalancingActivity } from '@/features/rebalance-activity/components/RebalancingActivity/RebalancingActivity'
import { getManagementFee } from '@/helpers/get-management-fee'

import vaultManageViewStyles from './VaultManageView.module.css'

// Loader shown inside an expander while its lazily-fetched section is loading.
const SectionLoader = () => (
  <SkeletonLine
    height={448}
    radius="var(--radius-roundish)"
    style={{ marginTop: 'var(--spacing-space-medium)' }}
  />
)

export const VaultManageViewDetails: FC<{
  network: SupportedSDKNetworks
  vaultId: string
  viewWalletAddress: string
  vault: SDKVaultishType
  vaultApyData: VaultApyData
}> = ({ network, vaultId, viewWalletAddress, vault, vaultApyData }) => {
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

  // Each lazy expander tracks its own open state so the matching query is only `enabled` (and thus
  // only fetched) once the user reveals it. The performance chart is open by default, so it starts
  // enabled. Re-collapsing keeps the cached data; re-expanding doesn't refetch within staleTime.
  const [performanceOpen, setPerformanceOpen] = useState(true)
  const [yieldOpen, setYieldOpen] = useState(false)
  const [exposureOpen, setExposureOpen] = useState(false)
  const [rebalancingOpen, setRebalancingOpen] = useState(false)
  const [curationOpen, setCurationOpen] = useState(false)
  const [userActivityOpen, setUserActivityOpen] = useState(false)

  // The performance section returns the forecast chart, computed server-side from the manage
  // context's already-resolved position, so it's reliable even when the portfolio can't resolve it.
  const performanceQuery = useVaultManagePerformanceQuery(
    network,
    vaultId,
    viewWalletAddress,
    performanceOpen,
  )
  const yieldQuery = useVaultManageYieldChartQuery(network, vaultId, viewWalletAddress, yieldOpen)
  const exposureQuery = useVaultManageExposureQuery(
    network,
    vaultId,
    viewWalletAddress,
    exposureOpen,
  )
  const rebalancingQuery = useVaultManageRebalancingQuery(
    network,
    vaultId,
    viewWalletAddress,
    rebalancingOpen,
  )
  const curationQuery = useVaultManageCurationQuery(
    network,
    vaultId,
    viewWalletAddress,
    curationOpen,
  )
  const userActivityQuery = useVaultManageUserActivityQuery(
    network,
    vaultId,
    viewWalletAddress,
    userActivityOpen,
  )

  const handleExpand =
    (expanderId: string, setOpen: (open: boolean) => void) => (isOpen: boolean) => {
      setOpen(isOpen)
    }

  const detailsLinks = getDetailsLinks()

  return [
    <div className={vaultManageViewStyles.leftContentWrapper} key="PerformanceBlock">
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Forecasted Market Value
          </Text>
        }
        onExpand={handleExpand('performance', setPerformanceOpen)}
        defaultExpanded
      >
        {performanceQuery.data?.performanceChartData ? (
          <PositionPerformanceChart
            chartData={performanceQuery.data.performanceChartData}
            inputToken={getDisplayToken(vault.inputToken.symbol)}
          />
        ) : (
          <SectionLoader />
        )}
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
        onExpand={handleExpand('historical-yield', setYieldOpen)}
      >
        {yieldQuery.data ? (
          yieldQuery.data.arksHistoricalChartData && (
            <ArkHistoricalYieldChart
              chartData={yieldQuery.data.arksHistoricalChartData}
              summerVaultName={getVaultNiceName({ vault })}
              vaultBenchmarkName={vaultBenchmarkName}
            />
          )
        ) : (
          <SectionLoader />
        )}
      </Expander>
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Vault exposure
          </Text>
        }
        onExpand={handleExpand('vault-exposure', setExposureOpen)}
      >
        {exposureQuery.data ? (
          <VaultExposureDescription humanReadableNetwork={humanReadableNetwork} vault={vault}>
            <VaultExposure
              vault={vault}
              arksInterestRates={exposureQuery.data.arksInterestRates}
              vaultApyData={vaultApyData}
              columnsToHide={vaultExposureColumnsToHideOpenManage}
            />
          </VaultExposureDescription>
        ) : (
          <SectionLoader />
        )}
      </Expander>
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Strategy fees
          </Text>
        }
        onExpand={handleExpand('strategy-management-fee', () => undefined)}
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
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Rebalancing activity
          </Text>
        }
        onExpand={handleExpand('rebalancing-activity', setRebalancingOpen)}
      >
        {rebalancingQuery.data ? (
          <RebalancingActivity
            rebalanceActivity={rebalancingQuery.data.rebalanceActivity}
            vaultId={getUniqueVaultId(vault)}
          />
        ) : (
          <SectionLoader />
        )}
      </Expander>
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Portfolio Composition History
          </Text>
        }
        onExpand={handleExpand('curation-activity', setCurationOpen)}
      >
        {curationQuery.data ? (
          <CurationActivity vault={vault} curationEvents={curationQuery.data.curationEvents} />
        ) : (
          <SectionLoader />
        )}
      </Expander>
      <Expander
        title={
          <Text as="p" variant="p1semi">
            User activity
          </Text>
        }
        onExpand={handleExpand('user-activity', setUserActivityOpen)}
      >
        {userActivityQuery.data ? (
          <LatestActivity
            latestActivity={userActivityQuery.data.latestActivity}
            topDepositors={userActivityQuery.data.topDepositors}
            vaultId={getUniqueVaultId(vault)}
            page="manage"
            noHighlight
            walletAddress={viewWalletAddress}
          />
        ) : (
          <SectionLoader />
        )}
      </Expander>
    </div>,
  ] as ReactNode[]
}
