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
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const tooltipEventHandler = useHandleTooltipOpenEvent()
  const summerVaultName = getVaultNiceName({ vault })

  const managementFee = getManagementFee(vault.inputToken.symbol)

  const humanReadableNetwork = capitalize(
    sdkNetworkToHumanNetwork(supportedSDKNetwork(vault.protocol.network)),
  )

  const handleExpanderToggle = (expanderId: string) => (isOpen: boolean) => {
    buttonClickEventHandler(`vault-open-expander-${expanderId}-${isOpen ? 'open' : 'close'}`)
  }

  return (
    <div className={styles.vaultOpenViewDetailsWrapper}>
      <VaultOpenHeaderBlock detailsLinks={detailsLinks} vault={vault} />
      <Expander
        onExpand={handleExpanderToggle('historical-yield')}
        title={
          <Text as="p" variant="p1semi">
            Historical yield
          </Text>
        }
        defaultExpanded
      >
        <ArkHistoricalYieldChart
          chartId="open-view"
          chartData={arksHistoricalChartData}
          summerVaultName={summerVaultName}
        />
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
        <VaultExposureDescription humanReadableNetwork={humanReadableNetwork}>
          <VaultExposure
            vault={vault}
            arksInterestRates={arksInterestRates}
            vaultApyData={vaultApyData}
            columnsToHide={vaultExposureColumnsToHideOpenManage}
            tableId="vault-open"
            buttonClickEventHandler={buttonClickEventHandler}
            tooltipEventHandler={tooltipEventHandler}
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
        />
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
