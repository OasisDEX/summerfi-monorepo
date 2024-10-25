'use client'
import { type FC, useMemo } from 'react'
import { Card, TabBar, Table, WithArrow } from '@summerfi/app-earn-ui'
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
  const rows = useMemo(() => userActivityMapper(rawData), [rawData])
  const tabs = [
    {
      id: UserActivityType.TOP_DEPOSITORS,
      label: 'Top depositors',
      content: <Table rows={rows} columns={userActivityColumns} />,
    },
    { id: UserActivityType.LATEST_ACTIVITY, label: 'Latest activity', content: <></> },
  ]

  return (
    <Card variant="cardSecondary" style={{ marginTop: 'var(--spacing-space-medium)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <TabBar tabs={tabs} textVariant="p3semi" />
        <Link href="/" style={{ width: 'fit-content' }}>
          <WithArrow as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            View all depositors
          </WithArrow>
        </Link>
      </div>
    </Card>
  )
}
