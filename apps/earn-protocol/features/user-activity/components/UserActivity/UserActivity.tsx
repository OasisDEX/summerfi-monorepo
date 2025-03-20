'use client'
import { type FC, useEffect, useRef, useState } from 'react'
import { Card, TabBar, type TableSortedColumn, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { type UsersActivitiesPagination } from '@/app/server-handlers/tables-data/users-activities/types'
import { getTopDepositors } from '@/features/user-activity/api/get-top-depositors'
import { getUsersActivity } from '@/features/user-activity/api/get-users-activity'
import { TopDepositorsTable } from '@/features/user-activity/components/TopDepositorsTable/TopDepositorsTable'
import { UserActivityTable } from '@/features/user-activity/components/UserActivityTable/UserActivityTable'
import { UserActivityTab } from '@/features/user-activity/types/tabs'

interface UserActivityProps {
  vaultId: string
  page: 'open' | 'manage'
  noHighlight?: boolean
  topDepositors: TopDepositorsPagination
  usersActivities: UsersActivitiesPagination
  walletAddress?: string
}

export const UserActivity: FC<UserActivityProps> = ({
  topDepositors,
  usersActivities,
  vaultId,
  page,
  noHighlight,
  walletAddress,
}) => {
  const userActivityHiddenColumns = {
    open: ['strategy', 'position'],
    manage: ['strategy', 'balance', 'position'],
  }[page]

  const isFirstRender = useRef(true)

  const [loadedUserActivityList, setLoadedUserActivityList] = useState(usersActivities.data)

  const [loadedTopDepositorsList, setLoadedTopDepositorsList] = useState(topDepositors.data)

  const [latestActivitySorting, setLatestActivitySorting] = useState<
    TableSortedColumn<string> | undefined
  >()

  const [topDepositorsSorting, setTopDepositorsSorting] = useState<
    TableSortedColumn<string> | undefined
  >()

  const handleLatestActivitySortingChange = (sorting: TableSortedColumn<string>) => {
    setLatestActivitySorting(sorting)
  }

  const handleTopDepositorsSortingChange = (sorting: TableSortedColumn<string>) => {
    setTopDepositorsSorting(sorting)
  }

  useEffect(() => {
    if (isFirstRender.current) {
      return
    }

    getUsersActivity({
      page: 1,
      limit: 4,
      strategies: [vaultId],
      sortBy: latestActivitySorting?.key,
      orderBy: latestActivitySorting?.direction,
      userAddress: walletAddress,
    })
      .then((res) => {
        setLoadedUserActivityList(res.data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching user activity', error)
      })
  }, [latestActivitySorting?.key, latestActivitySorting?.direction, vaultId, walletAddress])

  useEffect(() => {
    if (isFirstRender.current) {
      return
    }

    getTopDepositors({
      page: 1,
      limit: 4,
      strategies: [vaultId],
      sortBy: topDepositorsSorting?.key,
      orderBy: topDepositorsSorting?.direction,
    })
      .then((res) => {
        setLoadedTopDepositorsList(res.data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching top depositors', error)
      })
  }, [topDepositorsSorting?.key, topDepositorsSorting?.direction, vaultId])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

  const tabs = [
    {
      id: UserActivityTab.LATEST_ACTIVITY,
      label: 'Latest activity',
      content: (
        <UserActivityTable
          userActivityList={loadedUserActivityList}
          hiddenColumns={userActivityHiddenColumns}
          noHighlight={noHighlight}
          handleSort={handleLatestActivitySortingChange}
        />
      ),
    },
    {
      id: UserActivityTab.TOP_DEPOSITORS,
      label: 'Top depositors',
      content: (
        <TopDepositorsTable
          topDepositorsList={loadedTopDepositorsList}
          hiddenColumns={['user', 'strategy', 'noOfDeposits']}
          handleSort={handleTopDepositorsSortingChange}
        />
      ),
    },
  ]

  return (
    <Card style={{ marginTop: 'var(--spacing-space-medium)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <TabBar
          tabs={tabs}
          textVariant="p3semi"
          tabHeadersStyle={{ borderBottom: '1px solid var(--earn-protocol-neutral-80)' }}
        />
        <Link href={`/user-activity?strategies=${vaultId}`} style={{ width: 'fit-content' }}>
          <WithArrow as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            View all depositors
          </WithArrow>
        </Link>
      </div>
    </Card>
  )
}
