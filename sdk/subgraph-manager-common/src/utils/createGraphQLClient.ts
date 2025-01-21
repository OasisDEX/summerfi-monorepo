import { GraphQLClient } from 'graphql-request'
import { getSdk } from '../generated/client'

export const createGraphQLClient = (subgraphUrl: string): ReturnType<typeof getSdk> => {
  const client = new GraphQLClient(subgraphUrl)
  return getSdk(client)
}
