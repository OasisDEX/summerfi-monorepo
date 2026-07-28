'use client'
import { type FC, useEffect, useRef, useState } from 'react'
import { Card, TabBar, type TableSortedColumn, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { getLatestActivity } from '@/features/latest-activity/api/get-latest-activity'
import { getTopDepositors } from '@/features/latest-activity/api/get-top-depositors'
import { LatestActivityTable } from '@/features/latest-activity/components/LatestActivityTable/LatestActivityTable'
import { TopDepositorsTable } from '@/features/latest-activity/components/TopDepositorsTable/TopDepositorsTable'
import { UserActivityTab } from '@/features/latest-activity/types/tabs'

interface LatestActivityProps {
  vaultId: string
  page: 'open' | 'manage'
  noHighlight?: boolean
  topDepositors: TopDepositorsPagination
  latestActivity: LatestActivityPagination
  walletAddress?: string
}

export const LatestActivity: FC<LatestActivityProps> = ({
  topDepositors,
  latestActivity,
  vaultId,
  page,
  noHighlight,
  walletAddress,
}) => {
  const latestActivityHiddenColumns = {
    open: ['strategy', 'position'],
    manage: ['strategy', 'balance', 'position'],
  }[page]

  const [isLoadingActivity, setIsLoadingActivity] = useState(false)
  const [isLoadingDepositors, setIsLoadingDepositors] = useState(false)

  const isFirstRender = useRef(true)

  const [loadedLatestActivityList, setLoadedLatestActivityList] = useState(latestActivity.data)

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

    setIsLoadingActivity(true)

    getLatestActivity({
      page: 1,
      limit: 4,
      strategies: [vaultId],
      sortBy: latestActivitySorting?.key,
      orderBy: latestActivitySorting?.direction,
      usersAddresses: walletAddress ? [walletAddress] : undefined,
    })
      .then((res) => {
        setLoadedLatestActivityList(res.data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching latest activity', error)
      })
      .finally(() => {
        setIsLoadingActivity(false)
      })
  }, [latestActivitySorting?.key, latestActivitySorting?.direction, vaultId, walletAddress])

  useEffect(() => {
    if (isFirstRender.current) {
      return
    }

    setIsLoadingDepositors(true)

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
      .finally(() => {
        setIsLoadingDepositors(false)
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
        <LatestActivityTable
          latestActivityList={loadedLatestActivityList}
          hiddenColumns={latestActivityHiddenColumns}
          noHighlight={noHighlight}
          handleSort={handleLatestActivitySortingChange}
          skeletonLines={4}
          isLoading={isLoadingActivity}
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
          skeletonLines={4}
          isLoading={isLoadingDepositors}
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
