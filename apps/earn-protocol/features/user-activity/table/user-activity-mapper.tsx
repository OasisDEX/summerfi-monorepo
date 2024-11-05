import {
  getVaultPositionUrl,
  Icon,
  TableCellText,
  type TableSortedColumn,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { type TokenSymbolsList, UserActivityType } from '@summerfi/app-types'
import { formatCryptoBalance, timeAgo } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { type UsersActivity } from '@/app/server-handlers/sdk/get-users-activity'
import { userActivitySorter } from '@/features/user-activity/table/user-activity-sorter'

const activityLabelMap = {
  [UserActivityType.DEPOSIT]: 'Deposit',
  [UserActivityType.WITHDRAW]: 'Withdraw',
}

const activityColorMap = {
  [UserActivityType.DEPOSIT]: 'var(--earn-protocol-success-100)',
  [UserActivityType.WITHDRAW]: 'var(--earn-protocol-warning-100)',
}

export const userActivityMapper = (
  rawData: UsersActivity,
  sortConfig?: TableSortedColumn<string>,
) => {
  const sorted = userActivitySorter({ data: rawData, sortConfig })

  return sorted.map((item) => {
    const asset = item.vault.inputToken.symbol as TokenSymbolsList
    const amount = new BigNumber(item.amount.toString()).shiftedBy(-item.vault.inputToken.decimals)
    const balance = new BigNumber(item.balance.toString()).shiftedBy(
      -item.vault.inputToken.decimals,
    )

    return {
      content: {
        activity: (
          <TableCellText style={{ color: activityColorMap[item.activity] }}>
            {activityLabelMap[item.activity]}
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
        strategy: <TableCellText>{item.vault.name}</TableCellText>,
        timestamp: (
          <TableCellText>
            {timeAgo({ from: new Date(), to: new Date(Number(item.timestamp) * 1000) })}
          </TableCellText>
        ),
        balance: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-space-2x-small)',
            }}
          >
            <Icon tokenName={asset} variant="s" />
            <TableCellText>{formatCryptoBalance(balance)}</TableCellText>
          </div>
        ),
        link: (
          <Link
            href={getVaultPositionUrl({
              network: item.vault.protocol.network,
              vaultId: item.vault.id,
              walletAddress: item.account,
            })}
          >
            <WithArrow
              as="p"
              variant="p4semi"
              style={{ color: 'var(--earn-protocol-primary-100)' }}
              withStatic
            >
              View
            </WithArrow>
          </Link>
        ),
      },
    }
  })
}
