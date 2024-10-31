import { TableCellText, WithArrow } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatFiatBalance, timeAgo } from '@summerfi/app-utils'
import Link from 'next/link'

import { type UserActivityRawData } from '@/components/organisms/UserActivity/UserActivity'

export const userActivityMapper = (rawData: UserActivityRawData[]) => {
  return rawData.map((item) => {
    return {
      content: {
        balance: <TableCellText>{formatCryptoBalance(item.balance)}</TableCellText>,
        amount: <TableCellText>${formatFiatBalance(item.amount)}</TableCellText>,
        numberOfDeposits: <TableCellText>{item.numberOfDeposits}</TableCellText>,
        time: (
          <TableCellText>
            {timeAgo({ from: new Date(), to: new Date(Number(item.time)) })}
          </TableCellText>
        ),
        earningStreak: (
          <Link href={item.earningStreak.link}>
            <WithArrow
              as="p"
              variant="p3"
              style={{ color: 'var(--earn-protocol-primary-100)' }}
              reserveSpace
              withStatic
            >
              {item.earningStreak.label}
            </WithArrow>
          </Link>
        ),
      },
    }
  })
}
