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
}) => {
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
