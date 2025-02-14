'use client'
import { type FC, type ReactNode, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {
  LoadingSpinner,
  Table,
  type TableSortedColumn,
  Text,
  useMobileCheck,
} from '@summerfi/app-earn-ui'
import { type SDKGlobalRebalancesType } from '@summerfi/app-types'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import {
  rebalancingActivityColumns,
  rebalancingActivityColumnsHiddenOnMobile,
} from '@/features/rebalance-activity/table/columns'
import { rebalanceActivityFilter } from '@/features/rebalance-activity/table/filters/filters'
import { rebalancingActivityMapper } from '@/features/rebalance-activity/table/mapper'

interface RebalanceActivityTableProps {
  initialRebalancesList: SDKGlobalRebalancesType
  customRow?: {
    idx: number
    content: ReactNode
  }
  hiddenColumns?: string[]
  rowsToDisplay?: number
  filters: {
    strategyFilter: string[]
    tokenFilter: string[]
    protocolFilter: string[]
  }
}

const ITEMS_PER_PAGE = 15

export const RebalanceActivityTable: FC<RebalanceActivityTableProps> = ({
  initialRebalancesList,
  customRow,
  hiddenColumns,
  rowsToDisplay,
  filters,
}) => {
  const [sortConfig, setSortConfig] = useState<TableSortedColumn<string>>()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const [rebalancesList, setRebalancesList] = useState(initialRebalancesList)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const filteredList = useMemo(
    () =>
      rebalanceActivityFilter({
        rebalancesList,
        ...filters,
      }),
    [rebalancesList, filters],
  )

  const rows = useMemo(
    () => rebalancingActivityMapper(filteredList, sortConfig),
    [filteredList, sortConfig],
  )

  const resolvedHiddenColumns = isMobile ? rebalancingActivityColumnsHiddenOnMobile : hiddenColumns

  const loadMoreRebalances = async () => {
    if (isLoading) return

    try {
      setIsLoading(true)
      const skip = currentPage * ITEMS_PER_PAGE

      const response = await fetch(
        `/earn/api/rebalance-activity?first=${ITEMS_PER_PAGE}&skip=${skip}&orderBy=${sortConfig?.key ?? 'timestamp'}&orderDirection=${sortConfig?.direction.toLowerCase() ?? 'desc'}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch rebalances')
      }

      const newRebalances = await response.json()

      if (newRebalances.rebalances.length < ITEMS_PER_PAGE) {
        setHasMore(false)
      }

      setRebalancesList((prev) => [...prev, ...newRebalances.rebalances])
      setCurrentPage((prev) => prev + 1)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading more rebalances:', error)
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSortChange = async (_sortConfig: TableSortedColumn<string>) => {
    try {
      setSortConfig(_sortConfig)
      setIsLoading(true)
      setCurrentPage(1)
      setRebalancesList([])

      const response = await fetch(
        `/earn/api/rebalance-activity?first=${ITEMS_PER_PAGE}&skip=0&orderBy=${sortConfig?.key ?? 'timestamp'}&orderDirection=${sortConfig?.direction.toLowerCase() ?? 'desc'}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch rebalances')
      }

      const newRebalances = await response.json()

      setRebalancesList(newRebalances.rebalances)
      setHasMore(newRebalances.rebalances.length >= ITEMS_PER_PAGE)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading rebalances:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <InfiniteScroll
        pageStart={1}
        loadMore={loadMoreRebalances}
        hasMore={hasMore && !isLoading}
        threshold={100}
      >
        <Table
          rows={rows.slice(0, rowsToDisplay)}
          columns={rebalancingActivityColumns}
          customRow={customRow}
          handleSort={(_sortConfig) => {
            handleSortChange(_sortConfig)
          }}
          hiddenColumns={resolvedHiddenColumns}
          sortConfig={sortConfig}
        />
      </InfiniteScroll>
      {isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: 'var(--general-space-24)',
          }}
        >
          <LoadingSpinner />
        </div>
      )}
      {rows.length === 0 && !isLoading && (
        <Text
          as="p"
          variant="p3semi"
          style={{
            textAlign: 'center',
            marginTop: 'var(--general-space-24)',
            color: 'var(--color-text-secondary)',
          }}
        >
          No activity available to display
        </Text>
      )}
    </>
  )
}
