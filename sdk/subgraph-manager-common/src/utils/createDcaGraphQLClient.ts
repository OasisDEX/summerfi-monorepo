import { GraphQLClient } from 'graphql-request'
import { getSdk } from '../generated/dca/client'

export const createDcaGraphQLClient = (subgraphUrl: string): ReturnType<typeof getSdk> => {
  const client = new GraphQLClient(subgraphUrl)
  return getSdk(client)
}
