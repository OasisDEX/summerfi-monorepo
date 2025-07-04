import { type FC, useEffect, useMemo, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {
  Card,
  GenericMultiselect,
  getUniqueVaultId,
  LoadingSpinner,
  type TableSortedColumn,
  Text,
  useMobileCheck,
} from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'

import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { getLatestActivity } from '@/features/latest-activity/api/get-latest-activity'
import { LatestActivityTable } from '@/features/latest-activity/components/LatestActivityTable/LatestActivityTable'
import { mapMultiselectOptions } from '@/features/latest-activity/table/filters/mappers'
import { type PositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'

import classNames from './PortfolioYourActivity.module.css'

interface PortfolioYourActivityProps {
  latestActivity: LatestActivityPagination
  walletAddress: string
  vaultsList: SDKVaultsListType
  positions: PositionWithVault[]
}

export const PortfolioYourActivity: FC<PortfolioYourActivityProps> = ({
  latestActivity,
  walletAddress,
  vaultsList,
  positions,
}) => {
  const isFirstRender = useRef(true)
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const [sortBy, setSortBy] = useState<TableSortedColumn<string> | undefined>()
  const [currentlyLoadedList, setCurrentlyLoadedList] = useState(latestActivity.data)
  const [currentPage, setCurrentPage] = useState(latestActivity.pagination.currentPage)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMoreItems, setHasMoreItems] = useState(true)
  const [strategyFilter, setStrategyFilter] = useState<string[]>([])
  const [tokenFilter, setTokenFilter] = useState<string[]>([])

  const handleSort = (sortConfig: TableSortedColumn<string>) => {
    setSortBy(sortConfig)
  }

  const handleMoreItems = async () => {
    if (!hasMoreItems || isLoading) return

    try {
      const nextPage = currentPage + 1
      const res = await getLatestActivity({
        page: nextPage,
        usersAddresses: [walletAddress],
        sortBy: sortBy?.key,
        orderBy: sortBy?.direction,
        strategies: strategyFilter,
        tokens: tokenFilter,
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

  const resolvedVaultsList = useMemo(() => {
    const userVaults = positions.map(({ vault }) => getUniqueVaultId(vault))

    return vaultsList.filter((vault) => userVaults.includes(getUniqueVaultId(vault)))
  }, [vaultsList, positions])

  const { strategiesOptions, tokensOptions } = useMemo(
    () => mapMultiselectOptions(resolvedVaultsList),
    [resolvedVaultsList],
  )

  const genericMultiSelectFilters = [
    {
      options: strategiesOptions,
      label: 'Strategies',
      onChange: (strategies: string[]) => {
        setStrategyFilter(strategies)
      },
      initialValues: strategyFilter,
    },
    {
      options: tokensOptions,
      label: 'Tokens',
      onChange: (tokens: string[]) => {
        setTokenFilter(tokens)
      },
      initialValues: tokenFilter,
    },
  ]

  const filters = (
    <div className={classNames.filtersWrapper}>
      {genericMultiSelectFilters.map((filter) => (
        <GenericMultiselect
          key={filter.label}
          options={filter.options}
          label={filter.label}
          onChange={filter.onChange}
          initialValues={filter.initialValues}
          style={{ width: isMobile ? '100%' : 'fit-content' }}
        />
      ))}
    </div>
  )

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false

      return
    }

    setIsLoading(true)
    setHasMoreItems(true)

    getLatestActivity({
      page: 1,
      usersAddresses: [walletAddress],
      sortBy: sortBy?.key,
      orderBy: sortBy?.direction,
      strategies: strategyFilter,
      tokens: tokenFilter,
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
  }, [sortBy?.key, sortBy?.direction, walletAddress, strategyFilter, tokenFilter])

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
        {filters}
        <LatestActivityTable
          latestActivityList={currentlyLoadedList}
          hiddenColumns={['strategy']}
          handleSort={handleSort}
          isLoading={isLoading}
          noHighlight
        />
      </InfiniteScroll>
    </Card>
  )
}
