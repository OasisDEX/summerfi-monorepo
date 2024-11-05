'use client'
import { type FC } from 'react'
import { Card, TabBar, WithArrow } from '@summerfi/app-earn-ui'
import { type SDKUsersActivityType, type UsersActivity } from '@summerfi/app-types'
import Link from 'next/link'

import { TopDepositorsTable } from '@/features/user-activity/components/TopDepositorsTable/TopDepositorsTable'
import { UserActivityTable } from '@/features/user-activity/components/UserActivityTable/UserActivityTable'
import { UserActivityTab } from '@/features/user-activity/types/tabs'

interface UserActivityProps {
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  vaultId: string
  page: 'open' | 'manage'
}

export const UserActivity: FC<UserActivityProps> = ({
  userActivity,
  topDepositors,
  vaultId,
  page,
}) => {
  const userActivityHiddenColumns = {
    open: ['strategy'],
    manage: ['strategy', 'link', 'balance'],
  }[page]

  const tabs = [
    {
      id: UserActivityTab.LATEST_ACTIVITY,
      label: 'Latest activity',
      content: (
        <UserActivityTable
          userActivityList={userActivity}
          hiddenColumns={userActivityHiddenColumns}
          rowsToDisplay={4}
        />
      ),
    },
    {
      id: UserActivityTab.TOP_DEPOSITORS,
      label: 'Top depositors',
      content: (
        <TopDepositorsTable
          topDepositorsList={topDepositors}
          hiddenColumns={['user', 'strategy', 'numberOfDeposits']}
          rowsToDisplay={4}
        />
      ),
    },
  ]

  return (
    <Card variant="cardSecondary" style={{ marginTop: 'var(--spacing-space-medium)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <TabBar tabs={tabs} textVariant="p3semi" />
        <Link href={`/earn/users-activity?strategies=${vaultId}`} style={{ width: 'fit-content' }}>
          <WithArrow as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            View all depositors
          </WithArrow>
        </Link>
      </div>
    </Card>
  )
}
