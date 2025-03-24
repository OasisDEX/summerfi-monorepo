import { type GraphQLClient } from 'graphql-request'

import { fetchTopDepositors } from './fetcher'

/**
 * Fetches the top depositors from multiple networks (Mainnet, Base, Arbitrum) and returns a sorted list
 * of positions where the deposits are greater than zero.
 *
 * This function queries the top depositors from three different networks using GraphQL clients. It combines
 * the results, filters out positions with no deposits, and sorts the remaining positions in descending order
 * by their `inputTokenBalance`.
 *
 * @param {GraphQLClient} mainnetGraphQlClient - The GraphQL client for the Mainnet network.
 * @param {GraphQLClient} baseGraphQlClient - The GraphQL client for the Base network.
 * @param {GraphQLClient} arbitrumGraphQlClient - The GraphQL client for the Arbitrum network.
 * @returns {Promise<Position[]>} - A promise that resolves to an array of positions representing the top depositors
 * with deposits greater than zero, sorted by `inputTokenBalance` in descending order.
 *
 * @example
 * const topDepositors = await getTopDepositors({
 *   mainnetGraphQlClient,
 *   baseGraphQlClient,
 *   arbitrumGraphQlClient
 * })
 */
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
    fetchTopDepositors(mainnetGraphQlClient),
    fetchTopDepositors(baseGraphQlClient),
    fetchTopDepositors(arbitrumGraphQlClient),
  ])

  return [...mainnetPositions, ...basePositions, ...arbitrumPositions]
    .filter((position) => position.deposits.length > 0)
    .sort((a, b) => Number(b.inputTokenBalance) - Number(a.inputTokenBalance))
}
