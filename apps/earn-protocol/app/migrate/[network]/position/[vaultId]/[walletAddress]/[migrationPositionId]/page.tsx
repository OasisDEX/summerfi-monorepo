import { Text } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'
import {
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  subgraphNetworkToId,
} from '@summerfi/app-utils'
import { redirect } from 'next/navigation'
import { isAddress } from 'viem'

import { getMedianDefiYield } from '@/app/server-handlers/defillama/get-median-defi-yield'
import { getInterestRates } from '@/app/server-handlers/interest-rates'
import { getMigratablePositions } from '@/app/server-handlers/migration'
import { getUsersActivity } from '@/app/server-handlers/sdk/get-users-activity'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { getVaultsHistoricalApy } from '@/app/server-handlers/vault-historical-apy'
import { getVaultsApy } from '@/app/server-handlers/vaults-apy'
import { MigrationVaultPageView } from '@/components/layout/MigrationVaultPageView/MigrationVaultPageView'
import { getArkHistoricalChartData } from '@/helpers/chart-helpers/get-ark-historical-data'
import { mapArkLatestInterestRates } from '@/helpers/map-ark-interest-rates'
import {
  decorateVaultsWithConfig,
  getVaultIdByVaultCustomName,
} from '@/helpers/vault-custom-value-helpers'

type MigrationVaultPageProps = {
  params: Promise<{
    vaultId: string // could be vault address or the vault name
    network: SDKNetwork
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

  const [
    vault,
    { vaults },
    { usersActivity, topDepositors },
    medianDefiYield,
    migratablePositionsData,
  ] = await Promise.all([
    getVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
    getVaultsList(),
    getUsersActivity({
      filterTestingWallets: true,
      vaultId,
    }),
    getMedianDefiYield(),
    getMigratablePositions({ walletAddress }),
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
      ? getInterestRates({
          network: parsedNetwork,
          arksList: vault.arks,
        })
      : Promise.resolve({}),
    getVaultsHistoricalApy({
      // just the vault displayed
      fleets: [vaultWithConfig].map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(network),
      })),
    }),
    getVaultsApy({
      fleets: [vaultWithConfig].map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(network),
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

  const arksInterestRates = mapArkLatestInterestRates(arkInterestRatesMap)
  const vaultApyData = vaultApyRaw[`${vault.id}-${subgraphNetworkToId(vault.protocol.network)}`]

  return (
    <MigrationVaultPageView
      vault={vaultWithConfig}
      vaults={allVaultsWithConfig}
      userActivity={usersActivity}
      topDepositors={topDepositors}
      medianDefiYield={medianDefiYield}
      arksHistoricalChartData={arksHistoricalChartData}
      arksInterestRates={arksInterestRates}
      vaultApyData={vaultApyData}
      migratablePosition={migratablePosition}
      walletAddress={walletAddress}
    />
  )
}

export default MigrationVaultPage
