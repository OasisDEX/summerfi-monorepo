import { type TableSortedColumn } from '@summerfi/app-earn-ui'

export const fetchRebalances = async ({
  currentPage,
  sortConfig,
  tokenFilter,
  itemsPerPage,
}: {
  currentPage: number
  sortConfig?: TableSortedColumn<string>
  tokenFilter: string[]
  itemsPerPage: number
}) => {
  const skip = currentPage * itemsPerPage
  const tokenSymbolsParam =
    tokenFilter.length > 0
      ? `&tokenSymbols=${tokenFilter.map((item) => (item === 'ETH' ? 'WETH' : item)).join(',')}`
      : ''

  const response = await fetch(
    `/earn/api/rebalance-activity?first=${itemsPerPage}&skip=${skip}&orderBy=${
      sortConfig?.key ?? 'timestamp'
    }&orderDirection=${sortConfig?.direction.toLowerCase() ?? 'desc'}${tokenSymbolsParam}`,
  )

  if (!response.ok) {
    throw new Error('Failed to fetch rebalances')
  }

  return response.json()
}
