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
}: {
  page: number
  limit?: number
  tokens?: string[]
  strategies?: string[]
  protocols?: string[]
  sortBy?: string
  orderBy?: string
  userAddress?: string
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

  const response = await fetch(`/earn/api/rebalance-activity?${query.toString()}`)

  return response.json()
}
