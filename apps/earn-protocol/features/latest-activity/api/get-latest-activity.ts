import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'

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
 * @param {string} [params.userAddress] - Optional user address to filter activity for a specific user.
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
}: {
  page: number
  limit?: number
  tokens?: string[]
  strategies?: string[]
  sortBy?: string
  orderBy?: string
  usersAddresses?: string[]
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

  const response = await fetch(`/earn/api/latest-activity?${query.toString()}`)

  return response.json()
}
