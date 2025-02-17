import { type TableSortedColumn } from '@summerfi/app-earn-ui'

export const fetchRebalances = async ({
  currentPage,
  sortConfig,
  tokenFilter,
  strategyFilter,
  protocolFilter,
  itemsPerPage,
}: {
  currentPage: number
  sortConfig?: TableSortedColumn<string>
  tokenFilter: string[]
  strategyFilter: string[]
  protocolFilter: string[]
  itemsPerPage: number
}) => {
  const skip = currentPage * itemsPerPage
  const tokenSymbolsParam =
    tokenFilter.length > 0
      ? `&tokenSymbols=${tokenFilter.map((item) => (item === 'ETH' ? 'WETH' : item)).join(',')}`
      : ''

  const strategyParam = strategyFilter.length > 0 ? `&strategy=${strategyFilter.join(',')}` : ''

  const protocolParam =
    protocolFilter.length > 0
      ? `&protocol=${protocolFilter.map((p) => p.replace(/-\d+$/u, '')).join(',')}`
      : ''

  const response = await fetch(
    `/earn/api/rebalance-activity?first=${itemsPerPage}&skip=${skip}&orderBy=${
      sortConfig?.key ?? 'timestamp'
    }&orderDirection=${sortConfig?.direction.toLowerCase() ?? 'desc'}${tokenSymbolsParam}${strategyParam}${protocolParam}`,
  )

  if (!response.ok) {
    throw new Error('Failed to fetch rebalances')
  }

  return response.json()
}
