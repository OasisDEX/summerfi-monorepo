import {
  Button,
  getDisplayToken,
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
import {
  formatAddress,
  formatCryptoBalance,
  formatDateDifference,
  getHumanReadableFleetName,
  getPastTimestamp,
  subgraphNetworkToId,
  zero,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { type GetVaultsApyResponse } from '@/app/server-handlers/vaults-apy'
import { getEarningStreakResetTimestamp } from '@/features/user-activity/helpers/get-earning-streak-reset-timestamp'
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
  vaultsApyData: GetVaultsApyResponse,
  sortConfig?: TableSortedColumn<string>,
) => {
  const sorted = topDepositorsSorter({ data: rawData, sortConfig })

  return sorted.map((item) => {
    const { decimals } = item.vault.inputToken
    const asset = getDisplayToken(item.vault.inputToken.symbol) as TokenSymbolsList
    const balance = new BigNumber(item.inputTokenBalance.toString()).shiftedBy(-decimals)
    const balanceUSD = balance.times(new BigNumber(item.vault.inputTokenPriceUSD as string))

    const change7days = calculateTopDepositors7daysChange(item)
    const changeSign = change7days.gt(0) ? '+' : ''
    const changeColor = change7days.isZero()
      ? 'var(--earn-protocol-secondary-100)'
      : change7days.gt(0)
        ? 'var(--earn-protocol-success-100)'
        : 'var(--earn-protocol-warning-100)'

    const earningStreakResetTimestamp = getEarningStreakResetTimestamp(item)

    const earningStreak = formatDateDifference({
      from: new Date(earningStreakResetTimestamp),
      to: new Date(),
    })

    return {
      content: {
        user: (
          <TableCellText>{formatAddress(item.account.id, { first: 4, last: 3 })}</TableCellText>
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
        balanceUSD: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-space-2x-small)',
            }}
          >
            <TableCellText>${formatCryptoBalance(balanceUSD)}</TableCellText>
          </div>
        ),
        strategy: (
          <TableCellText style={{ whiteSpace: 'nowrap' }}>
            {getHumanReadableFleetName(item.vault.protocol.network, item.vault.name)}
          </TableCellText>
        ),
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
              fontWeight: 600,
            }}
          >
            <Icon tokenName={asset} variant="s" />
            <TableCellText>
              {formatCryptoBalance(
                balance.times(
                  (
                    vaultsApyData[
                      `${item.vault.id}-${subgraphNetworkToId(item.vault.protocol.network)}`
                    ] as { apy: number } | undefined
                  )?.apy ?? zero,
                ),
              )}
            </TableCellText>
          </div>
        ),
        numberOfDeposits: <TableCellText>{item.deposits.length}</TableCellText>,
        earningsStreak: <TableCellText>{earningStreak}</TableCellText>,
        link: (
          <Link
            href={getVaultPositionUrl({
              network: item.vault.protocol.network,
              vaultId: item.vault.id,
              walletAddress: item.account.id,
            })}
          >
            <Button variant="textPrimaryMedium">
              <WithArrow as="p" variant="p3semi" style={{ color: 'inherit' }} withStatic>
                View
              </WithArrow>
            </Button>
          </Link>
        ),
      },
    }
  })
}
