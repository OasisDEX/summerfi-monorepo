import { getDisplayToken, Icon, TableCellText } from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance, formatFiatBalance, timeAgo } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

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
    const asset = getDisplayToken(item.inputTokenSymbol) as TokenSymbolsList
    const amount = new BigNumber(item.amount.toString()).shiftedBy(-item.inputTokenDecimals)

    return {
      id: item.userAddress,
      content: {
        address: <TableCellText>{item.userAddress}</TableCellText>,
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
            <TableCellText>{formatFiatBalance(amount)}</TableCellText>
          </div>
        ),
        strategy: <TableCellText style={{ whiteSpace: 'nowrap' }}>{item.strategy}</TableCellText>,
        date: (
          <TableCellText suppressHydrationWarning>
            {timeAgo({ from: new Date(), to: new Date(Number(item.timestamp) * 1000) })}
          </TableCellText>
        ),
        amount: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-space-2x-small)',
            }}
          >
            <Icon tokenName={asset} variant="s" />
            <TableCellText>{formatCryptoBalance(amount)}</TableCellText>
          </div>
        ),
      },
    }
  })
}
