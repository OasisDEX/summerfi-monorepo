import { useInfiniteQuery } from '@tanstack/react-query'

import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { normalizeQueryTableFilters } from '@/helpers/normalize-query-table-filters'

/**
 * Fetches the top depositors data from the API with optional filters.
 *
 * @param {Object} params - Query parameters for fetching top depositors data.
 * @param {number} params.page - The page number for pagination.
 * @param {number} [params.limit=50] - The number of records per page (default: 50).
 * @param {string[]} [params.tokens] - Optional list of token addresses to filter by.
 * @param {string[]} [params.strategies] - Optional list of strategy names to filter by.
 * @param {string} [params.sortBy] - Optional field to sort results by.
 * @param {string} [params.orderBy] - Optional sorting order (`asc` or `desc`), converted to lowercase.
 *
 * @returns {Promise<TopDepositorsPagination>} A promise resolving to the API response in JSON format.
 */
export const getTopDepositors = async ({
  page,
  limit = 50,
  tokens,
  strategies,
  sortBy,
  orderBy,
  signal,
}: {
  page: number
  limit?: number
  tokens?: string[]
  strategies?: string[]
  sortBy?: string
  orderBy?: string
  signal?: AbortSignal
}): Promise<TopDepositorsPagination> => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(tokens && tokens.length > 0 && { tokens: tokens.join(',') }),
    ...(strategies && strategies.length > 0 && { strategies: strategies.join(',') }),
    ...(sortBy && { sortBy }),
    ...(orderBy && { orderBy: orderBy.toLowerCase() }),
  })

  const response = await fetch(`/earn/api/top-depositors?${query.toString()}`, { signal })

  return response.json()
}

/**
 * Infinite query hook for top depositors
 * @param {Object} params - Query parameters for fetching top depositors data.
 * @param {string[]} [params.tokens] - Optional list of token addresses to filter by.
 * @param {string[]} [params.strategies] - Optional list of strategy names to filter by.
 * @param {string} [params.sortBy] - Optional field to sort results by.
 * @param {string} [params.orderBy] - Optional sorting order (`asc` or `desc`), converted to lowercase.
 * @param {TopDepositorsPagination} [params.initialData] - Optional initial data to use for the query.
 * @param {number} [params.limit=50] - The number of records per page (default: 50).
 *
 * @returns {Object} An object containing the query data, isPending, isFetchingNextPage, fetchNextPage, and hasNextPage.
 */
export const useTopDepositorsInfiniteQuery = ({
  tokens,
  strategies,
  sortBy,
  orderBy,
  initialData,
  limit = 50,
}: {
  tokens?: string[]
  strategies?: string[]
  sortBy?: string
  orderBy?: string
  initialData?: TopDepositorsPagination
  limit?: number
}) => {
  const key = {
    tokens: normalizeQueryTableFilters(tokens),
    strategies: normalizeQueryTableFilters(strategies),
    sortBy: sortBy ?? '',
    orderBy: orderBy ?? '',
    limit,
  }

  return useInfiniteQuery({
    queryKey: ['top-depositors', key],
    queryFn: ({ pageParam = 1, signal }) =>
      getTopDepositors({
        page: pageParam,
        limit,
        tokens,
        strategies,
        sortBy,
        orderBy,
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
