import { type FC, useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Card, LoadingSpinner, type TableSortedColumn, Text } from '@summerfi/app-earn-ui'

import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { getLatestActivity } from '@/features/latest-activity/api/get-latest-activity'
import { LatestActivityTable } from '@/features/latest-activity/components/LatestActivityTable/LatestActivityTable'

import classNames from './PortfolioYourActivity.module.css'

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
  const [hasMoreItems, setHasMoreItems] = useState(true)

  const handleSort = (sortConfig: TableSortedColumn<string>) => {
    setSortBy(sortConfig)
  }

  const handleMoreItems = async () => {
    if (!hasMoreItems || isLoading) return

    try {
      const nextPage = currentPage + 1
      const res = await getLatestActivity({
        page: nextPage,
        userAddress: walletAddress,
        sortBy: sortBy?.key,
        orderBy: sortBy?.direction,
      })

      if (res.data.length === 0 || nextPage >= latestActivity.pagination.totalPages) {
        setHasMoreItems(false)
      }
      setCurrentlyLoadedList((prev) => [...prev, ...res.data])
      setCurrentPage((prev) => prev + 1)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.info('Error fetching more latest activity items', error)
      setHasMoreItems(false)
    }
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false

      return
    }

    setIsLoading(true)
    setHasMoreItems(true)

    getLatestActivity({
      page: 1,
      userAddress: walletAddress,
      sortBy: sortBy?.key,
      orderBy: sortBy?.direction,
    })
      .then((res) => {
        setCurrentlyLoadedList(res.data)
        setCurrentPage(1)

        if (res.data.length === 0 || res.pagination.currentPage >= res.pagination.totalPages) {
          setHasMoreItems(false)
        }
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
        hasMore={hasMoreItems}
        loader={
          // inversed, we don't want loading spinner when skeleton is visible
          !isLoading ? (
            <LoadingSpinner
              key="spinner"
              style={{ margin: '0 auto', marginTop: 'var(--spacing-space-medium)' }}
            />
          ) : undefined
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
