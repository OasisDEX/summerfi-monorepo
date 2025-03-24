import { type FC, useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Card, LoadingSpinner, type TableSortedColumn, Text } from '@summerfi/app-earn-ui'

import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { getLatestActivity } from '@/features/latest-activity/api/get-latest-activity'
import { LatestActivityTable } from '@/features/latest-activity/components/LatestActivityTable/LatestActivityTable'

import classNames from './PortfolioYourActivity.module.scss'

interface PortfolioYourActivityProps {
  latestActivity: LatestActivityPagination
  walletAddress: string
}

export const PortfolioYourActivity: FC<PortfolioYourActivityProps> = ({
  latestActivity,
  walletAddress,
}) => {
  const isFirstRender = useRef(true)

  const [sortBy, setSortBy] = useState<TableSortedColumn<string> | undefined>()
  const [currentlyLoadedList, setCurrentlyLoadedList] = useState(latestActivity.data)
  const [currentPage, setCurrentPage] = useState(latestActivity.pagination.currentPage)
  const [isLoading, setIsLoading] = useState(false)

  const handleSort = (sortConfig: TableSortedColumn<string>) => {
    setSortBy(sortConfig)
  }

  const handleMoreItems = async () => {
    try {
      const res = await getLatestActivity({
        page: currentPage + 1,
        userAddress: walletAddress,
        sortBy: sortBy?.key,
        orderBy: sortBy?.direction,
      })

      setCurrentlyLoadedList((prev) => [...prev, ...res.data])
      setCurrentPage((prev) => prev + 1)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.info('No more latest activity items to load')
    }
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false

      return
    }

    setIsLoading(true)

    getLatestActivity({
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
          latestActivity.pagination.totalPages > currentPage &&
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
        <LatestActivityTable
          latestActivityList={currentlyLoadedList}
          hiddenColumns={['strategy']}
          handleSort={handleSort}
          isLoading={isLoading}
        />
      </InfiniteScroll>
    </Card>
  )
}
