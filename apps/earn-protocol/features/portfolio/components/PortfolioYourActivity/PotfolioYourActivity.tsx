import { type FC, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Card, Text } from '@summerfi/app-earn-ui'
import { type UsersActivity } from '@summerfi/app-types'

import { UserActivityTable } from '@/features/user-activity/components/UserActivityTable/UserActivityTable'

import classNames from './PortfolioYourActivity.module.scss'

interface PortfolioYourActivityProps {
  userActivity: UsersActivity
}

const initialRows = 10

export const PortfolioYourActivity: FC<PortfolioYourActivityProps> = ({ userActivity }) => {
  const [current, setCurrent] = useState(initialRows)

  const [currentlyLoadedList, setCurrentlyLoadedList] = useState(userActivity.slice(0, initialRows))

  const [noMoreToLoad, setNoMoreToLoad] = useState(false)

  const handleMoreItems = () => {
    try {
      setCurrentlyLoadedList((prev) => [
        ...prev,
        ...userActivity.slice(current, current + initialRows),
      ])
    } catch (error) {
      // eslint-disable-next-line no-console
      console.info('No more users activity items to load')
      setNoMoreToLoad(true)

      return
    }

    setCurrent(current + initialRows)
  }

  return (
    <Card className={classNames.wrapper} variant="cardSecondary">
      <Text as="h5" variant="h5" className={classNames.header}>
        Your Activity
      </Text>
      <InfiniteScroll loadMore={handleMoreItems} hasMore={!noMoreToLoad}>
        <UserActivityTable userActivityList={currentlyLoadedList} hiddenColumns={['strategy']} />
      </InfiniteScroll>
    </Card>
  )
}
