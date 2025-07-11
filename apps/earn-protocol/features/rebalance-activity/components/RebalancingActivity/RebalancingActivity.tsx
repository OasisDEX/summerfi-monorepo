import { type FC, useMemo } from 'react'
import { Card, DataBlock, Icon, Text, Tooltip, WithArrow } from '@summerfi/app-earn-ui'
import {
  formatFiatBalance,
  formatWithSeparators,
  getRebalanceSavedGasCost,
  getRebalanceSavedTimeInHours,
} from '@summerfi/app-utils'
import Link from 'next/link'

import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { RebalanceActivityTable } from '@/features/rebalance-activity/components/RebalanceActivityTable/RebalanceActivityTable'

interface RebalancingActivityProps {
  rebalanceActivity: RebalanceActivityPagination
  vaultId: string
}

export const RebalancingActivity: FC<RebalancingActivityProps> = ({
  rebalanceActivity,
  vaultId,
}) => {
  const { totalItems } = rebalanceActivity.pagination

  const savedTimeInHours = useMemo(() => getRebalanceSavedTimeInHours(totalItems), [totalItems])
  const savedGasCost = useMemo(
    () => getRebalanceSavedGasCost(rebalanceActivity.totalItemsPerStrategyId),
    [rebalanceActivity.totalItemsPerStrategyId],
  )

  return (
    <Card style={{ marginTop: 'var(--spacing-space-medium)' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Text as="p" variant="p2semi" style={{ marginBottom: 'var(--spacing-space-large)' }}>
          Previous 30 days
        </Text>
        <div
          style={{
            justifyContent: 'space-between',
            display: 'flex',
            marginBottom: 'var(--spacing-space-large)',
            flexWrap: 'wrap',
          }}
        >
          <DataBlock
            title="Rebalance actions"
            size="small"
            value={`${formatWithSeparators(totalItems)}`}
          />
          <DataBlock
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
                User saved time
                <Tooltip
                  tooltip="Time users avoid spending on manual position upkeep, estimated at about five minutes for every transaction the keeper network automates."
                  tooltipWrapperStyles={{ minWidth: '230px' }}
                >
                  <Icon iconName="info" size={18} />
                </Tooltip>
              </div>
            }
            size="small"
            value={`${formatWithSeparators(savedTimeInHours, { precision: 1 })} Hours`}
          />
          <DataBlock
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
                Gas cost savings
                <Tooltip
                  tooltip="Gas fees users sidestep when the keeper handles their trades, using typical mainnet-dollar and L2-cent costs for each transaction."
                  tooltipWrapperStyles={{ minWidth: '230px' }}
                >
                  <Icon iconName="info" size={18} />
                </Tooltip>
              </div>
            }
            size="small"
            value={`$${formatFiatBalance(savedGasCost)}`}
          />
        </div>
        <Text
          as="p"
          variant="p3"
          style={{
            color: 'var(--earn-protocol-secondary-60)',
            marginBottom: 'var(--spacing-space-large)',
          }}
        >
          Continuous monitoring and rebalancing is crucial in attaining the best possible yield for
          any strategy. It is responsible for reallocating assets from lower performing protocols
          and markets to higher performing ones; strict risk thresholds are set by an independant
          Risk Manager.
        </Text>
        <RebalanceActivityTable
          rebalanceActivityList={rebalanceActivity.data}
          hiddenColumns={['strategy', 'provider', 'position']}
          skeletonLines={4}
        />
        <Link
          href={`/rebalance-activity?strategies=${vaultId}`}
          style={{ marginTop: 'var(--spacing-space-large)', width: 'fit-content' }}
        >
          <WithArrow as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            View all rebalances
          </WithArrow>
        </Link>
      </div>
    </Card>
  )
}
