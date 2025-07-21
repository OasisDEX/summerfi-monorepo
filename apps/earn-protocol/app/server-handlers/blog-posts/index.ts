import { parseBlogPost } from './helpers'
import { type BlogPosts } from './types'

const apiUrl = 'https://summer-fi-blog.ghost.io/ghost/api'

const blogPostsFetchOptions = {
  method: 'GET',
  headers: {
    'Accept-Version': 'v5.71',
  },
}

const emptyFallback = {
  news: [],
  learn: [],
}

/**
 * Fetches blog posts from the Ghost CMS API and categorizes them into news and learn sections.
 *
 * Makes parallel requests to fetch:
 * - Latest 4 public news posts
 * - All public posts tagged with 'learn'
 *
 * @returns Promise<BlogPosts> - Object containing arrays of parsed blog posts for news and learn categories
 * @throws Will return empty arrays if API key is missing or if the API requests fail
 */
export const getBlogPosts = async (): Promise<BlogPosts> => {
  const apiKey = process.env.BLOG_POSTS_API_KEY

  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.error('BLOG_POSTS_API_KEY is not set')

    return emptyFallback
  }

  const blogPostsFetchUrl = `${apiUrl}/content/posts/?key=${apiKey}`

  const blogPostNewsRequest = fetch(
    `${blogPostsFetchUrl}&limit=4&filter=visibility:public`,
    blogPostsFetchOptions,
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch blog posts')
      }

      return res.json()
    })
    .then((data) => data.posts.map(parseBlogPost))

  const blogPostLearnRequest = fetch(
    `${blogPostsFetchUrl}&filter=tag:learn%2Bvisibility:public`,
    blogPostsFetchOptions,
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch learn blog posts')
      }

      return res.json()
    })
    .then((data) => data.posts.map(parseBlogPost))

  try {
    const [blogPostNewsResponse, blogPostLearnResponse] = await Promise.all([
      blogPostNewsRequest,
      blogPostLearnRequest,
    ])

    return {
      news: blogPostNewsResponse,
      learn: blogPostLearnResponse,
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Blog posts request failed', error)

    return emptyFallback
  }
}
