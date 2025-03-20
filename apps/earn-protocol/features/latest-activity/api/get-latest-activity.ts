export const getLatestActivity = async ({
  page,
  limit = 50,
  tokens,
  strategies,
  sortBy,
  orderBy,
  userAddress,
}: {
  page: number
  limit?: number
  tokens?: string[]
  strategies?: string[]
  sortBy?: string
  orderBy?: string
  userAddress?: string
}) => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(tokens && tokens.length > 0 && { tokens: tokens.join(',') }),
    ...(strategies && strategies.length > 0 && { strategies: strategies.join(',') }),
    ...(sortBy && { sortBy }),
    ...(orderBy && { orderBy: orderBy.toLowerCase() }),
    ...(userAddress && { userAddress }),
  })

  const response = await fetch(`/earn/api/latest-activity?${query.toString()}`)

  return response.json()
}
