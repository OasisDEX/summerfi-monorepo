import { Icon, TableCellText, Text, WithArrow } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, timeAgo } from '@summerfi/app-utils'
import Link from 'next/link'

import { type RebalancingActivityRawData } from '@/features/rebalance-activity/table/types'

export const rebalancingActivityMapper = (rawData: RebalancingActivityRawData[]) => {
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
            <Icon tokenName={item.action.from} variant="s" /> {item.action.from}
            <Text style={{ color: 'var(--earn-protocol-secondary-40)', fontSize: '14px' }}>→</Text>
            <Icon tokenName={item.action.to} variant="s" /> {item.action.to}
          </div>
        ),
        amount: (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-2x-small)' }}
          >
            <Icon tokenName={item.amount.token} variant="s" />
            <TableCellText>{formatCryptoBalance(item.amount.value)}</TableCellText>
          </div>
        ),
        strategy: <TableCellText>{item.strategy}</TableCellText>,
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
