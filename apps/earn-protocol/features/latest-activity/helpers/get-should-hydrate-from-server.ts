import { normalizeQueryTableFilters } from '@/helpers/normalize-query-table-filters'

/**
 * Checks if latest activity data should be hydrated from the server.
 *
 * @param {Object} params - The filter parameters.
 * @param {string[]} [params.strategyFilter] - Selected strategy filters.
 * @param {string[]} [params.tokenFilter] - Selected token filters.
 * @param {string} [params.topDepositorsSortBy] - Selected top depositors sort by.
 * @param {string} [params.topDepositorsOrderBy] - Selected top depositors order by.
 * @param {string} [params.latestActivitySortBy] - Selected latest activity sort by.
 * @param {string} [params.latestActivityOrderBy] - Selected latest activity order by.
 * @param {{ [key: string]: string[] }} [params.searchParams] - Query params from the server.
 * @returns {boolean} True if hydration from server is needed.
 */
export const getLatestActivityShouldHydrateFromServer = ({
  strategyFilter,
  tokenFilter,
  topDepositorsSortBy,
  topDepositorsOrderBy,
  latestActivitySortBy,
  latestActivityOrderBy,
  searchParams,
}: {
  // client
  strategyFilter?: string[]
  tokenFilter?: string[]
  topDepositorsSortBy?: string
  topDepositorsOrderBy?: string
  latestActivitySortBy?: string
  latestActivityOrderBy?: string
  // server
  searchParams?: { [key: string]: string[] }
}) => {
  const currentKey = `${normalizeQueryTableFilters(strategyFilter)}|${normalizeQueryTableFilters(tokenFilter)}|${topDepositorsSortBy ?? ''}|${topDepositorsOrderBy ?? ''}|${latestActivitySortBy ?? ''}|${latestActivityOrderBy ?? ''}`
  const serverKey = `${normalizeQueryTableFilters(searchParams?.strategies)}|${normalizeQueryTableFilters(searchParams?.tokens)}|${normalizeQueryTableFilters(searchParams?.topDepositorsSortBy)}|${normalizeQueryTableFilters(searchParams?.topDepositorsOrderBy)}|${normalizeQueryTableFilters(searchParams?.latestActivitySortBy)}|${normalizeQueryTableFilters(searchParams?.latestActivityOrderBy)}`

  return currentKey.toLowerCase() === serverKey.toLowerCase()
}
