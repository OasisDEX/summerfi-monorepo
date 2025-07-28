import { type FC } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'

import { type BlogPosts } from '@/app/server-handlers/blog-posts/types'
import { NewsAndUpdatesList } from '@/features/news-and-updates/components/NewsAndUpdatesList/NewsAndUpdatesList'

import classNames from './NewsAndUpdates.module.css'

interface NewsAndUpdatesProps {
  blogPosts: BlogPosts
}

export const NewsAndUpdates: FC<NewsAndUpdatesProps> = ({ blogPosts }) => {
  // hide news and updates if empty response
  if (blogPosts.news.length === 0) {
    return null
  }

  const items = blogPosts.news.map((post) => ({
    title: post.title,
    timestamp: new Date(post.date).getTime(),
    link: post.url,
    readingTime: post.readingTime,
  }))

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
