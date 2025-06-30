import { Logger } from '@aws-lambda-powertools/logger'

export interface SumrDelegates {
  id: string
  account: {
    address: string
    bio: string
    name: string
    picture: string | null
    twitter: string
    ens: string
  }
  votesCount: string
  delegatorsCount: number
  statement: {
    statementSummary: string
  } | null
}

interface PageInfo {
  firstCursor: string
  lastCursor: string
}

interface TallyResponse {
  data: {
    delegates: {
      nodes: SumrDelegates[]
      pageInfo: PageInfo
    }
  } | null
  errors?: {
    message: string
  }[]
}

/**
 * Fetches all delegate data from the Tally API for the Summer Protocol governance
 *
 * This function retrieves delegate information from Tally's GraphQL API for the
 * Summer Protocol organization. It handles pagination automatically to fetch all
 * delegates, implementing rate limiting with 200ms delays between requests to
 * respect API limits.
 *
 * The function queries for delegates in the Summer Protocol governance system
 * (organization ID: 2439139313007462075) on Base network (governor ID: eip155:8453:0xBE5A4DD68c3526F32B454fE28C9909cA0601e9Fa).
 *
 * @param {Logger} logger - AWS Lambda Powertools logger instance for structured logging
 *
 * @returns {Promise<SumrDelegates[]>} Promise that resolves to an array of delegate data
 *
 * @throws {Error} When TALLY_API_KEY environment variable is not set
 * @throws {Error} When the Tally API request fails (non-200 response)
 * @throws {Error} When GraphQL errors are returned from the API
 *
 * @example
 * ```typescript
 * try {
 *   const delegates = await getSumrDelegates()
 *   console.log(`Fetched ${delegates.length} delegates`)
 * } catch (error) {
 *   console.error('Failed to fetch delegates:', error)
 * }
 * ```
 *
 * @see {@link SumrDelegates} for the structure of returned delegate data
 */
export const getSumrDelegates = async (logger: Logger): Promise<SumrDelegates[]> => {
  const apiKey = process.env.TALLY_API_KEY ?? ''

  if (!apiKey) {
    throw new Error('TALLY_API_KEY is not set')
  }

  let allDelegates: SumrDelegates[] = []
  let hasMore = true
  let cursor: string | null = null
  let isFirstRequest = true

  while (hasMore) {
    // Add 200ms delay before each request (except the first one)
    const timeout = 200
    if (!isFirstRequest) {
      await new Promise((resolve) => setTimeout(resolve, timeout))
    }

    isFirstRequest = false
    const query = `query {
    delegates(
      input: {
        filters: {
          organizationId: "2439139313007462075"
          governorId: "eip155:8453:0xBE5A4DD68c3526F32B454fE28C9909cA0601e9Fa"
        }
        page: { limit: 20${cursor ? `, afterCursor: "${cursor}"` : ''} }
      }
    ) {
      nodes {
        ... on Delegate {
          id
          account {
            address
            bio
            name
            picture
            twitter
            ens
          }
          votesCount
          delegatorsCount
          statement {
            statementSummary
          }
        }
      }
      pageInfo {
        firstCursor
        lastCursor
      }
    }
  }`

    const response = await fetch('https://api.tally.xyz/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(`Tally API request failed: ${response.statusText}`)
    }

    const result: TallyResponse = await response.json()

    if (result.errors) {
      throw new Error(`GraphQL Error: ${result.errors[0].message}`)
    }

    if (!result.data) {
      // eslint-disable-next-line no-console
      console.error('No data returned from Tally API')

      return allDelegates
    }

    allDelegates = [...allDelegates, ...result.data.delegates.nodes]

    // Check if we got any results and if there's a next cursor
    cursor = result.data.delegates.pageInfo.lastCursor

    // Continue if we got results and have a valid cursor
    hasMore = !!(result.data.delegates.nodes.length > 0 && cursor && cursor.length > 0)

    logger.info('Fetched delegates', {
      totalDelegates: allDelegates.length,
    })
  }

  return allDelegates
}
