/* eslint-disable no-console */
import { type IArmadaPosition, type SDKNetwork } from '@summerfi/app-types'
import { aggregateArksPerNetwork, parseServerResponseToClient } from '@summerfi/app-utils'

import { getInterestRates } from '@/app/server-handlers/interest-rates'
import { portfolioPositionsHandler } from '@/app/server-handlers/portfolio/portfolio-positions-handler'
import { getUserPositions } from '@/app/server-handlers/sdk/get-user-positions'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { decorateCustomVaultFields } from '@/helpers/vault-custom-value-helpers'

/**
 * Fetches and aggregates all portfolio-related data for a given wallet address in a single request.
 * This includes:
 * - User positions from the SDK
 * - Available vaults list
 * - System configuration
 * - Interest rates for each ARK across networks
 * - Processed position details
 *
 * @param {Object} params - The parameters object
 * @param {string} params.walletAddress - The Ethereum wallet address to fetch data for
 * @returns {Promise<{
 *   vaultsList: Object,
 *   vaultsDecorated: Object,
 *   systemConfig: Object,
 *   userPositions: Array,
 *   positionsList: Array
 * }>} Object containing all portfolio data
 * @throws {Error} If portfolio data fails to load or no vaults data is available
 */
export const portfolioBulkRequest = async ({ walletAddress }: { walletAddress: string }) => {
  try {
    const [userPositions, vaultsList, systemConfig] = await Promise.all([
      getUserPositions({ walletAddress }),
      getVaultsList(),
      systemConfigHandler(),
    ]).catch((error) => {
      console.error('Failed to fetch initial data:', error)

      throw new Error('Failed to load portfolio data')
    })

    if (!vaultsList.vaults) {
      throw new Error('No vaults data available')
    }

    const positionsJsonSafe = userPositions
      ? parseServerResponseToClient<IArmadaPosition[]>(userPositions)
      : []

    const aggregatedArksPerNetwork = aggregateArksPerNetwork(vaultsList.vaults)

    const interestRatesPromises = Object.entries(aggregatedArksPerNetwork).map(
      ([network, { arks }]) =>
        getInterestRates({
          network: network as SDKNetwork,
          arksList: arks,
          justLatestRates: true,
        }),
    )

    const positionsPromises = positionsJsonSafe.map((position) =>
      portfolioPositionsHandler({
        position,
        vaultsList: vaultsList.vaults,
        config: systemConfig.config,
        walletAddress,
      }),
    )

    const allResults = await Promise.all([
      Promise.all(positionsPromises).catch((error) => {
        console.error('Failed to fetch positions:', error)

        return []
      }),
      Promise.all(interestRatesPromises).catch((error) => {
        console.error('Failed to fetch interest rates:', error)

        return []
      }),
    ])

    const [positionsList, interestRatesResults] = allResults

    const { config } = parseServerResponseToClient(systemConfig)

    const vaultsDecorated = decorateCustomVaultFields({
      vaults: vaultsList.vaults,
      systemConfig: config,
      decorators: {
        arkInterestRatesMap: interestRatesResults.reduce((acc, curr) => {
          return { ...acc, ...curr }
        }, {}),
      },
    })

    return {
      vaultsList,
      vaultsDecorated,
      systemConfig,
      userPositions,
      positionsList,
    }
  } catch (error) {
    console.error('Portfolio bulk request failed:', error)

    throw error
  }
}
