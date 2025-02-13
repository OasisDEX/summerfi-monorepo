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
import { VaultManageView } from '@/components/layout/VaultManageView/VaultManageView'
import {
  decorateCustomVaultFields,
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
  const { network, vaultId, walletAddress } = await params
  const parsedNetwork = humanNetworktoSDKNetwork(network)
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

  const interestRates = await getInterestRates({
    network: parsedNetwork,
    arksList: vault.arks,
  })

  const { netValue } = getPositionValues({
    positionData: position,
    vaultData: vault,
  })

  const [positionHistory, positionForecastResponse] = await Promise.all([
    await getPositionHistory({
      network: parsedNetwork,
      address: walletAddress.toLowerCase(),
      vault,
    }),
    await fetchForecastData({
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

  const [vaultDecorated] = decorateCustomVaultFields({
    vaults: [vault],
    systemConfig,
    position,
    decorators: {
      arkInterestRatesMap: interestRates,
      positionHistory,
      positionForecast,
    },
  })

  const vaultsDecorated = decorateCustomVaultFields({ vaults, systemConfig })

  const positionJsonSafe = parseServerResponseToClient<IArmadaPosition>(position)

  return (
    <VaultManageView
      vault={vaultDecorated}
      vaults={vaultsDecorated}
      position={positionJsonSafe}
      viewWalletAddress={walletAddress}
      userActivity={userActivity}
      topDepositors={topDepositors}
    />
  )
}

export default EarnVaultManagePage
