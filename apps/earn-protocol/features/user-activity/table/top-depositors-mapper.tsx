import {
  getVaultPositionUrl,
  Icon,
  TableCellText,
  type TableSortedColumn,
  WithArrow,
} from '@summerfi/app-earn-ui'
import {
  type SDKUserActivityType,
  type SDKUsersActivityType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatCryptoBalance, getPastTimestamp } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { topDepositorsSorter } from '@/features/user-activity/table/top-depositors-sorter'

export const calculateTopDepositors7daysChange = (item: SDKUserActivityType) => {
  const timeStamp7daysAgo = getPastTimestamp(7)

  const depositsFromLast7Days = item.deposits
    .filter((deposit) => Number(deposit.timestamp) * 1000 > timeStamp7daysAgo)
    .reduce((acc, curr) => acc + Number(curr.amount), 0)

  const withdrawalsFromLast7Days = item.withdrawals
    .filter((withdraw) => Number(withdraw.timestamp) * 1000 > timeStamp7daysAgo)
    .reduce((acc, curr) => acc + Number(curr.amount), 0)

  return new BigNumber(depositsFromLast7Days - withdrawalsFromLast7Days).shiftedBy(
    -item.vault.inputToken.decimals,
  )
}

export const topDepositorsMapper = (
  rawData: SDKUsersActivityType,
  sortConfig?: TableSortedColumn<string>,
) => {
  const sorted = topDepositorsSorter({ data: rawData, sortConfig })

  return sorted.map((item) => {
    const { decimals } = item.vault.inputToken
    const asset = item.vault.inputToken.symbol as TokenSymbolsList
    const balance = new BigNumber(item.inputTokenBalance.toString()).shiftedBy(-decimals)

    const change7days = calculateTopDepositors7daysChange(item)
    const changeSign = change7days.gt(0) ? '+' : ''
    const changeColor = change7days.isZero()
      ? 'var(--earn-protocol-secondary-100)'
      : change7days.gt(0)
        ? 'var(--earn-protocol-success-100)'
        : 'var(--earn-protocol-warning-100)'

    return {
      content: {
        user: <TableCellText>{item.account.id.slice(0, 8)}</TableCellText>,
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
        strategy: <TableCellText>{item.vault.name}</TableCellText>,
        change7d: (
          <TableCellText style={{ color: changeColor }}>
            {changeSign}
            {formatCryptoBalance(change7days)}
          </TableCellText>
        ),
        projected1yrEarnings: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-space-2x-small)',
            }}
          >
            <Icon tokenName={asset} variant="s" />
            <TableCellText>
              {formatCryptoBalance(balance.times(item.vault.apr365d).div(100))}
            </TableCellText>
          </div>
        ),
        numberOfDeposits: <TableCellText>{item.deposits.length}</TableCellText>,
        earningsStreak: <TableCellText>TBD</TableCellText>,
        link: (
          <Link
            href={getVaultPositionUrl({
              network: item.vault.protocol.network,
              vaultId: item.vault.id,
              walletAddress: item.account.id,
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
