import { type FC, useMemo, useState } from 'react'
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
import { useLatestActivityInfiniteQuery } from '@/features/latest-activity/api/get-latest-activity'
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
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const [sortBy, setSortBy] = useState<TableSortedColumn<string> | undefined>()
  const [strategyFilter, setStrategyFilter] = useState<string[]>([])
  const [tokenFilter, setTokenFilter] = useState<string[]>([])

  const handleSort = (sortConfig: TableSortedColumn<string>) => {
    setSortBy(sortConfig)
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

  // For portfolio component, hydrate from server only when no filters are applied
  // since this component uses local state instead of URL params
  const shouldHydrateFromServer =
    strategyFilter.length === 0 && tokenFilter.length === 0 && sortBy?.key === ''

  const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useLatestActivityInfiniteQuery({
      strategies: strategyFilter,
      tokens: tokenFilter,
      sortBy: sortBy?.key,
      orderBy: sortBy?.direction,
      initialData: shouldHydrateFromServer ? latestActivity : undefined,
      usersAddresses: walletAddress ? [walletAddress] : undefined,
    })

  const currentlyLoadedList = useMemo(
    () => (data ? data.pages.flatMap((p) => p.data) : latestActivity.data),
    [data, latestActivity.data],
  )

  const handleLoadMore = () => {
    if (isFetchingNextPage || !hasNextPage) return
    void fetchNextPage()
  }

  return (
    <Card className={classNames.wrapper} variant="cardSecondary">
      <Text as="h5" variant="h5" className={classNames.header}>
        Your Activity
      </Text>
      <InfiniteScroll
        loadMore={handleLoadMore}
        hasMore={!!hasNextPage}
        loader={
          isFetchingNextPage ? (
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
          isLoading={isPending}
          noHighlight
        />
      </InfiniteScroll>
    </Card>
  )
}
