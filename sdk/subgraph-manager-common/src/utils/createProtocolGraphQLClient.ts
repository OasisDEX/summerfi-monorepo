import { GraphQLClient } from 'graphql-request'
import { getSdk } from '../generated/protocol/client'

export const createProtocolGraphQLClient = (subgraphUrl: string): ReturnType<typeof getSdk> => {
  const client = new GraphQLClient(subgraphUrl)
  return getSdk(client)
}
