import { Card, DataBlock, Text } from '@summerfi/app-earn-ui'

import { PortfolioRebalanceActivityList } from '@/features/portfolio/components/PortfolioRebalanceActivityList/PortfolioRebalanceActivityList'

import classNames from './PortfolioRebalanceActivity.module.scss'

const blocks = [
  {
    title: 'Rebalance actions',
    value: '313',
  },
  {
    title: 'User saved time',
    value: '73.3 Hours',
  },
  {
    title: 'Gas cost saving',
    value: '$24',
  },
]

export const PortfolioRebalanceActivity = () => {
  return (
    <Card className={classNames.wrapper}>
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
      <PortfolioRebalanceActivityList />
    </Card>
  )
}
