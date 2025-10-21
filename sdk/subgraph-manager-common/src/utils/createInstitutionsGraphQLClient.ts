import { GraphQLClient } from 'graphql-request'
import { getSdk } from '../generated/institutions/client'

export const createInstitutionsGraphQLClient = (subgraphUrl: string): ReturnType<typeof getSdk> => {
  const client = new GraphQLClient(subgraphUrl)
  return getSdk(client)
}
