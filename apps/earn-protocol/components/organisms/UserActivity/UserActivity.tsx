'use client'
import { type FC, useMemo, useState } from 'react'
import { Button, Card, Table, TableCellText, Text, WithArrow } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatFiatBalance, timeAgo } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

const columns = [
  {
    title: 'Position Balance',
    key: 'balance',
    sortable: false,
  },
  {
    title: 'Amout',
    key: 'amount',
    sortable: false,
  },
  {
    title: '# of Deposits',
    key: 'numberOfDeposits',
    sortable: false,
  },
  {
    title: 'Time',
    key: 'time',
    sortable: false,
  },
  {
    title: 'Earning streak',
    key: 'earningStreak',
    sortable: false,
  },
]

export interface UserActivityRawData {
  balance: string
  amount: string
  numberOfDeposits: string
  time: string
  earningStreak: {
    link: string
    label: string
  }
}

const userActivityMapper = (rawData: UserActivityRawData[]) => {
  return rawData.map((item) => {
    return {
      content: {
        balance: <TableCellText>{formatCryptoBalance(new BigNumber(item.balance))}</TableCellText>,
        amount: <TableCellText>${formatFiatBalance(new BigNumber(item.amount))}</TableCellText>,
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
            >
              {item.earningStreak.label}
            </WithArrow>
          </Link>
        ),
      },
    }
  })
}

interface UserActivityProps {
  rawData: UserActivityRawData[]
}

enum UserActivityType {
  TOP_DEPOSITORS = 'TOP_DEPOSITORS',
  LATEST_ACTIVITY = 'LATEST_ACTIVITY',
}

export const UserActivity: FC<UserActivityProps> = ({ rawData }) => {
  // to be used for backend queries
  const [userActivityType, setUserActivityType] = useState(UserActivityType.LATEST_ACTIVITY)

  const rows = useMemo(() => userActivityMapper(rawData), [rawData])

  return (
    <Card variant="cardSecondary" style={{ marginTop: 'var(--spacing-space-medium)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-space-medium)' }}>
          <Button
            variant="unstyled"
            onClick={() => setUserActivityType(UserActivityType.TOP_DEPOSITORS)}
          >
            <Text
              as="p"
              variant="p2semi"
              style={{
                marginBottom: 'var(--spacing-space-large)',
                color: `var(${userActivityType === UserActivityType.TOP_DEPOSITORS ? '--earn-protocol-secondary-100' : '--earn-protocol-secondary-40'})`,
              }}
            >
              Top depositors
            </Text>
          </Button>
          <Button
            variant="unstyled"
            onClick={() => setUserActivityType(UserActivityType.LATEST_ACTIVITY)}
          >
            <Text
              as="p"
              variant="p2semi"
              style={{
                marginBottom: 'var(--spacing-space-large)',
                color: `var(${userActivityType === UserActivityType.LATEST_ACTIVITY ? '--earn-protocol-secondary-100' : '--earn-protocol-secondary-40'})`,
              }}
            >
              Latest activity
            </Text>
          </Button>
        </div>
        <Table rows={rows} columns={columns} />
        <Link href="/" style={{ marginTop: 'var(--spacing-space-large)', width: 'fit-content' }}>
          <WithArrow as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            View all depositors
          </WithArrow>
        </Link>
      </div>
    </Card>
  )
}
