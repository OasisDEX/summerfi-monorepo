'use client'
import { type FC } from 'react'
import { Card, Expander, getUniqueVaultId, Text, VaultExposure } from '@summerfi/app-earn-ui'
import {
  type ArksHistoricalChartData,
  type InterestRates,
  type SDKVaultishType,
  type SDKVaultType,
  type SingleSourceChartData,
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
import { RwaNavPriceChart } from '@/components/organisms/Charts/RwaNavPriceChart'
import { vaultExposureColumnsToHideOpenManage } from '@/constants/tables'
import { CurationActivity } from '@/features/curation-activity/components/CurationActivity/CurationActivity'
import { type VaultCurationEvent } from '@/features/curation-activity/types'
import { LatestActivity } from '@/features/latest-activity/components/LatestActivity/LatestActivity'
import { RebalancingActivity } from '@/features/rebalance-activity/components/RebalancingActivity/RebalancingActivity'
import { getManagementFee } from '@/helpers/get-management-fee'
import { useHandleButtonClickEvent, useHandleTooltipOpenEvent } from '@/hooks/use-mixpanel-event'

import { detailsLinks } from './vault-details-links'
import { VaultOpenHeaderBlock } from './VaultOpenHeaderBlock'

import styles from './VaultOpenViewDetails.module.css'

interface VaultOpenViewDetailsProps {
  vault: SDKVaultType | SDKVaultishType
  topDepositors: TopDepositorsPagination
  latestActivity: LatestActivityPagination
  rebalanceActivity: RebalanceActivityPagination
  curationEvents?: VaultCurationEvent[]
  arksHistoricalChartData?: ArksHistoricalChartData
  rwaNavHistoricalChartData?: SingleSourceChartData
  arksInterestRates: InterestRates
  vaultApyData: VaultApyData
  isDaoManaged?: boolean
  isRwaVault?: boolean
}

export const VaultOpenViewDetails: FC<VaultOpenViewDetailsProps> = ({
  vault,
  latestActivity,
  topDepositors,
  rebalanceActivity,
  curationEvents = [],
  arksHistoricalChartData,
  rwaNavHistoricalChartData,
  arksInterestRates,
  vaultApyData,
  isDaoManaged,
  isRwaVault,
}) => {
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const tooltipEventHandler = useHandleTooltipOpenEvent()
  const summerVaultName = getVaultNiceName({ vault })
  const vaultBenchmarkAsset = ['ETH', 'WETH'].includes(vault.inputToken.symbol.toUpperCase())
    ? 'ETH'
    : 'USD'
  const vaultBenchmarkName = `${vaultBenchmarkAsset} Vault Benchmark`

  const managementFee = getManagementFee(vault.inputToken.symbol)

  const humanReadableNetwork = capitalize(
    sdkNetworkToHumanNetwork(supportedSDKNetwork(vault.protocol.network)),
  )

  const handleExpanderToggle = (expanderId: string) => (isOpen: boolean) => {
    buttonClickEventHandler(`vault-open-expander-${expanderId}-${isOpen ? 'open' : 'close'}`)
  }

  return (
    <div className={styles.vaultOpenViewDetailsWrapper}>
      <VaultOpenHeaderBlock
        detailsLinks={detailsLinks}
        vault={vault}
        isDaoManaged={isDaoManaged}
        isRwaVault={isRwaVault}
      />
      {isRwaVault ? (
        <Expander
          onExpand={handleExpanderToggle('vault-asset-manager')}
          title={
            <Text as="p" variant="p1semi">
              Avantgarde Asset Management (Vault Curator)
            </Text>
          }
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
            This Vault is curated and managed by Avantgarde Asset Managment. Avantgarde have over 8
            years of experience....blah blah blah
          </Text>
        </Expander>
      ) : null}
      <Expander
        onExpand={handleExpanderToggle('historical-yield')}
        title={
          <Text as="p" variant="p1semi">
            {isRwaVault ? 'Historical NAV price' : 'Historical yield'}
          </Text>
        }
        defaultExpanded
      >
        {isRwaVault ? (
          <RwaNavPriceChart chartId="open-view" chartData={rwaNavHistoricalChartData} />
        ) : (
          arksHistoricalChartData && (
            <ArkHistoricalYieldChart
              chartId="open-view"
              chartData={arksHistoricalChartData}
              summerVaultName={summerVaultName}
              vaultBenchmarkName={vaultBenchmarkName}
            />
          )
        )}
      </Expander>
      <Expander
        onExpand={handleExpanderToggle('vault-exposure')}
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
            tableId="vault-open"
            buttonClickEventHandler={buttonClickEventHandler}
            isDaoManaged={isDaoManaged}
          />
        </VaultExposureDescription>
      </Expander>
      <Expander
        onExpand={handleExpanderToggle('rebalancing-activity')}
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
          tableId="vault-open-rebalancing-activity"
          buttonClickEventHandler={buttonClickEventHandler}
          tooltipEventHandler={tooltipEventHandler}
        />
      </Expander>
      <Expander
        onExpand={handleExpanderToggle('curation-activity')}
        title={
          <Text as="p" variant="p1semi">
            Curation activity
          </Text>
        }
        defaultExpanded
      >
        <CurationActivity vault={vault} curationEvents={curationEvents} />
      </Expander>
      <Expander
        onExpand={handleExpanderToggle('users-activity')}
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
          tableId="vault-open-users-activity"
          buttonClickEventHandler={buttonClickEventHandler}
        />
      </Expander>
      <Expander
        onExpand={handleExpanderToggle('strategy-management-fee')}
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
