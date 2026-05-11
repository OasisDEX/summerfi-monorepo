import { type BlogPosts } from '@summerfi/app-types'
import { useQuery } from '@tanstack/react-query'

type PortfolioBlogPostsResponse = {
  blogPosts: BlogPosts
  error: boolean
}

export const getPortfolioBlogPosts = async (): Promise<PortfolioBlogPostsResponse> => {
  const response = await fetch('/earn/api/portfolio/blog-posts')

  if (!response.ok) {
    throw new Error(`portfolio-blog-posts ${response.status}`)
  }

  return response.json() as Promise<PortfolioBlogPostsResponse>
}

export const usePortfolioBlogPostsQuery = () => {
  return useQuery({
    queryKey: ['portfolio-blog-posts'],
    queryFn: getPortfolioBlogPosts,
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })
}
