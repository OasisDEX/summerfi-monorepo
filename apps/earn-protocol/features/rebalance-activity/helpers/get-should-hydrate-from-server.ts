import { parseProtocolFilter } from '@/features/rebalance-activity/table/filters/mappers'
import { normalizeQueryTableFilters } from '@/helpers/normalize-query-table-filters'

/**
 * Checks if rebalance activity data should be hydrated from the server.
 *
 * @param {Object} params - The filter parameters.
 * @param {string[]} [params.strategyFilter] - Selected strategy filters.
 * @param {string[]} [params.tokenFilter] - Selected token filters.
 * @param {string[]} [params.protocolFilter] - Selected protocol filters.
 * @param {{ [key: string]: string[] }} [params.searchParams] - Query params from the server.
 * @returns {boolean} True if hydration from server is needed.
 */
export const getRebalanceActivityShouldHydrateFromServer = ({
  strategyFilter,
  tokenFilter,
  protocolFilter,
  searchParams,
}: {
  strategyFilter?: string[]
  tokenFilter?: string[]
  protocolFilter?: string[]
  searchParams?: { [key: string]: string[] }
}) => {
  const currentKey = `${normalizeQueryTableFilters(strategyFilter)}|${normalizeQueryTableFilters(tokenFilter)}|${normalizeQueryTableFilters(protocolFilter)}`
  const serverKey = `${normalizeQueryTableFilters(searchParams?.strategies)}|${normalizeQueryTableFilters(searchParams?.tokens)}|${normalizeQueryTableFilters(parseProtocolFilter(searchParams?.protocols))}`

  return currentKey === serverKey
}
