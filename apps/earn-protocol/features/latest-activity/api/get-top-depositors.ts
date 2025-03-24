import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'

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
}: {
  page: number
  limit?: number
  tokens?: string[]
  strategies?: string[]
  sortBy?: string
  orderBy?: string
}): Promise<TopDepositorsPagination> => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(tokens && tokens.length > 0 && { tokens: tokens.join(',') }),
    ...(strategies && strategies.length > 0 && { strategies: strategies.join(',') }),
    ...(sortBy && { sortBy }),
    ...(orderBy && { orderBy: orderBy.toLowerCase() }),
  })

  const response = await fetch(`/earn/api/top-depositors?${query.toString()}`)

  return response.json()
}
