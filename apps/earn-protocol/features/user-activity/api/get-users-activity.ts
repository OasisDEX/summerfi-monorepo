export const getUsersActivity = async ({
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
}) => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(tokens && tokens.length > 0 && { tokens: tokens.join(',') }),
    ...(strategies && strategies.length > 0 && { strategies: strategies.join(',') }),
    ...(sortBy && { sortBy }),
    ...(orderBy && { orderBy: orderBy.toLowerCase() }),
  })

  const response = await fetch(`/earn/api/latest-activity?${query.toString()}`)

  return response.json()
}
