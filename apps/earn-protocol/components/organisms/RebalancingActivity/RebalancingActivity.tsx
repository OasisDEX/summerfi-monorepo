import { type FC, useMemo } from 'react'
import { Card, DataBlock, Table, Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { rebalancingActivityColumns } from '@/features/rebalance-activity/table/columns'
import { rebalancingActivityMapper } from '@/features/rebalance-activity/table/mapper'
import { type RebalancingActivityRawData } from '@/features/rebalance-activity/table/types'

interface RebalancingActivityProps {
  rawData: RebalancingActivityRawData[]
}

export const RebalancingActivity: FC<RebalancingActivityProps> = ({ rawData }) => {
  // todo to be handled per vault id
  const rows = useMemo(() => rebalancingActivityMapper([]), [rawData]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card variant="cardSecondary" style={{ marginTop: 'var(--spacing-space-medium)' }}>
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
          <DataBlock title="Rebalance actions" size="small" value="313" />
          <DataBlock title="User saved time" size="small" value="73.3 Hours" />
          <DataBlock title="Gas cost savings" size="small" value="$24" />
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
        <Table rows={rows} columns={rebalancingActivityColumns} hiddenColumns={['strategy']} />
        <Link href="/" style={{ marginTop: 'var(--spacing-space-large)', width: 'fit-content' }}>
          <WithArrow as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            View all rebalances
          </WithArrow>
        </Link>
      </div>
    </Card>
  )
}
