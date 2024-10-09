import { type FC, useMemo } from 'react'
import { Card, DataBlock, Icon, Table, TableCellText, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance, timeAgo } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

const columns = [
  {
    title: 'Purpose',
    key: 'purpose',
    sortable: false,
  },
  {
    title: 'Action',
    key: 'action',
    sortable: false,
  },
  {
    title: 'Amount',
    key: 'amount',
    sortable: false,
  },
  {
    title: 'Timestamp',
    key: 'timestamp',
    sortable: false,
  },
  {
    title: 'Provider',
    key: 'provider',
    sortable: false,
  },
]

export interface RebalancingActivityRawData {
  type: string
  action: { from: TokenSymbolsList; to: TokenSymbolsList }
  amount: { token: TokenSymbolsList; value: string }
  timestamp: string
  provider: {
    link: string
    label: string
  }
}

const rebalancingActivityMapper = (rawData: RebalancingActivityRawData[]) => {
  return rawData.map((item) => {
    return {
      content: {
        purpose: (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-x-small)' }}
          >
            <Icon
              iconName={item.type === 'reduce' ? 'arrow_decrease' : 'arrow_increase'}
              variant="xxs"
              color="rgba(119, 117, 118, 1)"
            />
            <TableCellText>{item.type === 'reduce' ? 'Reduce' : 'Increase'} Risk</TableCellText>
          </div>
        ),
        action: (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-2x-small)' }}
          >
            <Icon tokenName={item.action.from} variant="s" /> {item.action.from} →
            <Icon tokenName={item.action.to} variant="s" /> {item.action.to}
          </div>
        ),
        amount: (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-2x-small)' }}
          >
            <Icon tokenName={item.amount.token} variant="s" />
            <TableCellText>{formatCryptoBalance(new BigNumber(item.amount.value))}</TableCellText>
          </div>
        ),
        timestamp: (
          <TableCellText>
            {timeAgo({ from: new Date(), to: new Date(Number(item.timestamp)) })}
          </TableCellText>
        ),
        provider: (
          <Link href={item.provider.link}>
            <WithArrow
              as="p"
              variant="p3"
              style={{ color: 'var(--earn-protocol-primary-100)' }}
              reserveSpace
            >
              {item.provider.label}
            </WithArrow>
          </Link>
        ),
      },
    }
  })
}

interface RebalancingActivityProps {
  rawData: RebalancingActivityRawData[]
}

export const RebalancingActivity: FC<RebalancingActivityProps> = ({ rawData }) => {
  const rows = useMemo(() => rebalancingActivityMapper(rawData), [rawData])

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
        <Table rows={rows} columns={columns} />
        <Link href="/" style={{ marginTop: 'var(--spacing-space-large)', width: 'fit-content' }}>
          <WithArrow as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            View all rebalances
          </WithArrow>
        </Link>
      </div>
    </Card>
  )
}
