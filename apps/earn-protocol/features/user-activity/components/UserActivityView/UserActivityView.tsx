'use client'
import { type FC, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {
  GenericMultiselect,
  getTwitterShareUrl,
  HeadingWithCards,
  TabBar,
  TableCarousel,
  useCurrentUrl,
  useMobileCheck,
  useQueryParams,
} from '@summerfi/app-earn-ui'
import {
  type SDKUsersActivityType,
  type SDKVaultsListType,
  UserActivityType,
  type UsersActivity,
} from '@summerfi/app-types'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { TopDepositorsTable } from '@/features/user-activity/components/TopDepositorsTable/TopDepositorsTable'
import { UserActivityTable } from '@/features/user-activity/components/UserActivityTable/UserActivityTable'
import {
  getUserActivityHeadingCards,
  userActivityHeading,
} from '@/features/user-activity/components/UserActivityView/cards'
import { userActivityTableCarouselData } from '@/features/user-activity/components/UserActivityView/carousel'
import { getUsersActivityMedianDeposit } from '@/features/user-activity/helpers/get-median-deposit'
import { mapMultiselectOptions } from '@/features/user-activity/table/filters/mappers'
import { topDepositorsFilter } from '@/features/user-activity/table/filters/top-depositors-filter'
import { userActivityFilter } from '@/features/user-activity/table/filters/user-activity-filters'
import { UserActivityTab } from '@/features/user-activity/types/tabs'

import classNames from './UserActivityView.module.scss'

interface UserActivityViewProps {
  vaultsList: SDKVaultsListType
  usersActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  totalUsers: number
  searchParams?: { [key: string]: string[] }
}

const initialRows = 10

export const UserActivityView: FC<UserActivityViewProps> = ({
  vaultsList,
  usersActivity,
  topDepositors,
  totalUsers,
  searchParams,
}) => {
  const { setQueryParams } = useQueryParams()
  const [strategyFilter, setStrategyFilter] = useState<string[]>(searchParams?.strategies ?? [])
  const [tokenFilter, setTokenFilter] = useState<string[]>(searchParams?.tokens ?? [])
  const currentUrl = useCurrentUrl()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const [currentUserActivityIdx, setCurrentUserActivityIdx] = useState(initialRows)
  const [currentTopDepositorsIdx, setCurrentTopDepositorsIdx] = useState(initialRows)

  const [loadedUserActivityList, setLoadedUserActivityList] = useState(
    usersActivity.slice(0, initialRows),
  )

  const [loadedTopDepositorsList, setLoadedTopDepositorsList] = useState(
    topDepositors.slice(0, initialRows),
  )

  const { strategiesOptions, tokensOptions } = useMemo(
    () => mapMultiselectOptions(vaultsList),
    [vaultsList],
  )

  const handleMoreUserActivityItems = () => {
    setLoadedUserActivityList((prev) => [
      ...prev,
      ...usersActivity.slice(currentUserActivityIdx, currentUserActivityIdx + initialRows),
    ])
    setCurrentUserActivityIdx(currentUserActivityIdx + initialRows)
  }

  const handleMoreTopDepositorsItems = () => {
    setLoadedTopDepositorsList((prev) => [
      ...prev,
      ...topDepositors.slice(currentTopDepositorsIdx, currentTopDepositorsIdx + initialRows),
    ])
    setCurrentTopDepositorsIdx(currentTopDepositorsIdx + initialRows)
  }

  const userActivityFilteredList = useMemo(
    () =>
      userActivityFilter({
        userActivityList: loadedUserActivityList,
        strategyFilter,
        tokenFilter,
      }),
    [loadedUserActivityList, strategyFilter, tokenFilter],
  )

  const topDepositorsFilteredList = useMemo(
    () =>
      topDepositorsFilter({
        topDepositorsList: loadedTopDepositorsList,
        strategyFilter,
        tokenFilter,
      }),
    [loadedTopDepositorsList, strategyFilter, tokenFilter],
  )

  const genericMultiSelectFilters = [
    {
      options: strategiesOptions,
      label: 'Strategies',
      onChange: (strategies: string[]) => {
        setQueryParams({ strategies })
        setStrategyFilter(strategies)
      },
      initialValues: strategyFilter,
    },
    {
      options: tokensOptions,
      label: 'Tokens',
      onChange: (tokens: string[]) => {
        setQueryParams({ tokens })
        setTokenFilter(tokens)
      },
      initialValues: tokenFilter,
    },
  ]

  const totalUserActivityItems = usersActivity.filter(
    (item) => item.activity === UserActivityType.DEPOSIT,
  ).length

  const medianDeposit = useMemo(() => getUsersActivityMedianDeposit(usersActivity), [usersActivity])

  const cards = useMemo(
    () =>
      getUserActivityHeadingCards({
        totalItems: totalUserActivityItems,
        medianDeposit,
        totalUsers,
      }),
    [totalUserActivityItems, medianDeposit, totalUsers],
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
          hasMore={topDepositors.length > loadedTopDepositorsList.length}
        >
          {filters}
          <TopDepositorsTable
            topDepositorsList={topDepositorsFilteredList}
            customRow={{
              idx: 3,
              content: <TableCarousel carouselData={userActivityTableCarouselData} />,
            }}
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
          hasMore={totalUserActivityItems > loadedUserActivityList.length}
        >
          {filters}
          <UserActivityTable
            userActivityList={userActivityFilteredList}
            customRow={{
              idx: 3,
              content: <TableCarousel carouselData={userActivityTableCarouselData} />,
            }}
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
