import { type FC, useMemo } from 'react'
import { Card, DataBlock, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type SDKGlobalRebalancesType } from '@summerfi/app-types'
import { formatFiatBalance } from '@summerfi/app-utils'
import Link from 'next/link'

import { RebalanceActivityTable } from '@/features/rebalance-activity/components/RebalanceActivityTable/RebalanceActivityTable'
import { getRebalanceSavedGasCost } from '@/features/rebalance-activity/helpers/get-saved-gas-cost'
import { getRebalanceSavedTimeInHours } from '@/features/rebalance-activity/helpers/get-saved-time-in-hours'

interface RebalancingActivityProps {
  rebalancesList: SDKGlobalRebalancesType
  vaultId: string
  totalRebalances: number
}

const rowsToDisplay = 4

export const RebalancingActivity: FC<RebalancingActivityProps> = ({
  rebalancesList,
  vaultId,
  totalRebalances,
}) => {
  const savedTimeInHours = useMemo(
    () => getRebalanceSavedTimeInHours(totalRebalances),
    [totalRebalances],
  )
  const savedGasCost = useMemo(() => getRebalanceSavedGasCost(totalRebalances), [totalRebalances])

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
          <DataBlock title="User saved time" size="small" value={`${savedTimeInHours} Hours`} />
          <DataBlock
            title="Gas cost savings"
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
          Rebalancing crucial in attaining the best possible yield for a Strategy, It is responsible
          for reallocating assets from lower performing strategies to higher performing ones, within
          a threshold of risk.
        </Text>
        <RebalanceActivityTable
          rebalancesList={rebalancesList}
          hiddenColumns={['strategy', 'provider']}
          rowsToDisplay={rowsToDisplay}
        />
        <Link
          href={`/earn/rebalance-activity?strategies=${vaultId}`}
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
