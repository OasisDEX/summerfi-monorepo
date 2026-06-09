import {
  fetchForecastData,
  getPositionValues,
  parseForecastDatapoints,
} from '@summerfi/app-earn-ui'
import { getArksInterestRates } from '@summerfi/app-server-handlers'
import {
  type ArksHistoricalChartData,
  type IArmadaPosition,
  type InterestRates,
  type PerformanceChartData,
  type PositionForecastAPIResponse,
  type SupportedSDKNetworks,
} from '@summerfi/app-types'
import {
  parseServerResponseToClient,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import dayjs from 'dayjs'

import { getCachedPositionHistory } from '@/app/server-handlers/cached/get-position-history'
import { getCachedPositionsActivePeriods } from '@/app/server-handlers/cached/get-positions-active-periods'
import { getCachedVaultCurationEvents } from '@/app/server-handlers/cached/get-vault-curation-events'
import { getCachedVaultsBenchmark } from '@/app/server-handlers/cached/get-vaults-benchmark'
import { getCachedVaultsHistoricalApy } from '@/app/server-handlers/cached/get-vaults-historical-apy'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { getPaginatedTopDepositors } from '@/app/server-handlers/tables-data/top-depositors/api'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { resolveVaultManageContext } from '@/app/server-handlers/vault-manage/resolve-vault-manage-context'
import { type VaultCurationEvent } from '@/features/curation-activity/types'
import { getArkHistoricalChartData } from '@/helpers/chart-helpers/get-ark-historical-data'
import { getPositionPerformanceData } from '@/helpers/chart-helpers/get-position-performance-data'

// Each below-the-fold expander on the manage page fetches only its own slice, lazily on expand
// (see useVaultManageSectionQuery). Charts are computed server-side so only JSON-safe results
// cross the wire (the raw benchmark carries Date objects that don't survive JSON).
export type VaultManageSection =
  | 'performance'
  | 'yield-chart'
  | 'exposure'
  | 'rebalancing'
  | 'curation'
  | 'user-activity'

export type VaultManagePerformanceData = { performanceChartData: PerformanceChartData }
export type VaultManageYieldChartData = { arksHistoricalChartData: ArksHistoricalChartData }
export type VaultManageExposureData = { arksInterestRates: InterestRates }
export type VaultManageRebalancingData = { rebalanceActivity: RebalanceActivityPagination }
export type VaultManageCurationData = { curationEvents: VaultCurationEvent[] }
export type VaultManageUserActivityData = {
  latestActivity: LatestActivityPagination
  topDepositors: TopDepositorsPagination
}

type SectionParams = {
  network: SupportedSDKNetworks
  vaultId: string
  walletAddress: string
}

// Open by default on the page, so it's the one section we want eagerly: the position performance
// (forecast) chart. Needs the user position + forecast.
export const getVaultManagePerformanceData = async ({
  network,
  vaultId,
  walletAddress,
}: SectionParams): Promise<VaultManagePerformanceData | null> => {
  const ctx = await resolveVaultManageContext({ network, vaultId, walletAddress })

  if (!ctx.vault || !ctx.position || !ctx.vaultWithConfig) {
    return null
  }

  const { parsedNetworkId, vault, position, vaultWithConfig, isRwaVault } = ctx
  const { netValue } = getPositionValues({ position, vault })

  const [positionHistory, positionForecastResponse] = await Promise.all([
    getCachedPositionHistory({
      network: ctx.parsedNetwork,
      address: walletAddress.toLowerCase(),
      vault,
      isRwaVault,
    }),
    fetchForecastData({
      fleetAddress: vault.id as `0x${string}`,
      chainId: Number(parsedNetworkId),
      amount: Number(netValue.toFixed(position.amount.token.decimals)),
    }),
  ])

  if (!positionForecastResponse.ok) {
    throw new Error('Failed to fetch forecast data')
  }
  const forecastData = (await positionForecastResponse.json()) as PositionForecastAPIResponse
  const positionForecast = parseForecastDatapoints(forecastData)
  const positionJsonSafe = parseServerResponseToClient<IArmadaPosition>(position)

  return {
    performanceChartData: getPositionPerformanceData({
      vault: vaultWithConfig,
      position: positionJsonSafe,
      positionHistory,
      positionForecast,
    }),
  }
}

export const getVaultManageYieldChartData = async ({
  network,
  vaultId,
  walletAddress,
}: SectionParams): Promise<VaultManageYieldChartData | null> => {
  const ctx = await resolveVaultManageContext({
    network,
    vaultId,
    walletAddress,
    withPosition: false,
  })

  if (!ctx.vault || !ctx.vaultWithConfig) {
    return null
  }

  const { parsedNetwork, vault, vaultWithConfig } = ctx

  const [{ chartData: vaultBenchmark }, fullArkInterestRatesMap, vaultInterestRates] =
    await Promise.all([
      getCachedVaultsBenchmark({
        vaultChainId: subgraphNetworkToId(parsedNetwork),
        vaultToken: vault.inputToken.symbol,
      }),
      getArksInterestRates({
        network: parsedNetwork,
        arksList: vault.arks.filter(
          (ark): boolean => Number(ark.depositCap) > 0 || Number(ark.inputTokenBalance) > 0,
        ),
      }),
      getCachedVaultsHistoricalApy({
        fleets: [{ id: ctx.parsedVaultId as string, protocol: { network: parsedNetwork } }].map(
          ({ id, protocol: { network: vaultNetwork } }) => ({
            fleetAddress: id,
            chainId: subgraphNetworkToId(supportedSDKNetwork(vaultNetwork)),
          }),
        ),
      }),
    ])

  return {
    arksHistoricalChartData: getArkHistoricalChartData({
      vault: vaultWithConfig,
      arkInterestRatesMap: fullArkInterestRatesMap,
      vaultInterestRates,
      vaultBenchmark,
    }),
  }
}

export const getVaultManageExposureData = async ({
  network,
  vaultId,
  walletAddress,
}: SectionParams): Promise<VaultManageExposureData | null> => {
  const ctx = await resolveVaultManageContext({
    network,
    vaultId,
    walletAddress,
    withPosition: false,
  })

  if (!ctx.vault) {
    return null
  }

  return {
    arksInterestRates: await getArksInterestRates({
      network: ctx.parsedNetwork,
      arksList: ctx.vault.arks,
      justLatestRates: true,
    }),
  }
}

export const getVaultManageRebalancingData = async ({
  network,
  vaultId,
  walletAddress,
}: SectionParams): Promise<VaultManageRebalancingData | null> => {
  const ctx = await resolveVaultManageContext({
    network,
    vaultId,
    walletAddress,
    withPosition: false,
  })

  if (!ctx.parsedVaultId) {
    return null
  }

  const strategy = `${ctx.parsedVaultId}-${ctx.parsedNetwork}`
  const periods = await getCachedPositionsActivePeriods({ walletAddress })

  return {
    rebalanceActivity: await getPaginatedRebalanceActivity({
      page: 1,
      limit: 4,
      strategies: [strategy],
      startTimestamp: dayjs().subtract(30, 'days').unix(),
      periods,
    }),
  }
}

export const getVaultManageCurationData = async ({
  network,
  vaultId,
  walletAddress,
}: SectionParams): Promise<VaultManageCurationData | null> => {
  const ctx = await resolveVaultManageContext({
    network,
    vaultId,
    walletAddress,
    withPosition: false,
  })

  if (!ctx.vault) {
    return null
  }

  return {
    curationEvents: await getCachedVaultCurationEvents({
      network: ctx.parsedNetwork,
      vault: ctx.vault,
      timestampFrom: dayjs().subtract(30, 'days').unix(),
      isRwaVault: ctx.isRwaVault,
    }),
  }
}

export const getVaultManageUserActivityData = async ({
  network,
  vaultId,
  walletAddress,
}: SectionParams): Promise<VaultManageUserActivityData | null> => {
  const ctx = await resolveVaultManageContext({
    network,
    vaultId,
    walletAddress,
    withPosition: false,
  })

  if (!ctx.parsedVaultId) {
    return null
  }

  const strategy = `${ctx.parsedVaultId}-${ctx.parsedNetwork}`

  const [topDepositors, latestActivity] = await Promise.all([
    getPaginatedTopDepositors({
      page: 1,
      limit: 4,
      strategies: [strategy],
    }),
    getPaginatedLatestActivity({
      page: 1,
      limit: 4,
      strategies: [strategy],
      usersAddresses: [walletAddress],
    }),
  ])

  return { latestActivity, topDepositors }
}

// Dispatcher used by the dynamic [section] API route.
export const vaultManageSectionHandlers = {
  performance: getVaultManagePerformanceData,
  'yield-chart': getVaultManageYieldChartData,
  exposure: getVaultManageExposureData,
  rebalancing: getVaultManageRebalancingData,
  curation: getVaultManageCurationData,
  'user-activity': getVaultManageUserActivityData,
} as const
