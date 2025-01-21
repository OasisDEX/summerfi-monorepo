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

interface TallyResponse {
  data: {
    delegates: {
      nodes: SumrDelegates[]
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

  // TODO update governorId once available
  const response = await fetch('https://api.tally.xyz/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
    },
    body: JSON.stringify({
      query: `query {
        delegates(
          input: {
            filters: {
              organizationId: "2439139313007462075"
              governorId: "eip155:8453:0x668b528AE5A515aB711aB7487B0A678D74135317"
            }
            page: { limit: 4 }
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
        }
      }`,
    }),
    next: {
      revalidate: REVALIDATION_TIMES.SUMR_DELEGATES,
      tags: ['sumr-delegates'],
    },
  })

  if (!response.ok) {
    throw new Error(`Tally API request failed: ${response.statusText}`)
  }

  const result: TallyResponse = await response.json()

  // Check for GraphQL errors
  if (result.errors) {
    throw new Error(`GraphQL Error: ${result.errors[0].message}`)
  }

  if (!result.data) {
    // eslint-disable-next-line no-console
    console.error('No data returned from Tally API')

    return []
  }

  return result.data.delegates.nodes
}
