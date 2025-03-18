import { SDKNetwork } from '@summerfi/app-types'
import { type GraphQLClient } from 'graphql-request'

import { fetchTopDepositors } from './fetcher'

export const getTopDepositors = async ({
  mainnetGraphQlClient,
  baseGraphQlClient,
  arbitrumGraphQlClient,
}: {
  mainnetGraphQlClient: GraphQLClient
  baseGraphQlClient: GraphQLClient
  arbitrumGraphQlClient: GraphQLClient
}) => {
  const [mainnetPositions, basePositions, arbitrumPositions] = await Promise.all([
    fetchTopDepositors(mainnetGraphQlClient, SDKNetwork.Mainnet),
    fetchTopDepositors(baseGraphQlClient, SDKNetwork.Base),
    fetchTopDepositors(arbitrumGraphQlClient, SDKNetwork.ArbitrumOne),
  ])

  return [...mainnetPositions, ...basePositions, ...arbitrumPositions]
    .filter((position) => position.deposits.length > 0)
    .sort((a, b) => Number(b.inputTokenBalance) - Number(a.inputTokenBalance))
}
