import { type IArmadaPosition, type SDKNetwork } from '@summerfi/app-types'
import { aggregateArksPerNetwork, parseServerResponseToClient } from '@summerfi/app-utils'

import { getInterestRates } from '@/app/server-handlers/interest-rates'
import { portfolioPositionsHandler } from '@/app/server-handlers/portfolio/portfolio-positions-handler'
import { getUserPositions } from '@/app/server-handlers/sdk/get-user-positions'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { decorateCustomVaultFields } from '@/helpers/vault-custom-value-helpers'

export const portfolioBulkRequest = async ({ walletAddress }: { walletAddress: string }) => {
  const [userPositions, vaultsList, systemConfig] = await Promise.all([
    getUserPositions({ walletAddress }),
    getVaultsList(),
    systemConfigHandler(),
  ])

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
    Promise.all(positionsPromises),
    Promise.all(interestRatesPromises),
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
}
