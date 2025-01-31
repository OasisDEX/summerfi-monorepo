import { REVALIDATION_TIMES } from '@/constants/revalidations'

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

export const getSumrDelegates = async (): Promise<SumrDelegates[]> => {
  const apiKey = process.env.TALLY_API_KEY ?? ''

  if (!apiKey) {
    throw new Error('TALLY_API_KEY is not set')
  }

  let allDelegates: SumrDelegates[] = []
  let hasMore = true
  let cursor: string | null = null

  while (hasMore) {
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
      next: {
        revalidate: REVALIDATION_TIMES.SUMR_DELEGATES,
        tags: ['sumr-delegates'],
      },
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

    // If we got less than the requested limit, we've reached the end
    hasMore = result.data.delegates.nodes.length === 20
    cursor = result.data.delegates.pageInfo.lastCursor
  }

  return allDelegates
}
