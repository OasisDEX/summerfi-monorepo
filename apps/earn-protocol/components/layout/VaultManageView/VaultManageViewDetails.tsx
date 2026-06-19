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
  type IArmadaPosition,
  type SDKVaultishType,
  type SupportedSDKNetworks,
  type TokenSymbolsList,
  type VaultApyData,
} from '@summerfi/app-types'
import {
  formatDecimalAsPercent,
  getVaultNiceName,
  sdkNetworkToHumanNetwork,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { type BigNumber } from 'bignumber.js'
import { capitalize } from 'lodash-es'
import Link from 'next/link'

import { RwaDepositsWithdrawals } from '@/components/layout/VaultManageView/RwaDepositsWithdrawals'
import {
  useVaultManageCurationQuery,
  useVaultManageExposureQuery,
  useVaultManagePerformanceQuery,
  useVaultManageRebalancingQuery,
  useVaultManageUserActivityQuery,
  useVaultManageYieldChartQuery,
} from '@/components/layout/VaultManageView/useVaultManageQuery'
import { detailsLinks } from '@/components/layout/VaultOpenView/vault-details-links'
import { VaultOpenHeaderBlock } from '@/components/layout/VaultOpenView/VaultOpenHeaderBlock'
import { VaultExposureDescription } from '@/components/molecules/VaultExposureDescription/VaultExposureDescription'
import { ArkHistoricalYieldChart } from '@/components/organisms/Charts/ArkHistoricalYieldChart'
import { PositionHistoricalMarketValueChart } from '@/components/organisms/Charts/PositionHistoricalMarketValueChart'
import { PositionPerformanceChart } from '@/components/organisms/Charts/PositionPerformanceChart'
import { RwaNavPriceChart } from '@/components/organisms/Charts/RwaNavPriceChart'
import { vaultExposureColumnsToHideOpenManage } from '@/constants/tables'
import { CurationActivity } from '@/features/curation-activity/components/CurationActivity/CurationActivity'
import { LatestActivity } from '@/features/latest-activity/components/LatestActivity/LatestActivity'
import { RebalancingActivity } from '@/features/rebalance-activity/components/RebalancingActivity/RebalancingActivity'
import { getManagementFee } from '@/helpers/get-management-fee'
import { useHandleButtonClickEvent, useHandleTooltipOpenEvent } from '@/hooks/use-mixpanel-event'
import { type RwaReceipt } from '@/hooks/use-rwa-claim'

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
  // Needed for the RWA "Historical Market Value" chart's legend (current net value / earnings / SUMR).
  position: IArmadaPosition
  vaultApyData: VaultApyData
  // RWA-only: powers the "Deposits and Withdrawals" history expander. The receipt actions are
  // owned by the parent (shared useRwaClaim wiring) and passed down here.
  isRwaVault?: boolean
  // RWA pre-claim (synthetic position from exposure): hide the position performance/forecast
  // expander, which has no real position history to chart and whose section handler returns null.
  isRwaPendingPosition?: boolean
  vaultSharePrice?: BigNumber
  onRwaAction?: (receipt: RwaReceipt) => void
  rwaActionInProgressKey?: string
  rwaActionError?: string
}> = ({
  network,
  vaultId,
  viewWalletAddress,
  vault,
  position,
  vaultApyData,
  isRwaVault = false,
  isRwaPendingPosition = false,
  vaultSharePrice,
  onRwaAction,
  rwaActionInProgressKey,
  rwaActionError,
}) => {
  const vaultBenchmarkAsset = ['ETH', 'WETH'].includes(vault.inputToken.symbol.toUpperCase())
    ? 'ETH'
    : 'USD'
  const vaultBenchmarkName = `${vaultBenchmarkAsset} Vault Benchmark`
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const tooltipEventHandler = useHandleTooltipOpenEvent()
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
  // Pending RWA positions have no settled history/forecast to show, so the performance expander is
  // hidden — keep its query disabled (start closed) to avoid a fetch for a section that won't render.
  const [performanceOpen, setPerformanceOpen] = useState(!isRwaPendingPosition)
  const [rwaReceiptsOpen, setRwaReceiptsOpen] = useState(false)
  const [yieldOpen, setYieldOpen] = useState(false)
  const [exposureOpen, setExposureOpen] = useState(false)
  const [rebalancingOpen, setRebalancingOpen] = useState(false)
  const [curationOpen, setCurationOpen] = useState(false)
  const [userActivityOpen, setUserActivityOpen] = useState(false)

  // The performance section returns the forecast chart for non-RWA vaults and the position's market
  // value over time (Historical Market Value) for RWA vaults — computed server-side from the manage
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
      buttonClickEventHandler(`vault-manage-expander-${expanderId}-${isOpen ? 'open' : 'close'}`)
    }

  return [
    isRwaPendingPosition ? null : (
      <div className={vaultManageViewStyles.leftContentWrapper} key="PerformanceBlock">
        <Expander
          title={
            <Text as="p" variant="p1semi">
              {isRwaVault ? 'Historical Market Value' : 'Forecasted Market Value'}
            </Text>
          }
          onExpand={handleExpand('performance', setPerformanceOpen)}
          defaultExpanded
        >
          {isRwaVault ? (
            performanceQuery.data ? (
              <PositionHistoricalMarketValueChart
                chartId="manage-view"
                chartData={performanceQuery.data.rwaHistoricalChartData}
                position={{ position, vault }}
                tokenSymbol={getDisplayToken(vault.inputToken.symbol) as TokenSymbolsList}
                legendInTooltip
                // RWA positions earn no $SUMR, so drop that legend item.
                legendItems={['netValue', 'depositedValue', 'earnings']}
              />
            ) : (
              <SectionLoader />
            )
          ) : performanceQuery.data?.performanceChartData ? (
            <PositionPerformanceChart
              chartData={performanceQuery.data.performanceChartData}
              inputToken={getDisplayToken(vault.inputToken.symbol)}
            />
          ) : (
            <SectionLoader />
          )}
        </Expander>
      </div>
    ),
    <div className={vaultManageViewStyles.leftContentWrapper} key="AboutTheStrategy">
      {/* RWA vaults reuse the open view's RWA-aware header block (single source of the RWA copy);
          non-RWA vaults keep the existing generic "About the strategy" block. */}
      {isRwaVault ? (
        <VaultOpenHeaderBlock vault={vault} detailsLinks={detailsLinks} isRwaVault />
      ) : (
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
      )}
      {isRwaVault && vault.customFields?.vaultCurator ? (
        <Expander
          title={
            <Text as="p" variant="p1semi">
              {vault.customFields.vaultCurator}
            </Text>
          }
          onExpand={handleExpand('vault-asset-manager', () => undefined)}
          defaultExpanded
        >
          <Text
            as="p"
            variant="p3"
            style={{
              color: 'var(--color-text-secondary)',
              margin: '0 10px',
            }}
          >
            {vault.customFields.vaultCuratorDescription ??
              `This Vault is curated and managed by ${vault.customFields.vaultCurator}`}
          </Text>
        </Expander>
      ) : null}
      {isRwaVault ? (
        <Expander
          title={
            <Text as="p" variant="p1semi">
              Deposits and Withdrawals
            </Text>
          }
          onExpand={handleExpand('rwa-deposits-withdrawals', setRwaReceiptsOpen)}
        >
          <RwaDepositsWithdrawals
            network={network}
            vaultId={vaultId}
            walletAddress={viewWalletAddress}
            enabled={rwaReceiptsOpen}
            tokenSymbol={getDisplayToken(vault.inputToken.symbol)}
            vaultSharePrice={vaultSharePrice}
            actionInProgressKey={rwaActionInProgressKey}
            actionError={rwaActionError}
            onAction={onRwaAction}
          />
        </Expander>
      ) : null}
      <Expander
        title={
          <Text as="p" variant="p1semi">
            {isRwaVault ? 'Historical NAV price' : 'Historical yield'}
          </Text>
        }
        onExpand={handleExpand('historical-yield', setYieldOpen)}
      >
        {yieldQuery.data ? (
          isRwaVault ? (
            <RwaNavPriceChart
              chartId="manage-view"
              chartData={yieldQuery.data.rwaNavHistoricalChartData}
            />
          ) : (
            yieldQuery.data.arksHistoricalChartData && (
              <ArkHistoricalYieldChart
                chartId="manage-view"
                chartData={yieldQuery.data.arksHistoricalChartData}
                summerVaultName={getVaultNiceName({ vault })}
                vaultBenchmarkName={vaultBenchmarkName}
              />
            )
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
          <VaultExposureDescription
            humanReadableNetwork={humanReadableNetwork}
            vault={vault}
            isRwaVault={isRwaVault}
          >
            <VaultExposure
              vault={vault}
              arksInterestRates={exposureQuery.data.arksInterestRates}
              vaultApyData={vaultApyData}
              columnsToHide={vaultExposureColumnsToHideOpenManage}
              tableId="vault-manage"
              buttonClickEventHandler={buttonClickEventHandler}
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
            {performanceFee !== null
              ? ' There are no restrictions or delays when withdrawing.'
              : ' This strategy has no other fees, and there are no restrictions or delays when withdrawing.'}{' '}
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
            tableId="vault-manage-rebalancing-activity"
            buttonClickEventHandler={buttonClickEventHandler}
            tooltipEventHandler={tooltipEventHandler}
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
            tableId="vault-manage-user-activity"
            buttonClickEventHandler={buttonClickEventHandler}
          />
        ) : (
          <SectionLoader />
        )}
      </Expander>
    </div>,
  ] as ReactNode[]
}
