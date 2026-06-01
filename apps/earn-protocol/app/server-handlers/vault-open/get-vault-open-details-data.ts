import { getArksInterestRates } from '@summerfi/app-server-handlers'
import {
  type ArksHistoricalChartData,
  type InterestRates,
  type SupportedSDKNetworks,
} from '@summerfi/app-types'
import { subgraphNetworkToId, supportedSDKNetwork } from '@summerfi/app-utils'
import dayjs from 'dayjs'

import { getCachedVaultCurationEvents } from '@/app/server-handlers/cached/get-vault-curation-events'
import { getCachedVaultsBenchmark } from '@/app/server-handlers/cached/get-vaults-benchmark'
import { getCachedVaultsHistoricalApy } from '@/app/server-handlers/cached/get-vaults-historical-apy'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { getPaginatedTopDepositors } from '@/app/server-handlers/tables-data/top-depositors/api'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { resolveVaultOpenContext } from '@/app/server-handlers/vault-open/resolve-vault-open-context'
import { type VaultCurationEvent } from '@/features/curation-activity/types'
import { getArkHistoricalChartData } from '@/helpers/chart-helpers/get-ark-historical-data'

export type VaultOpenDetailsData = {
  latestActivity: LatestActivityPagination
  topDepositors: TopDepositorsPagination
  rebalanceActivity: RebalanceActivityPagination
  curationEvents: VaultCurationEvent[]
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates: InterestRates
}

// Below-the-fold data the VaultOpenViewDetails expanders need (charts, interest rates, activity
// tables, curation events). Shared by the /api/vault-open-details route and the server-side
// prefetch in the page. The arksHistoricalChartData is computed here so only the JSON-safe chart
// result crosses the wire (the raw benchmark carries Date objects that don't survive JSON).
export const getVaultOpenDetailsData = async ({
  network,
  vaultId,
}: {
  network: SupportedSDKNetworks
  vaultId: string
}): Promise<VaultOpenDetailsData | null> => {
  const ctx = await resolveVaultOpenContext({ network, vaultId })

  if (!ctx.vaultWithConfig) {
    return null
  }

  const { parsedNetwork, parsedVaultId, vaultWithConfig } = ctx
  const strategy = `${parsedVaultId}-${parsedNetwork}`

  const [
    { chartData: vaultBenchmark },
    fullArkInterestRatesMap,
    latestArkInterestRatesMap,
    vaultInterestRates,
    curationEvents,
    topDepositors,
    latestActivity,
    rebalanceActivity,
  ] = await Promise.all([
    getCachedVaultsBenchmark({
      vaultChainId: subgraphNetworkToId(parsedNetwork),
      vaultToken: vaultWithConfig.inputToken.symbol,
    }),
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
      fleets: [vaultWithConfig].map(({ id, protocol: { network: vaultNetwork } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(vaultNetwork)),
      })),
    }),
    getCachedVaultCurationEvents({
      network: parsedNetwork,
      vault: vaultWithConfig,
      timestampFrom: dayjs().subtract(30, 'days').unix(),
    }),
    getPaginatedTopDepositors({
      page: 1,
      limit: 4,
      strategies: [strategy],
    }),
    getPaginatedLatestActivity({
      page: 1,
      limit: 4,
      strategies: [strategy],
    }),
    getPaginatedRebalanceActivity({
      page: 1,
      limit: 4,
      strategies: [strategy],
      startTimestamp: dayjs().subtract(30, 'days').unix(),
    }),
  ])

  const arksHistoricalChartData = getArkHistoricalChartData({
    vault: vaultWithConfig,
    arkInterestRatesMap: fullArkInterestRatesMap,
    vaultInterestRates,
    vaultBenchmark,
  })

  return {
    latestActivity,
    topDepositors,
    rebalanceActivity,
    curationEvents,
    arksHistoricalChartData,
    arksInterestRates: latestArkInterestRatesMap,
  }
}
