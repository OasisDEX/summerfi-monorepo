import { Text } from '@summerfi/app-earn-ui'
import {
  getArksInterestRates,
  getVaultsApy,
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
import { redirect } from 'next/navigation'
import { isAddress } from 'viem'

import { getMedianDefiYield } from '@/app/server-handlers/defillama/get-median-defi-yield'
import { getMigratablePositions } from '@/app/server-handlers/migration'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { getPaginatedTopDepositors } from '@/app/server-handlers/tables-data/top-depositors/api'
import { MigrationVaultPageView } from '@/components/layout/MigrationVaultPageView/MigrationVaultPageView'
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
  const { network: paramsNetwork, vaultId, walletAddress, migrationPositionId } = await params
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const { config: systemConfig } = parseServerResponseToClient(await systemConfigHandler())

  const migrationsEnabled = !!systemConfig.features?.Migrations

  if (!migrationsEnabled) {
    redirect('/not-found')
  }

  const parsedVaultId = isAddress(vaultId)
    ? vaultId
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

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
    getVaultsList(),
    getMedianDefiYield(),
    getMigratablePositions({ walletAddress }),
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

  const [arkInterestRatesMap, vaultInterestRates, vaultApyRaw] = await Promise.all([
    vault?.arks
      ? getArksInterestRates({
          network: parsedNetwork,
          arksList: vault.arks,
        })
      : Promise.resolve({}),
    getVaultsHistoricalApy({
      // just the vault displayed
      fleets: [vaultWithConfig].map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
    getVaultsApy({
      fleets: [vaultWithConfig].map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
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
    arkInterestRatesMap,
    vaultInterestRates,
  })

  const vaultApyData =
    vaultApyRaw[`${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`]

  return (
    <MigrationVaultPageView
      vault={vaultWithConfig}
      vaults={allVaultsWithConfig}
      latestActivity={latestActivity}
      topDepositors={topDepositors}
      rebalanceActivity={rebalanceActivity}
      medianDefiYield={medianDefiYield}
      arksHistoricalChartData={arksHistoricalChartData}
      arksInterestRates={arkInterestRatesMap}
      vaultApyData={vaultApyData}
      migratablePosition={migratablePosition}
      walletAddress={walletAddress}
    />
  )
}

export default MigrationVaultPage
