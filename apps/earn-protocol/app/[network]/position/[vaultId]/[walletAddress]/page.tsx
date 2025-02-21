import {
  fetchForecastData,
  getPositionValues,
  parseForecastDatapoints,
  Text,
} from '@summerfi/app-earn-ui'
import { type PositionForecastAPIResponse, type SDKNetwork } from '@summerfi/app-types'
import {
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  subgraphNetworkToId,
} from '@summerfi/app-utils'
import { type IArmadaPosition } from '@summerfi/sdk-client'
import { isAddress } from 'viem'

import { getInterestRates } from '@/app/server-handlers/interest-rates'
import { getPositionHistory } from '@/app/server-handlers/position-history'
import { getUserActivity } from '@/app/server-handlers/sdk/get-user-activity'
import { getUserPosition } from '@/app/server-handlers/sdk/get-user-position'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { getVaultsHistoricalApy } from '@/app/server-handlers/vault-historical-apy'
import { getVaultsApy } from '@/app/server-handlers/vaults-apy'
import { VaultManageView } from '@/components/layout/VaultManageView/VaultManageView'
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

  const [vault, { vaults }, position, { userActivity, topDepositors }] = await Promise.all([
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
    getUserActivity({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
      walletAddress,
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

  const allVaultsWithConfig = decorateVaultsWithConfig({ vaults, systemConfig })

  const [arkInterestRatesMap, vaultInterestRates] = await Promise.all([
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
  ])

  const { netValue } = getPositionValues({
    position,
    vault,
  })

  const [positionHistory, positionForecastResponse, vaultApyRaw] = await Promise.all([
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
      fleets: [vaultWithConfig].map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(network),
      })),
    }),
  ])

  const vaultApy =
    vaultApyRaw[`${vaultWithConfig.id}-${subgraphNetworkToId(vaultWithConfig.protocol.network)}`]

  if (!positionForecastResponse.ok) {
    throw new Error('Failed to fetch forecast data')
  }
  const forecastData = (await positionForecastResponse.json()) as PositionForecastAPIResponse
  const positionForecast = parseForecastDatapoints(forecastData)

  const positionJsonSafe = parseServerResponseToClient<IArmadaPosition>(position)

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

  return (
    <VaultManageView
      vault={vaultWithConfig}
      vaultApy={vaultApy}
      vaults={allVaultsWithConfig}
      position={positionJsonSafe}
      viewWalletAddress={walletAddress}
      userActivity={userActivity}
      topDepositors={topDepositors}
      performanceChartData={performanceChartData}
      arksHistoricalChartData={arksHistoricalChartData}
      arksInterestRates={arksInterestRates}
    />
  )
}

export default EarnVaultManagePage
