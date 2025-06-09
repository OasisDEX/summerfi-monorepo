import { TableCellText } from '@summerfi/app-earn-ui'
import { formatAddress, formatFiatBalance, timeAgo } from '@summerfi/app-utils'

import { type ReferralActivity } from '@/features/beach-club/types'

const actionLabelMap: { [key in ReferralActivity['actionType']]: string } = {
  deposit: 'Deposit',
  withdraw: 'Withdraw',
}

const actionColorMap: { [key in ReferralActivity['actionType']]: string } = {
  deposit: 'var(--earn-protocol-success-100)',
  withdraw: 'var(--earn-protocol-warning-100)',
}

export const referralActivityMapper = (rawData: ReferralActivity[]) => {
  return rawData.map((item) => {
    return {
      id: item.userAddress,
      content: {
        address: <TableCellText>{formatAddress(item.userAddress)}</TableCellText>,
        action: (
          <TableCellText style={{ color: actionColorMap[item.actionType] }}>
            {actionLabelMap[item.actionType]}
          </TableCellText>
        ),
        tvl: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-space-2x-small)',
            }}
          >
            <TableCellText>${formatFiatBalance(item.tvl)}</TableCellText>
          </div>
        ),
        date: (
          <TableCellText suppressHydrationWarning>
            {timeAgo({ from: new Date(), to: new Date(Number(item.timestamp) * 1000) })}
          </TableCellText>
        ),
      },
    }
  })
}
