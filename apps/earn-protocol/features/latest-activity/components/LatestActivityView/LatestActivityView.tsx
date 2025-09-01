'use client'
import { type FC, useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {
  GenericMultiselect,
  getTwitterShareUrl,
  HeadingWithCards,
  LoadingSpinner,
  TabBar,
  TableCarousel,
  type TableSortedColumn,
  useCurrentUrl,
  useMobileCheck,
  useQueryParams,
} from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'

import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { useLatestActivityInfiniteQuery } from '@/features/latest-activity/api/get-latest-activity'
import { useTopDepositorsInfiniteQuery } from '@/features/latest-activity/api/get-top-depositors'
import { LatestActivityTable } from '@/features/latest-activity/components/LatestActivityTable/LatestActivityTable'
import { userActivityTableCarouselData } from '@/features/latest-activity/components/LatestActivityView/carousel'
import { TopDepositorsTable } from '@/features/latest-activity/components/TopDepositorsTable/TopDepositorsTable'
import { getLatestActivityShouldHydrateFromServer } from '@/features/latest-activity/helpers/get-should-hydrate-from-server'
import { mapMultiselectOptions } from '@/features/latest-activity/table/filters/mappers'
import { UserActivityTab } from '@/features/latest-activity/types/tabs'

import { getLatestActivityHeadingCards, latestActivityHeading } from './cards'

import classNames from './LatestActivityView.module.css'

interface LatestActivityViewProps {
  vaultsList: SDKVaultsListType
  searchParams?: { [key: string]: string[] }
  topDepositors: TopDepositorsPagination
  latestActivity: LatestActivityPagination
}

export const LatestActivityView: FC<LatestActivityViewProps> = ({
  vaultsList,
  searchParams,
  topDepositors,
  latestActivity,
}) => {
  const { setQueryParams, queryParams } = useQueryParams(searchParams)

  const strategyFilter = queryParams.strategies
  const tokenFilter = queryParams.tokens

  const topDepositorsSortBy = queryParams.topDepositorsSortBy?.[0]
  const topDepositorsOrderBy = queryParams.topDepositorsOrderBy?.[0]

  const latestActivitySortBy = queryParams.latestActivitySortBy?.[0]
  const latestActivityOrderBy = queryParams.latestActivityOrderBy?.[0]

  const currentUrl = useCurrentUrl()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const { strategiesOptions, tokensOptions } = useMemo(
    () => mapMultiselectOptions(vaultsList),
    [vaultsList],
  )

  const handleSortTopDepositors = (sortConfig: TableSortedColumn<string>) => {
    setQueryParams({
      topDepositorsSortBy: sortConfig.key,
      topDepositorsOrderBy: sortConfig.direction,
    })
  }

  const handleSortLatestActivity = (sortConfig: TableSortedColumn<string>) => {
    setQueryParams({
      latestActivitySortBy: sortConfig.key,
      latestActivityOrderBy: sortConfig.direction,
    })
  }

  const genericMultiSelectFilters = [
    {
      options: strategiesOptions,
      label: 'Strategies',
      onChange: (strategies: string[]) => {
        setQueryParams({ strategies })
      },
      initialValues: strategyFilter,
    },
    {
      options: tokensOptions,
      label: 'Tokens',
      onChange: (tokens: string[]) => {
        setQueryParams({ tokens })
      },
      initialValues: tokenFilter,
    },
  ]

  const cards = useMemo(
    () =>
      getLatestActivityHeadingCards({
        totalItems: latestActivity.totalDeposits,
        medianDeposit: latestActivity.medianDeposit,
        totalUsers: latestActivity.totalUniqueUsers,
      }),
    [latestActivity.totalDeposits, latestActivity.medianDeposit, latestActivity.totalUniqueUsers],
  )

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

  const shouldHydrateFromServer = getLatestActivityShouldHydrateFromServer({
    strategyFilter,
    tokenFilter,
    searchParams,
    topDepositorsSortBy,
    topDepositorsOrderBy,
    latestActivitySortBy,
    latestActivityOrderBy,
  })

  const {
    data: latestActivityData,
    isPending: isPendingLatestActivity,
    isFetchingNextPage: isFetchingNextLatestActivityPage,
    fetchNextPage: fetchNextLatestActivityPage,
    hasNextPage: hasNextLatestActivityPage,
  } = useLatestActivityInfiniteQuery({
    strategies: strategyFilter,
    tokens: tokenFilter,
    sortBy: latestActivitySortBy,
    orderBy: latestActivityOrderBy,
    initialData: shouldHydrateFromServer ? latestActivity : undefined,
  })

  const {
    data: topDepositorsData,
    isPending: isPendingTopDepositors,
    isFetchingNextPage: isFetchingNextTopDepositorsPage,
    fetchNextPage: fetchNextTopDepositorsPage,
    hasNextPage: hasNextTopDepositorsPage,
  } = useTopDepositorsInfiniteQuery({
    strategies: strategyFilter,
    tokens: tokenFilter,
    sortBy: topDepositorsSortBy,
    orderBy: topDepositorsOrderBy,
    initialData: shouldHydrateFromServer ? topDepositors : undefined,
  })

  const currentlyLoadedLatestActivityList = useMemo(
    () =>
      latestActivityData ? latestActivityData.pages.flatMap((p) => p.data) : latestActivity.data,
    [latestActivityData, latestActivity.data],
  )

  const currentlyLoadedTopDepositorsList = useMemo(
    () => (topDepositorsData ? topDepositorsData.pages.flatMap((p) => p.data) : topDepositors.data),
    [topDepositorsData, topDepositors.data],
  )

  const handleLoadMoreLatestActivity = () => {
    if (isFetchingNextLatestActivityPage || !hasNextLatestActivityPage) return
    void fetchNextLatestActivityPage()
  }

  const handleLoadMoreTopDepositors = () => {
    if (isFetchingNextTopDepositorsPage || !hasNextTopDepositorsPage) return
    void fetchNextTopDepositorsPage()
  }

  const tabs = [
    {
      id: UserActivityTab.TOP_DEPOSITORS,
      label: 'Top depositors',
      content: (
        <InfiniteScroll
          loadMore={handleLoadMoreTopDepositors}
          hasMore={!!hasNextTopDepositorsPage}
          loader={
            isFetchingNextTopDepositorsPage ? (
              <LoadingSpinner
                key="spinner"
                style={{ margin: '0 auto', marginTop: 'var(--spacing-space-medium)' }}
              />
            ) : undefined
          }
        >
          {filters}
          <TopDepositorsTable
            topDepositorsList={currentlyLoadedTopDepositorsList}
            customRow={{
              idx: 3,
              content: <TableCarousel carouselData={userActivityTableCarouselData} />,
            }}
            handleSort={handleSortTopDepositors}
            isLoading={isPendingTopDepositors}
          />
        </InfiniteScroll>
      ),
    },
    {
      id: UserActivityTab.LATEST_ACTIVITY,
      label: 'Latest activity',
      content: (
        <InfiniteScroll
          loadMore={handleLoadMoreLatestActivity}
          hasMore={!!hasNextLatestActivityPage}
          loader={
            isFetchingNextLatestActivityPage ? (
              <LoadingSpinner
                key="spinner"
                style={{ margin: '0 auto', marginTop: 'var(--spacing-space-medium)' }}
              />
            ) : undefined
          }
        >
          {filters}
          <LatestActivityTable
            latestActivityList={currentlyLoadedLatestActivityList}
            customRow={{
              idx: 3,
              content: <TableCarousel carouselData={userActivityTableCarouselData} />,
            }}
            hiddenColumns={['position']}
            handleSort={handleSortLatestActivity}
            isLoading={isPendingLatestActivity}
          />
        </InfiniteScroll>
      ),
    },
  ]

  return (
    <div className={classNames.wrapper}>
      <HeadingWithCards
        title={latestActivityHeading.title}
        description={latestActivityHeading.description}
        cards={cards}
        social={{
          linkToCopy: currentUrl,
          linkToShare: getTwitterShareUrl({
            url: currentUrl,
            text: 'Check out Lazy Summer Global Rebalance Activity!',
          }),
        }}
      />

      <TabBar tabs={tabs} textVariant="p3semi" />
    </div>
  )
}
