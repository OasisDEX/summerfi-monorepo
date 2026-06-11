import { getArksInterestRates } from '@summerfi/app-server-handlers'
import {
  type ArksHistoricalChartData,
  type InterestRates,
  type SingleSourceChartData,
  type SupportedSDKNetworks,
} from '@summerfi/app-types'
import { subgraphNetworkToId, supportedSDKNetwork } from '@summerfi/app-utils'
import dayjs from 'dayjs'

import { getCachedRwaVaultNavHistory } from '@/app/server-handlers/cached/get-rwa-vault-nav-history'
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
import { getRwaNavHistoricalData } from '@/helpers/chart-helpers/get-rwa-nav-historical-data'

export type VaultOpenDetailsData = {
  latestActivity: LatestActivityPagination
  topDepositors: TopDepositorsPagination
  rebalanceActivity: RebalanceActivityPagination
  curationEvents: VaultCurationEvent[]
  // ARK historical yield chart (DeFi vaults). Omitted for RWA vaults, which render the NAV chart.
  arksHistoricalChartData?: ArksHistoricalChartData
  // Historical NAV price chart (RWA vaults only).
  rwaNavHistoricalChartData?: SingleSourceChartData
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

  const { parsedNetwork, parsedVaultId, vaultWithConfig, isRwaVault } = ctx
  const strategy = `${parsedVaultId}-${parsedNetwork}`

  // Data needed regardless of vault kind. Kicked off immediately so it runs concurrently with the
  // chart-data branch below. The latest ARK rates feed the Vault-exposure section (light call).
  const commonDataPromise = Promise.all([
    getArksInterestRates({
      network: parsedNetwork,
      arksList: vaultWithConfig.arks,
      justLatestRates: true,
    }),
    getCachedVaultCurationEvents({
      network: parsedNetwork,
      vault: vaultWithConfig,
      timestampFrom: dayjs().subtract(30, 'days').unix(),
      isRwaVault,
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

  let arksHistoricalChartData: ArksHistoricalChartData | undefined
  let rwaNavHistoricalChartData: SingleSourceChartData | undefined

  if (isRwaVault) {
    // RWA vaults: a single Historical NAV price line sourced via an in-app subgraph call. We
    // deliberately skip the resource-intensive ARK pipeline (benchmark + full historical ARK rates
    // + historical APY) since it doesn't apply to RWA vaults.
    const navHistory = await getCachedRwaVaultNavHistory({
      network: parsedNetwork,
      vaultId: parsedVaultId,
    })

    rwaNavHistoricalChartData = getRwaNavHistoricalData({ navHistory })
  } else {
    const [{ chartData: vaultBenchmark }, fullArkInterestRatesMap, vaultInterestRates] =
      await Promise.all([
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
        getCachedVaultsHistoricalApy({
          // just the vault displayed
          fleets: [vaultWithConfig].map(({ id, protocol: { network: vaultNetwork } }) => ({
            fleetAddress: id,
            chainId: subgraphNetworkToId(supportedSDKNetwork(vaultNetwork)),
          })),
        }),
      ])

    arksHistoricalChartData = getArkHistoricalChartData({
      vault: vaultWithConfig,
      arkInterestRatesMap: fullArkInterestRatesMap,
      vaultInterestRates,
      vaultBenchmark,
    })
  }

  const [
    latestArkInterestRatesMap,
    curationEvents,
    topDepositors,
    latestActivity,
    rebalanceActivity,
  ] = await commonDataPromise

  return {
    latestActivity,
    topDepositors,
    rebalanceActivity,
    curationEvents,
    arksHistoricalChartData,
    rwaNavHistoricalChartData,
    arksInterestRates: latestArkInterestRatesMap,
  }
}
