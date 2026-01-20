import { Text } from '@summerfi/app-earn-ui'
import {
  getArksInterestRates,
  getVaultInfo,
  getVaultsHistoricalApy,
} from '@summerfi/app-server-handlers'
import { type SupportedSDKNetworks } from '@summerfi/app-types'
import {
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import dayjs from 'dayjs'
import { unstable_cache as unstableCache } from 'next/cache'
import { redirect } from 'next/navigation'
import { isAddress } from 'viem'

import { getCachedMedianDefiYield } from '@/app/server-handlers/cached/defillama/get-median-defi-yield'
import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { getCachedMigratablePositions } from '@/app/server-handlers/cached/migration'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getCachedSumrPrice } from '@/app/server-handlers/sumr-price'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { getPaginatedTopDepositors } from '@/app/server-handlers/tables-data/top-depositors/api'
import { MigrationVaultPageView } from '@/components/layout/MigrationVaultPageView/MigrationVaultPageView'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'
import { getArkHistoricalChartData } from '@/helpers/chart-helpers/get-ark-historical-data'
import {
  decorateVaultsWithConfig,
  getVaultIdByVaultCustomName,
} from '@/helpers/vault-custom-value-helpers'

type MigrationVaultPageProps = {
  params: Promise<{
    vaultId: string // could be vault address or the vault name
    network: SupportedSDKNetworks
    walletAddress: string
    migrationPositionId: string
  }>
}

const MigrationVaultPage = async ({ params }: MigrationVaultPageProps) => {
  const [{ network: paramsNetwork, vaultId, walletAddress, migrationPositionId }, configRaw] =
    await Promise.all([params, getCachedConfig()])
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const systemConfig = parseServerResponseToClient(configRaw)

  const migrationsEnabled = !!systemConfig.features?.Migrations

  if (!migrationsEnabled) {
    redirect('/not-found')
  }

  const parsedVaultId = isAddress(vaultId)
    ? vaultId
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  if (!parsedVaultId) {
    redirect('/not-found')
  }

  const strategy = `${parsedVaultId}-${parsedNetwork}`

  const [
    vault,
    { vaults },
    medianDefiYield,
    migratablePositionsData,
    topDepositors,
    latestActivity,
    rebalanceActivity,
  ] = await Promise.all([
    getVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
    getCachedVaultsList(),
    getCachedMedianDefiYield(),
    getCachedMigratablePositions({ walletAddress }),
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
      startTimestamp: dayjs().subtract(30, 'days').unix(),
    }),
  ])

  const migratablePositions = parseServerResponseToClient(migratablePositionsData)

  const migratablePosition = migratablePositions.find(
    (position) => position.id.toLowerCase() === migrationPositionId.toLowerCase(),
  )

  if (!migratablePosition) {
    return <Text>No migration position found with the id {migrationPositionId}</Text>
  }

  const [vaultWithConfig] = vault
    ? decorateVaultsWithConfig({
        vaults: [vault],
        systemConfig,
      })
    : []

  const cacheConfig = {
    revalidate: CACHE_TIMES.INTEREST_RATES,
    tags: [CACHE_TAGS.INTEREST_RATES],
  }

  const [
    fullArkInterestRatesMap,
    latestArkInterestRatesMap,
    vaultInterestRates,
    vaultApyRaw,
    vaultInfo,
    sumrPrice,
  ] = await Promise.all([
    vault?.arks
      ? getArksInterestRates({
          network: parsedNetwork,
          arksList: vault.arks.filter(
            (ark): boolean => Number(ark.depositCap) > 0 || Number(ark.inputTokenBalance) > 0,
          ),
        })
      : Promise.resolve({}),
    vault?.arks
      ? getArksInterestRates({
          network: parsedNetwork,
          arksList: vault.arks,
          justLatestRates: true,
        })
      : Promise.resolve({}),
    unstableCache(
      getVaultsHistoricalApy,
      ['vaultsHistoricalApy', `${vaultWithConfig.id}-${parsedNetworkId}`],
      cacheConfig,
    )({
      // just the vault displayed
      fleets: [vaultWithConfig].map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
    getCachedVaultsApy({
      fleets: [vaultWithConfig].map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
    unstableCache(
      getVaultInfo,
      ['vaultInfo', parsedNetwork, parsedVaultId],
      cacheConfig,
    )({ network: parsedNetwork, vaultAddress: parsedVaultId }),
    getCachedSumrPrice(),
  ])

  const allVaultsWithConfig = decorateVaultsWithConfig({ vaults, systemConfig })

  if (!vault) {
    return (
      <Text>
        No vault found with the id {parsedVaultId} on the network {parsedNetwork}
      </Text>
    )
  }

  const arksHistoricalChartData = getArkHistoricalChartData({
    vault: vaultWithConfig,
    arkInterestRatesMap: fullArkInterestRatesMap,
    vaultInterestRates,
  })

  const vaultApyData =
    vaultApyRaw[`${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`]

  const vaultInfoParsed = parseServerResponseToClient(vaultInfo)

  return (
    <MigrationVaultPageView
      vault={vaultWithConfig}
      vaults={allVaultsWithConfig}
      vaultInfo={vaultInfoParsed}
      latestActivity={latestActivity}
      topDepositors={topDepositors}
      rebalanceActivity={rebalanceActivity}
      medianDefiYield={medianDefiYield}
      arksHistoricalChartData={arksHistoricalChartData}
      arksInterestRates={latestArkInterestRatesMap}
      vaultApyData={vaultApyData}
      migratablePosition={migratablePosition}
      walletAddress={walletAddress}
      sumrPrice={sumrPrice}
    />
  )
}

export default MigrationVaultPage
