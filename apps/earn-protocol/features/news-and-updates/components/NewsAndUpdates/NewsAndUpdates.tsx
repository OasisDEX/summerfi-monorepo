import { Card, Text } from '@summerfi/app-earn-ui'

import { usePortfolioBlogPostsQuery } from '@/features/news-and-updates/api/get-portfolio-blog-posts'
import { NewsAndUpdatesList } from '@/features/news-and-updates/components/NewsAndUpdatesList/NewsAndUpdatesList'

import classNames from './NewsAndUpdates.module.css'

export const NewsAndUpdates = () => {
  const { data, isError, isPending } = usePortfolioBlogPostsQuery()
  const blogPosts = data?.blogPosts

  if (isPending) {
    return null
  }

  if (isError || !blogPosts) {
    return (
      <Text as="p" variant="p3">
        News and updates are temporarily unavailable.
      </Text>
    )
  }

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
