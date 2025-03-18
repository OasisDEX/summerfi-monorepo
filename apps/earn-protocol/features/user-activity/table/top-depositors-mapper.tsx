import {
  Button,
  getDisplayToken,
  getVaultPositionUrl,
  Icon,
  TableCellText,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { type SDKUserActivityType, type TokenSymbolsList } from '@summerfi/app-types'
import {
  formatAddress,
  formatCryptoBalance,
  formatDateDifference,
  getPastTimestamp,
} from '@summerfi/app-utils'
import { type TopDepositors } from '@summerfi/summer-protocol-db'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { dbNetworkToSdkNetworkMap } from '@/app/server-handlers/tables-data/consts'

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

export const topDepositorsMapper = (rawData: TopDepositors[]) => {
  return rawData.map((item) => {
    const asset = getDisplayToken(item.inputTokenSymbol) as TokenSymbolsList

    const change7days = new BigNumber(item.changeSevenDays.toString())
    const changeSign = change7days.gt(0) ? '+' : ''
    const changeColor = change7days.isZero()
      ? 'var(--earn-protocol-secondary-100)'
      : change7days.gt(0)
        ? 'var(--earn-protocol-success-100)'
        : 'var(--earn-protocol-warning-100)'

    const earningStreak = formatDateDifference({
      value: Number(item.earningStreak),
    })

    return {
      content: {
        user: (
          <TableCellText>{formatAddress(item.userAddress, { first: 4, last: 3 })}</TableCellText>
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
            <TableCellText>{formatCryptoBalance(item.balance.toString())}</TableCellText>
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
            <TableCellText>${formatCryptoBalance(item.balanceUsd.toString())}</TableCellText>
          </div>
        ),
        strategy: <TableCellText style={{ whiteSpace: 'nowrap' }}>{item.strategy}</TableCellText>,
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
              {formatCryptoBalance(item.projectedOneYearEarnings.toString())}
            </TableCellText>
          </div>
        ),
        numberOfDeposits: <TableCellText>{item.noOfDeposits.toString()}</TableCellText>,
        earningsStreak: <TableCellText>{earningStreak}</TableCellText>,
        link: (
          <Link
            href={getVaultPositionUrl({
              network: dbNetworkToSdkNetworkMap[item.network],
              vaultId: item.vaultId,
              walletAddress: item.userAddress,
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
