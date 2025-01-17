import { type FC, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Card, DataBlock, Text } from '@summerfi/app-earn-ui'
import { type SDKGlobalRebalancesType } from '@summerfi/app-types'
import { formatFiatBalance, formatShorthandNumber } from '@summerfi/app-utils'

import { PortfolioRebalanceActivityList } from '@/features/portfolio/components/PortfolioRebalanceActivityList/PortfolioRebalanceActivityList'
import { getRebalanceSavedGasCost } from '@/features/rebalance-activity/helpers/get-saved-gas-cost'
import { getRebalanceSavedTimeInHours } from '@/features/rebalance-activity/helpers/get-saved-time-in-hours'

import classNames from './PortfolioRebalanceActivity.module.scss'

interface PortfolioRebalanceActivityProps {
  rebalancesList: SDKGlobalRebalancesType
  walletAddress: string
  totalRebalances: number
}

const initialRows = 10

export const PortfolioRebalanceActivity: FC<PortfolioRebalanceActivityProps> = ({
  rebalancesList,
  walletAddress,
  totalRebalances,
}) => {
  const savedTimeInHours = useMemo(
    () => getRebalanceSavedTimeInHours(totalRebalances),
    [totalRebalances],
  )
  const savedGasCost = useMemo(() => getRebalanceSavedGasCost(totalRebalances), [totalRebalances])

  const [current, setCurrent] = useState(initialRows)

  const [currentlyLoadedList, setCurrentlyLoadedList] = useState(
    rebalancesList.slice(0, initialRows),
  )

  const handleMoreItems = () => {
    setCurrentlyLoadedList((prev) => [
      ...prev,
      ...rebalancesList.slice(current, current + initialRows),
    ])
    setCurrent(current + initialRows)
  }

  const blocks = [
    {
      title: 'Rebalance actions',
      value: formatShorthandNumber(totalRebalances, { precision: 0 }),
    },
    {
      title: 'User saved time',
      value: `${formatShorthandNumber(savedTimeInHours, { precision: 1 })} hours`,
    },
    {
      title: 'Gas cost saving',
      value: `$${formatFiatBalance(savedGasCost)}`,
    },
  ]

  return (
    <Card className={classNames.wrapper} variant="cardSecondary">
      <Text as="h5" variant="h5" className={classNames.header}>
        Rebalance Activity
      </Text>
      <div className={classNames.blocksWrapper}>
        {blocks.map((block) => (
          <DataBlock
            key={block.title}
            title={block.title}
            value={block.value}
            titleSize="large"
            valueSize="large"
          />
        ))}
      </div>
      <InfiniteScroll
        loadMore={handleMoreItems}
        hasMore={totalRebalances > currentlyLoadedList.length}
      >
        <PortfolioRebalanceActivityList
          rebalancesList={currentlyLoadedList}
          walletAddress={walletAddress}
        />
      </InfiniteScroll>
    </Card>
  )
}
