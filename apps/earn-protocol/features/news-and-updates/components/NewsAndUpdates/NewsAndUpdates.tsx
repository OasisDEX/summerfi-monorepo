import { type FC } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'

import { NewsAndUpdatesList } from '@/features/news-and-updates/components/NewsAndUpdatesList/NewsAndUpdatesList'

import classNames from './NewsAndUpdates.module.css'

interface NewsAndUpdatesProps {
  items: { title: string; timestamp: number; link: string }[]
}

export const NewsAndUpdates: FC<NewsAndUpdatesProps> = ({ items }) => {
  return (
    <Card className={classNames.wrapper} variant="cardSecondary">
      <Text as="h5" variant="h5" className={classNames.header}>
        News & Updates
      </Text>
      <Card className={classNames.wrapper}>
        <NewsAndUpdatesList items={items} />
      </Card>
    </Card>
  )
}
