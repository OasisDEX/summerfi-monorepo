'use client'
import { type FC, useMemo, useState } from 'react'
import { Button, Card, Table, Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { userActivityColumns } from '@/components/organisms/UserActivity/columns'
import { userActivityMapper } from '@/components/organisms/UserActivity/mapper'

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
        <Table rows={rows} columns={userActivityColumns} />
        <Link href="/" style={{ marginTop: 'var(--spacing-space-large)', width: 'fit-content' }}>
          <WithArrow as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            View all depositors
          </WithArrow>
        </Link>
      </div>
    </Card>
  )
}
