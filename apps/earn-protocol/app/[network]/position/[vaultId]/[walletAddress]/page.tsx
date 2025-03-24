import {
  fetchForecastData,
  getDisplayToken,
  getPositionValues,
  parseForecastDatapoints,
  Text,
} from '@summerfi/app-earn-ui'
import { type PositionForecastAPIResponse, type SDKNetwork } from '@summerfi/app-types'
import {
  formatCryptoBalance,
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  subgraphNetworkToId,
} from '@summerfi/app-utils'
import { type IArmadaPosition } from '@summerfi/sdk-client'
import dayjs from 'dayjs'
import { capitalize } from 'lodash-es'
import { type Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAddress } from 'viem'

import { getInterestRates } from '@/app/server-handlers/interest-rates'
import { getMigratablePositions } from '@/app/server-handlers/migration'
import { getPositionHistory } from '@/app/server-handlers/position-history'
import { getUserPosition } from '@/app/server-handlers/sdk/get-user-position'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { getPaginatedTopDepositors } from '@/app/server-handlers/tables-data/top-depositors/api'
import { getVaultsHistoricalApy } from '@/app/server-handlers/vault-historical-apy'
import { getVaultsApy } from '@/app/server-handlers/vaults-apy'
import { VaultManageView } from '@/components/layout/VaultManageView/VaultManageView'
import { getMigrationBestVaultApy } from '@/features/migration/helpers/get-migration-best-vault-apy'
import { getArkHistoricalChartData } from '@/helpers/chart-helpers/get-ark-historical-data'
import { getPositionPerformanceData } from '@/helpers/chart-helpers/get-position-performance-data'
import { mapArkLatestInterestRates } from '@/helpers/map-ark-interest-rates'
import {
  decorateVaultsWithConfig,
  getVaultIdByVaultCustomName,
} from '@/helpers/vault-custom-value-helpers'

type EarnVaultManagePageProps = {
  params: Promise<{
    vaultId: string
    network: SDKNetwork
    walletAddress: string
  }>
}

const EarnVaultManagePage = async ({ params }: EarnVaultManagePageProps) => {
  const { network: paramsNetwork, vaultId, walletAddress } = await params
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const { config: systemConfig } = parseServerResponseToClient(await systemConfigHandler())

  const parsedVaultId = isAddress(vaultId)
    ? vaultId
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  if (!parsedVaultId && !isAddress(vaultId)) {
    redirect('/not-found')
  }
  if (!isAddress(walletAddress)) {
    redirect('/not-found')
  }

  const strategy = `${parsedVaultId}-${parsedNetwork}`

  const [vault, { vaults }, position, topDepositors, latestActivity, rebalanceActivity] =
    await Promise.all([
      getVaultDetails({
        vaultAddress: parsedVaultId,
        network: parsedNetwork,
      }),
      getVaultsList(),
      getUserPosition({
        vaultAddress: parsedVaultId,
        network: parsedNetwork,
        walletAddress,
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
        userAddress: walletAddress,
      }),
      getPaginatedRebalanceActivity({
        page: 1,
        limit: 4,
        strategies: [strategy],
        startTimestamp: dayjs().subtract(30, 'days').unix(),
      }),
    ])

  if (!vault) {
    return (
      <Text>
        No vault found with the id {vaultId} on the network {parsedNetwork}
      </Text>
    )
  }

  if (!position) {
    return (
      <Text>
        No position found on {walletAddress} on the network {parsedNetwork}
      </Text>
    )
  }

  const [vaultWithConfig] = decorateVaultsWithConfig({
    vaults: [vault],
    systemConfig,
  })

  const allVaultsWithConfig = decorateVaultsWithConfig({ vaults, systemConfig }).filter(
    ({ inputToken }) => inputToken.symbol !== 'EURC',
  )

  const { netValue } = getPositionValues({
    position,
    vault,
  })

  const [
    arkInterestRatesMap,
    vaultInterestRates,
    positionHistory,
    positionForecastResponse,
    vaultsApyRaw,
    migratablePositionsData,
  ] = await Promise.all([
    getInterestRates({
      network: parsedNetwork,
      arksList: vault.arks,
    }),
    getVaultsHistoricalApy({
      // just the vault displayed
      fleets: [vaultWithConfig].map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(network),
      })),
    }),
    getPositionHistory({
      network: parsedNetwork,
      address: walletAddress.toLowerCase(),
      vault,
    }),
    fetchForecastData({
      fleetAddress: vault.id as `0x${string}`,
      chainId: Number(parsedNetworkId),
      amount: Number(netValue.toFixed(position.amount.token.decimals)),
    }),
    getVaultsApy({
      fleets: allVaultsWithConfig.map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(network),
      })),
    }),
    getMigratablePositions({
      walletAddress,
    }),
  ])

  const vaultApyData =
    vaultsApyRaw[`${vaultWithConfig.id}-${subgraphNetworkToId(vaultWithConfig.protocol.network)}`]

  if (!positionForecastResponse.ok) {
    throw new Error('Failed to fetch forecast data')
  }
  const forecastData = (await positionForecastResponse.json()) as PositionForecastAPIResponse
  const positionForecast = parseForecastDatapoints(forecastData)

  const positionJsonSafe = parseServerResponseToClient<IArmadaPosition>(position)

  const migratablePositions = parseServerResponseToClient(migratablePositionsData)

  const performanceChartData = getPositionPerformanceData({
    vault: vaultWithConfig,
    position: positionJsonSafe,
    positionHistory,
    positionForecast,
  })

  const arksHistoricalChartData = getArkHistoricalChartData({
    vault: vaultWithConfig,
    arkInterestRatesMap,
    vaultInterestRates,
  })

  const arksInterestRates = mapArkLatestInterestRates(arkInterestRatesMap)

  const migrationBestVaultApy = getMigrationBestVaultApy({
    migratablePositions,
    vaultsWithConfig: allVaultsWithConfig,
    vaultsApyByNetworkMap: vaultsApyRaw,
  })

  return (
    <VaultManageView
      vault={vaultWithConfig}
      vaultApyData={vaultApyData}
      vaults={allVaultsWithConfig}
      position={positionJsonSafe}
      viewWalletAddress={walletAddress}
      latestActivity={latestActivity}
      topDepositors={topDepositors}
      rebalanceActivity={rebalanceActivity}
      performanceChartData={performanceChartData}
      arksHistoricalChartData={arksHistoricalChartData}
      arksInterestRates={arksInterestRates}
      migratablePositions={migratablePositions}
      migrationBestVaultApy={migrationBestVaultApy}
    />
  )
}

export async function generateMetadata({ params }: EarnVaultManagePageProps): Promise<Metadata> {
  const { network: paramsNetwork, vaultId, walletAddress } = await params
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const { config: systemConfig } = parseServerResponseToClient(await systemConfigHandler())
  const prodHost = (await headers()).get('host')
  const baseUrl = new URL(`https://${prodHost}`)

  const parsedVaultId = isAddress(vaultId)
    ? vaultId
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  const [position, vault] = await Promise.all([
    getUserPosition({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
      walletAddress,
    }),
    getVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
  ])

  const { netValue } =
    position && vault
      ? getPositionValues({
          position,
          vault,
        })
      : { netValue: 0 }

  return {
    title: `Lazy Summer Protocol - ${formatCryptoBalance(netValue)} ${vault ? getDisplayToken(vault.inputToken.symbol) : ''} position on ${capitalize(paramsNetwork)}`,
    openGraph: {
      siteName: 'Lazy Summer Protocol',
      images: `${baseUrl}earn/api/og/vault-position?amount=${formatCryptoBalance(netValue)}&token=${vault ? getDisplayToken(vault.inputToken.symbol) : ''}&address=${walletAddress}`,
    },
  }
}

export default EarnVaultManagePage
