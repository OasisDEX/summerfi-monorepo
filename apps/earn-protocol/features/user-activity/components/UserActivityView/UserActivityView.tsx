'use client'
import { type FC, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {
  GenericMultiselect,
  getTwitterShareUrl,
  HeadingWithCards,
  TableCarousel,
  useCurrentUrl,
  useQueryParams,
} from '@summerfi/app-earn-ui'
import { type SDKVaultsListType, UserActivityType } from '@summerfi/app-types'

import { type UsersActivity } from '@/app/server-handlers/sdk/get-users-activity'
import { UserActivityTable } from '@/features/user-activity/components/UserActivityTable/UserActivityTable'
import {
  getUserActivityHeadingCards,
  userActivityHeading,
} from '@/features/user-activity/components/UserActivityView/cards'
import { userActivityTableCarouselData } from '@/features/user-activity/components/UserActivityView/carousel'
import { getUsersActivityMedianDeposit } from '@/features/user-activity/helpers/get-median-deposit'
import { userActivityActivityFilter } from '@/features/user-activity/table/filters/filters'
import { mapMultiselectOptions } from '@/features/user-activity/table/filters/mappers'

import classNames from './UserActivityView.module.scss'

interface UserActivityViewProps {
  vaultsList: SDKVaultsListType
  usersActivity: UsersActivity
  totalUsers: number
  searchParams?: { [key: string]: string[] }
}

const initialRows = 10

export const UserActivityView: FC<UserActivityViewProps> = ({
  vaultsList,
  usersActivity,
  totalUsers,
  searchParams,
}) => {
  const { setQueryParams } = useQueryParams()
  const [strategyFilter, setStrategyFilter] = useState<string[]>(searchParams?.strategies ?? [])
  const [tokenFilter, setTokenFilter] = useState<string[]>(searchParams?.tokens ?? [])
  const currentUrl = useCurrentUrl()

  const [current, setCurrent] = useState(initialRows)

  const [currentlyLoadedList, setCurrentlyLoadedList] = useState(
    usersActivity.slice(0, initialRows),
  )

  const { strategiesOptions, tokensOptions } = useMemo(
    () => mapMultiselectOptions(vaultsList),
    [vaultsList],
  )

  const handleMoreItems = () => {
    setCurrentlyLoadedList((prev) => [
      ...prev,
      ...usersActivity.slice(current, current + initialRows),
    ])
    setCurrent(current + initialRows)
  }

  const filteredList = useMemo(
    () =>
      userActivityActivityFilter({
        userActivityList: currentlyLoadedList,
        strategyFilter,
        tokenFilter,
      }),
    [currentlyLoadedList, strategyFilter, tokenFilter],
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

  const totalItems = usersActivity.filter(
    (item) => item.activity === UserActivityType.DEPOSIT,
  ).length
  const medianDeposit = useMemo(() => getUsersActivityMedianDeposit(usersActivity), [usersActivity])

  const cards = useMemo(
    () => getUserActivityHeadingCards({ totalItems, medianDeposit, totalUsers }),
    [totalItems, medianDeposit, totalUsers],
  )

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
      <div className={classNames.filtersWrapper}>
        {genericMultiSelectFilters.map((filter) => (
          <GenericMultiselect
            key={filter.label}
            options={filter.options}
            label={filter.label}
            onChange={filter.onChange}
            initialValues={filter.initialValues}
          />
        ))}
      </div>
      <InfiniteScroll loadMore={handleMoreItems} hasMore={totalItems > currentlyLoadedList.length}>
        <UserActivityTable
          userActivityList={filteredList}
          customRow={{
            idx: 3,
            content: <TableCarousel carouselData={userActivityTableCarouselData} />,
          }}
        />
      </InfiniteScroll>
    </div>
  )
}
