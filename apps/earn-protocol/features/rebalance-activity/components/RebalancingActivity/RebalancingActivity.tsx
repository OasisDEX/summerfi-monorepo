import { type FC, useMemo } from 'react'
import { Card, DataBlock, Icon, Text, Tooltip, WithArrow } from '@summerfi/app-earn-ui'
import { type SDKGlobalRebalancesType, type SDKVaultsListType } from '@summerfi/app-types'
import {
  formatFiatBalance,
  getRebalanceSavedGasCost,
  getRebalanceSavedTimeInHours,
} from '@summerfi/app-utils'
import Link from 'next/link'

import { RebalanceActivityTable } from '@/features/rebalance-activity/components/RebalanceActivityTable/RebalanceActivityTable'

interface RebalancingActivityProps {
  rebalancesList: SDKGlobalRebalancesType
  vaultId: string
  totalRebalances: number
  vaultsList: SDKVaultsListType
}

const rowsToDisplay = 4

export const RebalancingActivity: FC<RebalancingActivityProps> = ({
  rebalancesList,
  vaultId,
  totalRebalances,
  vaultsList,
}) => {
  const savedTimeInHours = useMemo(
    () => getRebalanceSavedTimeInHours(totalRebalances),
    [totalRebalances],
  )
  const savedGasCost = useMemo(() => getRebalanceSavedGasCost(vaultsList), [vaultsList])

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
          <DataBlock title="Rebalance actions" size="small" value={`${totalRebalances}`} />
          <DataBlock
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
                User saved time
                <Tooltip
                  tooltip="Time users have saved by relying on our AI-Powered keeper network to optimize positions"
                  tooltipWrapperStyles={{ minWidth: '230px' }}
                >
                  <Icon iconName="info" size={18} />
                </Tooltip>
              </div>
            }
            size="small"
            value={`${savedTimeInHours} Hours`}
          />
          <DataBlock
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
                Gas cost savings
                <Tooltip
                  tooltip="Gas cost savings achieved by users relying on our AI-Powered keeper network to optimize their positions, instead of manual management."
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
          rebalancesList={rebalancesList}
          hiddenColumns={['strategy', 'provider']}
          rowsToDisplay={rowsToDisplay}
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
