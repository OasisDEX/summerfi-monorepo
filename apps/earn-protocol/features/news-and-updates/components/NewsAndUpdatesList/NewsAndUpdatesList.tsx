import { type FC } from 'react'
import { Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import classNames from './NewsAndUpdatesList.module.css'

interface NewsAndUpdatesListProps {
  items: { title: string; timestamp: number; link: string; readingTime: number }[]
}

export const NewsAndUpdatesList: FC<NewsAndUpdatesListProps> = ({ items }) => {
  return items.map((item) => (
    <Link
      href={item.link}
      key={item.title + item.timestamp}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={classNames.wrapper}>
        <div className={classNames.dot} />
        <div className={classNames.content}>
          <Text as="p" variant="p2semi">
            {item.title}
          </Text>
          <div className={classNames.footer}>
            <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              Time to read: {item.readingTime} minutes
            </Text>
            <div className={classNames.separator} />
            <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              {new Date(item.timestamp).toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </div>
        </div>
      </div>
    </Link>
  ))
}
