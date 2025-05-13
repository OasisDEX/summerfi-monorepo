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

import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { getLatestActivity } from '@/features/latest-activity/api/get-latest-activity'
import { getTopDepositors } from '@/features/latest-activity/api/get-top-depositors'
import { LatestActivityTable } from '@/features/latest-activity/components/LatestActivityTable/LatestActivityTable'
import { userActivityTableCarouselData } from '@/features/latest-activity/components/LatestActivityView/carousel'
import { TopDepositorsTable } from '@/features/latest-activity/components/TopDepositorsTable/TopDepositorsTable'
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
  const [isLoadingActivity, setIsLoadingActivity] = useState(false)
  const [isLoadingDepositors, setIsLoadingDepositors] = useState(false)

  const [hasMoreTopDepositorsItems, setHasMoreTopDepositorsItems] = useState(true)
  const [hasMoreLatestActivityItems, setHasMoreLatestActivityItems] = useState(true)

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
  const [currentLatestActivityPage, setCurrentLatestActivityPage] = useState(
    latestActivity.pagination.currentPage,
  )
  const [currentTopDepositorsPage, setCurrentTopDepositorsPage] = useState(
    topDepositors.pagination.currentPage,
  )

  const [loadedLatestActivityList, setLoadedLatestActivityList] = useState(latestActivity.data)

  const [loadedTopDepositorsList, setLoadedTopDepositorsList] = useState(topDepositors.data)

  const { strategiesOptions, tokensOptions } = useMemo(
    () => mapMultiselectOptions(vaultsList),
    [vaultsList],
  )

  const handleMoreUserActivityItems = async () => {
    if (!hasMoreLatestActivityItems || isLoadingActivity) return
    try {
      const nextPage = currentLatestActivityPage + 1
      const res = await getLatestActivity({
        page: nextPage,
        tokens: tokenFilter,
        strategies: strategyFilter,
        sortBy: latestActivitySortBy,
        orderBy: latestActivityOrderBy,
      })

      if (res.data.length === 0 || nextPage >= latestActivity.pagination.totalPages) {
        setHasMoreLatestActivityItems(false)
      } else {
        setLoadedLatestActivityList((prev) => [...prev, ...res.data])
        setCurrentLatestActivityPage((prev) => prev + 1)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching more user activity', error)
      setHasMoreLatestActivityItems(false)
    }
  }

  const handleMoreTopDepositorsItems = async () => {
    if (!hasMoreTopDepositorsItems || isLoadingDepositors) return

    try {
      const nextPage = currentTopDepositorsPage + 1
      const res = await getTopDepositors({
        page: nextPage,
        tokens: tokenFilter,
        strategies: strategyFilter,
        sortBy: topDepositorsSortBy,
        orderBy: topDepositorsOrderBy,
      })

      if (res.data.length === 0 || nextPage >= topDepositors.pagination.totalPages) {
        setHasMoreTopDepositorsItems(false)
      } else {
        setLoadedTopDepositorsList((prev) => [...prev, ...res.data])
        setCurrentTopDepositorsPage((prev) => prev + 1)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching more top depositors', error)
      setHasMoreTopDepositorsItems(false)
    }
  }

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

  useEffect(() => {
    if (isFirstRender.current) {
      return
    }

    setIsLoadingActivity(true)
    setHasMoreLatestActivityItems(true)
    getLatestActivity({
      page: 1,
      tokens: tokenFilter,
      strategies: strategyFilter,
      sortBy: latestActivitySortBy,
      orderBy: latestActivityOrderBy,
    })
      .then((res) => {
        setLoadedLatestActivityList(res.data)
        setCurrentLatestActivityPage(1)

        if (res.data.length === 0 || res.pagination.currentPage >= res.pagination.totalPages) {
          setHasMoreLatestActivityItems(false)
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching latest activity', error)
      })
      .finally(() => {
        setIsLoadingActivity(false)
      })
  }, [strategyFilter, tokenFilter, latestActivitySortBy, latestActivityOrderBy])

  useEffect(() => {
    if (isFirstRender.current) {
      return
    }

    setIsLoadingDepositors(true)
    setHasMoreTopDepositorsItems(true)
    getTopDepositors({
      page: 1,
      tokens: tokenFilter,
      strategies: strategyFilter,
      sortBy: topDepositorsSortBy,
      orderBy: topDepositorsOrderBy,
    })
      .then((res) => {
        setLoadedTopDepositorsList(res.data)
        setCurrentTopDepositorsPage(1)

        if (res.data.length === 0 || res.pagination.currentPage >= res.pagination.totalPages) {
          setHasMoreTopDepositorsItems(false)
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching top depositors', error)
      })
      .finally(() => {
        setIsLoadingDepositors(false)
      })
  }, [strategyFilter, tokenFilter, topDepositorsSortBy, topDepositorsOrderBy])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

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

  const tabs = [
    {
      id: UserActivityTab.TOP_DEPOSITORS,
      label: 'Top depositors',
      content: (
        <InfiniteScroll
          loadMore={handleMoreTopDepositorsItems}
          hasMore={hasMoreTopDepositorsItems}
          loader={
            // inversed, we don't want loading spinner when skeleton is visible
            !isLoadingDepositors ? (
              <LoadingSpinner
                key="spinner"
                style={{ margin: '0 auto', marginTop: 'var(--spacing-space-medium)' }}
              />
            ) : undefined
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
            isLoading={isLoadingDepositors}
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
          hasMore={hasMoreLatestActivityItems}
          loader={
            // inversed, we don't want loading spinner when skeleton is visible
            !isLoadingActivity ? (
              <LoadingSpinner
                key="spinner"
                style={{ margin: '0 auto', marginTop: 'var(--spacing-space-medium)' }}
              />
            ) : undefined
          }
        >
          {filters}
          <LatestActivityTable
            latestActivityList={loadedLatestActivityList}
            customRow={{
              idx: 3,
              content: <TableCarousel carouselData={userActivityTableCarouselData} />,
            }}
            hiddenColumns={['position']}
            handleSort={handleSortLatestActivity}
            isLoading={isLoadingActivity}
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
