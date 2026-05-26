import { GraphQLClient } from 'graphql-request'
import { getSdk } from '../generated/rwa/client'

export const createRwaGraphQLClient = (subgraphUrl: string): ReturnType<typeof getSdk> => {
  const client = new GraphQLClient(subgraphUrl)
  return getSdk(client)
}
