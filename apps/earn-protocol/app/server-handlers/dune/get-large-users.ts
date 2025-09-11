interface LargeUser {
  user: string
}

/**
 * This function fetches the large users from Dune.
 * @returns An array of large users addresses.
 * @throws An error if the API key is not set.
 */
export const getLargeUsers = async () => {
  const apiKey = process.env.DUNE_LAZYSUMMER_ACCOUNT_API_KEY

  if (!apiKey) {
    throw new Error('DUNE_LAZYSUMMER_ACCOUNT_API_KEY environment variable is required')
  }

  try {
    const response = await fetch('https://api.dune.com/api/v1/query/5729350/results?limit=1000', {
      method: 'GET',
      headers: {
        'X-Dune-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 60 * 60 * 24, // 24 hours
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: { result: { rows: LargeUser[] } } = await response.json()

    const transformedData = data.result.rows.map((row) => row.user.toLowerCase())

    return transformedData
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching large users data:', error)

    return []
  }
}
