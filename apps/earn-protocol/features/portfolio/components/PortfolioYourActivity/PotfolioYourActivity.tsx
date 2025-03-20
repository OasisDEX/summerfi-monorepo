import { type FC, useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Card, LoadingSpinner, type TableSortedColumn, Text } from '@summerfi/app-earn-ui'
import { type LatestActivity } from '@summerfi/summer-protocol-db'

import { getUsersActivity } from '@/features/user-activity/api/get-users-activity'
import { UserActivityTable } from '@/features/user-activity/components/UserActivityTable/UserActivityTable'

import classNames from './PortfolioYourActivity.module.scss'

interface PortfolioYourActivityProps {
  userActivity: {
    data: LatestActivity[]
    pagination: {
      currentPage: number
      totalPages: number
      totalItems: number
      itemsPerPage: number
    }
    medianDeposit: number
    totalDeposits: number
  }
  walletAddress: string
}

export const PortfolioYourActivity: FC<PortfolioYourActivityProps> = ({
  userActivity,
  walletAddress,
}) => {
  const isFirstRender = useRef(true)

  const [sortBy, setSortBy] = useState<TableSortedColumn<string> | undefined>()
  const [currentlyLoadedList, setCurrentlyLoadedList] = useState(userActivity.data)
  const [currentPage, setCurrentPage] = useState(userActivity.pagination.currentPage)
  const [isLoading, setIsLoading] = useState(false)

  const handleSort = (sortConfig: TableSortedColumn<string>) => {
    setSortBy(sortConfig)
  }

  const handleMoreItems = async () => {
    try {
      setIsLoading(true)
      const res = await getUsersActivity({
        page: currentPage + 1,
        userAddress: walletAddress,
        sortBy: sortBy?.key,
        orderBy: sortBy?.direction,
      })

      setCurrentlyLoadedList((prev) => [...prev, ...res.data])
      setCurrentPage((prev) => prev + 1)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.info('No more users activity items to load')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false

      return
    }

    setIsLoading(true)

    getUsersActivity({
      page: 1,
      userAddress: walletAddress,
      sortBy: sortBy?.key,
      orderBy: sortBy?.direction,
    })
      .then((res) => {
        setCurrentlyLoadedList(res.data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching users activity', error)
      })
      .finally(() => setIsLoading(false))
  }, [sortBy?.key, sortBy?.direction, walletAddress])

  return (
    <Card className={classNames.wrapper} variant="cardSecondary">
      <Text as="h5" variant="h5" className={classNames.header}>
        Your Activity
      </Text>
      <InfiniteScroll
        loadMore={handleMoreItems}
        hasMore={
          userActivity.pagination.totalPages > currentPage &&
          currentlyLoadedList.length > 0 &&
          !isLoading
        }
        loader={
          <LoadingSpinner
            key="spinner"
            style={{ margin: '0 auto', marginTop: 'var(--spacing-space-medium)' }}
          />
        }
      >
        <UserActivityTable
          userActivityList={currentlyLoadedList}
          hiddenColumns={['strategy']}
          handleSort={handleSort}
        />
      </InfiniteScroll>
    </Card>
  )
}
