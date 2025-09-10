import { useInfiniteQuery } from '@tanstack/react-query'

import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { normalizeQueryTableFilters } from '@/helpers/normalize-query-table-filters'

/**
 * Fetches the latest activity data from the API with optional filters.
 *
 * @param {Object} params - Query parameters for fetching activity data.
 * @param {number} params.page - The page number for pagination.
 * @param {number} [params.limit=50] - The number of records per page (default: 50).
 * @param {string[]} [params.tokens] - Optional list of token addresses to filter by.
 * @param {string[]} [params.strategies] - Optional list of strategy names to filter by.
 * @param {string} [params.sortBy] - Optional field to sort results by.
 * @param {string} [params.orderBy] - Optional sorting order (`asc` or `desc`), converted to lowercase.
 * @param {string[]} [params.usersAddresses] - Optional list of user addresses to filter activity for a specific user.
 * @param {AbortSignal} [params.signal] - Optional abort signal to cancel the request.
 *
 * @returns {Promise<LatestActivityPagination>} A promise resolving to the API response in JSON format.
 */
export const getLatestActivity = async ({
  page,
  limit = 50,
  tokens,
  strategies,
  sortBy,
  orderBy,
  usersAddresses,
  signal,
}: {
  page: number
  limit?: number
  tokens?: string[]
  strategies?: string[]
  sortBy?: string
  orderBy?: string
  usersAddresses?: string[]
  signal?: AbortSignal
}): Promise<LatestActivityPagination> => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(tokens && tokens.length > 0 && { tokens: tokens.join(',') }),
    ...(strategies && strategies.length > 0 && { strategies: strategies.join(',') }),
    ...(sortBy && { sortBy }),
    ...(orderBy && { orderBy: orderBy.toLowerCase() }),
    ...(usersAddresses &&
      usersAddresses.length > 0 && { usersAddresses: usersAddresses.join(',') }),
  })

  const response = await fetch(`/earn/api/latest-activity?${query.toString()}`, { signal })

  return response.json()
}

/**
 * Infinite query hook for latest activity
 * @param {Object} params - Query parameters for fetching latest activity data.
 * @param {string[]} [params.tokens] - Optional list of token addresses to filter by.
 * @param {string[]} [params.strategies] - Optional list of strategy names to filter by.
 * @param {string} [params.sortBy] - Optional field to sort results by.
 * @param {string} [params.orderBy] - Optional sorting order (`asc` or `desc`), converted to lowercase.
 * @param {string[]} [params.usersAddresses] - Optional list of user addresses to filter activity for a specific user.
 * @param {LatestActivityPagination} [params.initialData] - Optional initial data to use for the query.
 * @param {number} [params.limit=50] - The number of records per page (default: 50).
 *
 * @returns {Object} An object containing the query data, isPending, isFetchingNextPage, fetchNextPage, and hasNextPage.
 */

export const useLatestActivityInfiniteQuery = ({
  tokens,
  strategies,
  sortBy,
  orderBy,
  usersAddresses,
  initialData,
  limit = 50,
}: {
  tokens?: string[]
  strategies?: string[]
  sortBy?: string
  orderBy?: string
  usersAddresses?: string[]
  initialData?: LatestActivityPagination
  limit?: number
}) => {
  const key = {
    tokens: normalizeQueryTableFilters(tokens),
    strategies: normalizeQueryTableFilters(strategies),
    sortBy: sortBy ?? '',
    orderBy: orderBy ?? '',
    usersAddresses: normalizeQueryTableFilters(usersAddresses),
    limit,
  }

  return useInfiniteQuery({
    queryKey: ['latest-activity', key],
    queryFn: ({ pageParam = 1, signal }) =>
      getLatestActivity({
        page: pageParam,
        limit,
        tokens,
        strategies,
        sortBy,
        orderBy,
        usersAddresses,
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
