import { unstable_cache as unstableCache } from 'next/cache'

import { getBlogPosts } from '@/app/server-handlers/raw-calls/blog-posts'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

export const getCachedBlogPosts = unstableCache(getBlogPosts, ['blogPosts'], {
  revalidate: CACHE_TIMES.BLOG_POSTS,
  tags: [CACHE_TAGS.BLOG_POSTS],
})
