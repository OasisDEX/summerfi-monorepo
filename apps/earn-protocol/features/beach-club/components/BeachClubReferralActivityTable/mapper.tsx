import { Button, Icon, TableCellText, WithArrow } from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'
import { formatAddress, formatCryptoBalance, timeAgo } from '@summerfi/app-utils'
import Link from 'next/link'

import { type BeachClubReferralActivity } from '@/app/server-handlers/beach-club/get-user-beach-club-data'
import { PortfolioTabs } from '@/features/portfolio/types'

const actionLabelMap: { [key in BeachClubReferralActivity['actionType']]: string } = {
  deposit: 'Deposit',
  withdraw: 'Withdraw',
}

const actionColorMap: { [key in BeachClubReferralActivity['actionType']]: string } = {
  deposit: 'var(--earn-protocol-success-100)',
  withdraw: 'var(--earn-protocol-warning-100)',
}

export const referralActivityMapper = (rawData: BeachClubReferralActivity[]) => {
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
        amount: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-space-2x-small)',
            }}
          >
            <Icon tokenName={item.inputTokenSymbol as TokenSymbolsList} variant="s" />
            <TableCellText>{formatCryptoBalance(item.amountNormalized)}</TableCellText>
          </div>
        ),
        date: (
          <TableCellText suppressHydrationWarning>
            {timeAgo({ from: new Date(), to: new Date(Number(item.timestamp) * 1000) })}
          </TableCellText>
        ),
        link: (
          <Link
            href={`/portfolio/${item.userAddress}?tab=${PortfolioTabs.YOUR_ACTIVITY}`}
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
