import { type FC } from 'react'
import { Text } from '@summerfi/app-earn-ui'

import classNames from './NewsAndUpdatesList.module.scss'

interface NewsAndUpdatesListProps {
  items: { title: string; timestamp: number }[]
}

export const NewsAndUpdatesList: FC<NewsAndUpdatesListProps> = ({ items }) => {
  return items.map((item) => (
    <div key={item.title + item.timestamp} className={classNames.wrapper}>
      <div className={classNames.dot} />
      <div className={classNames.content}>
        <Text as="p" variant="p2semi">
          {item.title}
        </Text>
        <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
          {new Date(item.timestamp).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
      </div>
    </div>
  ))
}
