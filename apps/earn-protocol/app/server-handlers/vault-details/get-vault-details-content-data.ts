import { getArksInterestRates } from '@summerfi/app-server-handlers'
import {
  type ArksHistoricalChartData,
  type InterestRates,
  type SupportedSDKNetworks,
  type VaultApyData,
} from '@summerfi/app-types'
import { getVaultNiceName, subgraphNetworkToId, supportedSDKNetwork } from '@summerfi/app-utils'

import { getCachedTvl } from '@/app/server-handlers/cached/get-tvl'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsHistoricalApy } from '@/app/server-handlers/cached/get-vaults-historical-apy'
import { userAddresesToFilterOut } from '@/app/server-handlers/tables-data/consts'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { resolveVaultDetailsContext } from '@/app/server-handlers/vault-details/resolve-vault-details-context'
import { getArkHistoricalChartData } from '@/helpers/chart-helpers/get-ark-historical-data'

export type VaultDetailsContentData = {
  arksHistoricalChartData: ArksHistoricalChartData
  summerVaultName: string
  arksInterestRates: InterestRates
  vaultApyData: VaultApyData
  totalRebalanceActions: number
  totalUsers: number
  tvl: number
}

// Below-the-fold data the VaultDetailsView sections need (historical yield chart, vault exposure
// rates, and the security/stats block). Shared by the /api/vault-details-content route and the
// server-side prefetch in the page. The arksHistoricalChartData is computed here so only the
// JSON-safe chart result crosses the wire.
export const getVaultDetailsContentData = async ({
  network,
  vaultId,
}: {
  network: SupportedSDKNetworks
  vaultId: string
}): Promise<VaultDetailsContentData | null> => {
  const ctx = await resolveVaultDetailsContext({ network, vaultId })

  if (!ctx.vaultWithConfig) {
    return null
  }

  const { parsedNetwork, vaultWithConfig } = ctx

  const [
    fullArkInterestRatesMap,
    latestArkInterestRatesMap,
    vaultInterestRates,
    vaultsApyRaw,
    tvl,
    rebalanceActivity,
    latestActivity,
  ] = await Promise.all([
    getArksInterestRates({
      network: parsedNetwork,
      arksList: vaultWithConfig.arks.filter(
        (ark): boolean => Number(ark.depositCap) > 0 || Number(ark.inputTokenBalance) > 0,
      ),
    }),
    getArksInterestRates({
      network: parsedNetwork,
      arksList: vaultWithConfig.arks,
      justLatestRates: true,
    }),
    getCachedVaultsHistoricalApy({
      // just the vault displayed
      fleets: [vaultWithConfig].map(({ id, protocol: { network: protocolNetwork } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(protocolNetwork)),
      })),
    }),
    getCachedVaultsApy({
      fleets: [vaultWithConfig].map(({ id, protocol: { network: protocolNetwork } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(protocolNetwork)),
      })),
    }),
    getCachedTvl(),
    // just to get info about total rebalance actions
    getPaginatedRebalanceActivity({
      page: 1,
      limit: 1,
    }),
    // just to get info about total unique users
    getPaginatedLatestActivity({
      page: 1,
      limit: 1,
      filterOutUsersAddresses: userAddresesToFilterOut,
    }),
  ])

  const arksHistoricalChartData = getArkHistoricalChartData({
    vault: vaultWithConfig,
    arkInterestRatesMap: fullArkInterestRatesMap,
    vaultInterestRates,
  })

  return {
    arksHistoricalChartData,
    summerVaultName: getVaultNiceName({ vault: vaultWithConfig }),
    arksInterestRates: latestArkInterestRatesMap,
    vaultApyData:
      vaultsApyRaw[
        `${vaultWithConfig.id}-${subgraphNetworkToId(supportedSDKNetwork(vaultWithConfig.protocol.network))}`
      ],
    totalRebalanceActions: rebalanceActivity.pagination.totalItems,
    totalUsers: latestActivity.totalUniqueUsers,
    tvl,
  }
}
