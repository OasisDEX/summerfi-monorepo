import {
  Button,
  getDisplayToken,
  getVaultPositionUrl,
  Icon,
  TableCellText,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  formatAddress,
  formatCryptoBalance,
  formatDateDifference,
  mapDbNetworkToChainId,
} from '@summerfi/app-utils'
import { type TopDepositors } from '@summerfi/summer-protocol-db'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

export const topDepositorsMapper = (rawData: TopDepositors[]) => {
  return rawData.map((item) => {
    const asset = getDisplayToken(item.inputTokenSymbol) as TokenSymbolsList

    const changeSevenDays = new BigNumber(item.changeSevenDays.toString())
    const changeSign = changeSevenDays.gt(0) ? '+' : ''
    const changeColor = changeSevenDays.isZero()
      ? 'var(--earn-protocol-secondary-100)'
      : changeSevenDays.gt(0)
        ? 'var(--earn-protocol-success-100)'
        : 'var(--earn-protocol-warning-100)'

    const earningsStreak = formatDateDifference({
      value: Number(item.earningsStreak),
    })

    const balance = new BigNumber(item.balance.toString()).shiftedBy(-item.inputTokenDecimals)

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
            <TableCellText>{formatCryptoBalance(balance)}</TableCellText>
          </div>
        ),
        balanceUsd: (
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
        changeSevenDays: (
          <TableCellText style={{ color: changeColor }}>
            {changeSign}
            {formatCryptoBalance(changeSevenDays)}
          </TableCellText>
        ),
        projectedOneYearEarnings: (
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
        noOfDeposits: <TableCellText>{item.noOfDeposits.toString()}</TableCellText>,
        earningsStreak: <TableCellText>{earningsStreak}</TableCellText>,
        link: (
          <Link
            href={getVaultPositionUrl({
              network: chainIdToSDKNetwork(mapDbNetworkToChainId(item.network)),
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
