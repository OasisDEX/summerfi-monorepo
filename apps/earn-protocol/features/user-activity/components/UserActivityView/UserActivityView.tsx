'use client'
import { type FC, useEffect, useMemo, useRef, useState } from 'react'
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
import { type LatestActivity, type TopDepositors } from '@summerfi/summer-protocol-db'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { getTopDepositors } from '@/features/user-activity/api/get-top-depositors'
import { getUsersActivity } from '@/features/user-activity/api/get-users-activity'
import { TopDepositorsTable } from '@/features/user-activity/components/TopDepositorsTable/TopDepositorsTable'
import { UserActivityTable } from '@/features/user-activity/components/UserActivityTable/UserActivityTable'
import {
  getUserActivityHeadingCards,
  userActivityHeading,
} from '@/features/user-activity/components/UserActivityView/cards'
import { userActivityTableCarouselData } from '@/features/user-activity/components/UserActivityView/carousel'
import { mapMultiselectOptions } from '@/features/user-activity/table/filters/mappers'
import { UserActivityTab } from '@/features/user-activity/types/tabs'

import classNames from './UserActivityView.module.scss'

interface UserActivityViewProps {
  vaultsList: SDKVaultsListType
  searchParams?: { [key: string]: string[] }
  topDepositors: {
    data: TopDepositors[]
    pagination: {
      currentPage: number
      totalPages: number
      totalItems: number
      itemsPerPage: number
    }
  }
  usersActivities: {
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
}

export const UserActivityView: FC<UserActivityViewProps> = ({
  vaultsList,
  searchParams,
  topDepositors,
  usersActivities,
}) => {
  const { setQueryParams, queryParams } = useQueryParams(searchParams)
  const [isLoading, setIsLoading] = useState(false)

  const strategyFilter = queryParams.strategies
  const tokenFilter = queryParams.tokens

  const topDepositorsSortBy = queryParams.topDepositorsSortBy?.[0]
  const topDepositorsOrderBy = queryParams.topDepositorsOrderBy?.[0]

  const latestActivitySortBy = queryParams.latestActivitySortBy?.[0]
  const latestActivityOrderBy = queryParams.latestActivityOrderBy?.[0]

  const currentUrl = useCurrentUrl()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const isFirstRender = useRef(true)
  const [currentUserActivityPage, setCurrentUserActivityPage] = useState(
    usersActivities.pagination.currentPage,
  )
  const [currentTopDepositorsPage, setCurrentTopDepositorsPage] = useState(
    topDepositors.pagination.currentPage,
  )

  const [loadedUserActivityList, setLoadedUserActivityList] = useState(usersActivities.data)

  const [loadedTopDepositorsList, setLoadedTopDepositorsList] = useState(topDepositors.data)

  const { strategiesOptions, tokensOptions } = useMemo(
    () => mapMultiselectOptions(vaultsList),
    [vaultsList],
  )

  const handleMoreUserActivityItems = async () => {
    const res = await getUsersActivity({
      page: currentUserActivityPage + 1,
      tokens: tokenFilter,
      strategies: strategyFilter,
      sortBy: latestActivitySortBy,
      orderBy: latestActivityOrderBy,
    })

    setLoadedUserActivityList((prev) => [...prev, ...res.data])
    setCurrentUserActivityPage((prev) => prev + 1)
  }

  const handleMoreTopDepositorsItems = async () => {
    const res = await getTopDepositors({
      page: currentTopDepositorsPage + 1,
      tokens: tokenFilter,
      strategies: strategyFilter,
      sortBy: topDepositorsSortBy,
      orderBy: topDepositorsOrderBy,
    })

    setLoadedTopDepositorsList((prev) => [...prev, ...res.data])
    setCurrentTopDepositorsPage((prev) => prev + 1)
  }

  const handleSortTopDepositors = (sortConfig: TableSortedColumn<string>) => {
    setQueryParams({
      topDepositorsSortBy: sortConfig.key,
      topDepositorsOrderBy: sortConfig.direction,
    })
  }

  const handleSortUserActivity = (sortConfig: TableSortedColumn<string>) => {
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

  useEffect(() => {
    if (isFirstRender.current) {
      return
    }

    setIsLoading(true)

    getUsersActivity({
      page: 1,
      tokens: tokenFilter,
      strategies: strategyFilter,
      sortBy: latestActivitySortBy,
      orderBy: latestActivityOrderBy,
    })
      .then((res) => {
        setLoadedUserActivityList(res.data)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [strategyFilter, tokenFilter, latestActivitySortBy, latestActivityOrderBy])

  useEffect(() => {
    if (isFirstRender.current) {
      return
    }

    setIsLoading(true)

    getTopDepositors({
      page: 1,
      tokens: tokenFilter,
      strategies: strategyFilter,
      sortBy: topDepositorsSortBy,
      orderBy: topDepositorsOrderBy,
    })
      .then((res) => {
        setLoadedTopDepositorsList(res.data)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [strategyFilter, tokenFilter, topDepositorsSortBy, topDepositorsOrderBy])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

  const cards = useMemo(
    () =>
      getUserActivityHeadingCards({
        totalItems: usersActivities.totalDeposits,
        medianDeposit: usersActivities.medianDeposit,
        totalUsers: topDepositors.pagination.totalItems,
      }),
    [
      usersActivities.totalDeposits,
      usersActivities.medianDeposit,
      topDepositors.pagination.totalItems,
    ],
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

  const tabs = [
    {
      id: UserActivityTab.TOP_DEPOSITORS,
      label: 'Top depositors',
      content: (
        <InfiniteScroll
          loadMore={handleMoreTopDepositorsItems}
          hasMore={
            topDepositors.pagination.totalPages > currentTopDepositorsPage &&
            !isLoading &&
            topDepositors.data.length > 0
          }
          loader={
            <LoadingSpinner
              style={{ margin: '0 auto', marginTop: 'var(--spacing-space-medium)' }}
            />
          }
        >
          {filters}
          <TopDepositorsTable
            topDepositorsList={loadedTopDepositorsList}
            customRow={{
              idx: 3,
              content: <TableCarousel carouselData={userActivityTableCarouselData} />,
            }}
            handleSort={handleSortTopDepositors}
          />
        </InfiniteScroll>
      ),
    },
    {
      id: UserActivityTab.LATEST_ACTIVITY,
      label: 'Latest activity',
      content: (
        <InfiniteScroll
          loadMore={handleMoreUserActivityItems}
          hasMore={
            usersActivities.pagination.totalPages > currentUserActivityPage &&
            !isLoading &&
            usersActivities.data.length > 0
          }
          loader={
            <LoadingSpinner
              style={{ margin: '0 auto', marginTop: 'var(--spacing-space-medium)' }}
            />
          }
        >
          {filters}
          <UserActivityTable
            userActivityList={loadedUserActivityList}
            customRow={{
              idx: 3,
              content: <TableCarousel carouselData={userActivityTableCarouselData} />,
            }}
            hiddenColumns={['position']}
            handleSort={handleSortUserActivity}
          />
        </InfiniteScroll>
      ),
    },
  ]

  return (
    <div className={classNames.wrapper}>
      <HeadingWithCards
        title={userActivityHeading.title}
        description={userActivityHeading.description}
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
