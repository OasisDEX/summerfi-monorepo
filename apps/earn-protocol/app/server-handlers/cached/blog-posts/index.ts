import { unstable_cache as unstableCache } from 'next/cache'

import { getBlogPosts } from '@/app/server-handlers/raw-calls/blog-posts'

export const getCachedBlogPosts = unstableCache(getBlogPosts, [], {
  revalidate: 600, // Revalidate every 10 minutes
})
