import { type BlogPosts } from '@summerfi/app-types'
import { NextResponse } from 'next/server'

import { getCachedBlogPosts } from '@/app/server-handlers/cached/blog-posts'

type PortfolioBlogPostsResponse = {
  blogPosts: BlogPosts
  error: boolean
}

const emptyBlogPosts: BlogPosts = {
  news: [],
  learn: [],
}

export async function GET() {
  try {
    const blogPosts = await getCachedBlogPosts()

    return NextResponse.json<PortfolioBlogPostsResponse>({
      blogPosts,
      error: false,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in portfolio blog-posts route:', error)

    return NextResponse.json<PortfolioBlogPostsResponse>({
      blogPosts: emptyBlogPosts,
      error: true,
    })
  }
}
