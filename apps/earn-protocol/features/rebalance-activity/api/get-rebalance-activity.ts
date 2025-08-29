import { useInfiniteQuery } from '@tanstack/react-query'

import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'

/**
 * Fetches rebalance activity data from the API with optional filters.
 *
 * @param {Object} params - Query parameters for fetching rebalance activity data.
 * @param {number} params.page - The page number for pagination.
 * @param {number} [params.limit=50] - The number of records per page (default: 50).
 * @param {string[]} [params.tokens] - Optional list of token addresses to filter by.
 * @param {string[]} [params.strategies] - Optional list of strategy names to filter by.
 * @param {string[]} [params.protocols] - Optional list of protocol names to filter by.
 * @param {string} [params.sortBy] - Optional field to sort results by.
 * @param {string} [params.orderBy] - Optional sorting order (`asc` or `desc`), converted to lowercase.
 * @param {string} [params.userAddress] - Optional user address to filter activity for a specific user.
 * @param {AbortSignal} [params.signal] - Optional abort signal to cancel the request.
 *
 * @returns {Promise<RebalanceActivityPagination>} A promise resolving to the API response in JSON format.
 */
export const getRebalanceActivity = async ({
  page,
  limit = 50,
  tokens,
  strategies,
  protocols,
  sortBy,
  orderBy,
  userAddress,
  signal,
}: {
  page: number
  limit?: number
  tokens?: string[]
  strategies?: string[]
  protocols?: string[]
  sortBy?: string
  orderBy?: string
  userAddress?: string
  signal?: AbortSignal
}): Promise<RebalanceActivityPagination> => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(tokens && tokens.length > 0 && { tokens: tokens.join(',') }),
    ...(strategies && strategies.length > 0 && { strategies: strategies.join(',') }),
    ...(protocols && protocols.length > 0 && { protocols: protocols.join(',') }),
    ...(sortBy && { sortBy }),
    ...(orderBy && { orderBy: orderBy.toLowerCase() }),
    ...(userAddress && { userAddress }),
  })

  const response = await fetch(`/earn/api/rebalance-activity?${query.toString()}`, { signal })

  return response.json()
}

/**
 * Infinite query hook for rebalance activity
 * @param {Object} params - Query parameters for fetching rebalance activity data.
 * @param {string[]} [params.tokens] - Optional list of token addresses to filter by.
 * @param {string[]} [params.strategies] - Optional list of strategy names to filter by.
 * @param {string[]} [params.protocols] - Optional list of protocol names to filter by.
 * @param {string} [params.sortBy] - Optional field to sort results by.
 * @param {string} [params.orderBy] - Optional sorting order (`asc` or `desc`), converted to lowercase.
 * @param {string} [params.userAddress] - Optional user address to filter activity for a specific user.
 * @param {RebalanceActivityPagination} [params.initialData] - Optional initial data to use for the query.
 * @param {number} [params.limit=50] - The number of records per page (default: 50).
 *
 * @returns {Object} An object containing the query data, isPending, isFetchingNextPage, fetchNextPage, and hasNextPage.
 */
export const useRebalanceActivityInfiniteQuery = ({
  tokens,
  strategies,
  protocols,
  sortBy,
  orderBy,
  userAddress,
  initialData,
  limit = 50,
}: {
  tokens?: string[]
  strategies?: string[]
  protocols?: string[]
  sortBy?: string
  orderBy?: string
  userAddress?: string
  initialData?: RebalanceActivityPagination
  limit?: number
}) => {
  const key = {
    tokens: tokens?.length ? [...tokens].sort().join(',') : '',
    strategies: strategies?.length ? [...strategies].sort().join(',') : '',
    protocols: protocols?.length ? [...protocols].sort().join(',') : '',
    sortBy: sortBy ?? '',
    orderBy: orderBy?.toLowerCase() ?? '',
    userAddress: userAddress?.toLowerCase() ?? '',
    limit,
  }

  return useInfiniteQuery({
    queryKey: ['rebalance-activity', key],
    queryFn: ({ pageParam = 1, signal }) =>
      getRebalanceActivity({
        page: Number(pageParam),
        limit,
        tokens,
        strategies,
        protocols,
        sortBy,
        orderBy,
        userAddress,
        signal,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination

      return currentPage < totalPages ? currentPage + 1 : undefined
    },
    // cache & refetch policy
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    ...(initialData
      ? {
          initialData: {
            pages: [initialData],
            pageParams: [1],
          },
        }
      : {}),
  })
}
