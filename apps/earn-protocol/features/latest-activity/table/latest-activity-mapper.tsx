import {
  Button,
  getDisplayToken,
  getScannerUrl,
  getVaultPositionUrl,
  Icon,
  TableCellText,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  formatCryptoBalance,
  mapDbNetworkToChainId,
  timeAgo,
} from '@summerfi/app-utils'
import { type LatestActivity } from '@summerfi/summer-protocol-db'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { networkSDKChainIdIconMap } from '@/constants/network-id-to-icon'

const activityLabelMap: { [key in LatestActivity['actionType']]: string } = {
  deposit: 'Deposit',
  withdraw: 'Withdraw',
}

const activityColorMap: { [key in LatestActivity['actionType']]: string } = {
  deposit: 'var(--earn-protocol-success-100)',
  withdraw: 'var(--earn-protocol-warning-100)',
}

export const latestActivityMapper = (rawData: LatestActivity[]) => {
  return rawData.map((item) => {
    const asset = getDisplayToken(item.inputTokenSymbol) as TokenSymbolsList
    const amount = new BigNumber(item.amount.toString()).shiftedBy(-item.inputTokenDecimals)
    const balance = new BigNumber(item.balance.toString()).shiftedBy(-item.inputTokenDecimals)

    return {
      id: item.userAddress,
      content: {
        position: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-space-2x-small)',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', top: '-5px', left: '-3px' }}>
              {networkSDKChainIdIconMap(mapDbNetworkToChainId(item.network), 10)}
            </div>
            <Icon tokenName={asset} variant="s" />
            <TableCellText>{asset}</TableCellText>
          </div>
        ),
        activity: (
          <TableCellText style={{ color: activityColorMap[item.actionType] }}>
            {activityLabelMap[item.actionType]}
          </TableCellText>
        ),
        amountUsd: (
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
        strategy: <TableCellText style={{ whiteSpace: 'nowrap' }}>{item.strategy}</TableCellText>,
        timestamp: (
          <TableCellText suppressHydrationWarning>
            {timeAgo({ from: new Date(), to: new Date(Number(item.timestamp) * 1000) })}
          </TableCellText>
        ),
        balanceUsd: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-space-2x-small)',
            }}
          >
            <Icon tokenName={asset} variant="s" />
            <TableCellText>
              <Link
                href={getVaultPositionUrl({
                  network: chainIdToSDKNetwork(mapDbNetworkToChainId(item.network)),
                  vaultId: item.vaultId,
                  walletAddress: item.userAddress,
                })}
                style={{ cursor: 'pointer' }}
              >
                {formatCryptoBalance(balance)}
              </Link>
            </TableCellText>
          </div>
        ),
        link: (
          <Link
            href={getScannerUrl(mapDbNetworkToChainId(item.network), item.txHash)}
            target="_blank"
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
