import { fetchForecastData, parseForecastDatapoints, Text } from '@summerfi/app-earn-ui'
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
  params: {
    vaultId: string
    network: SDKNetwork
    walletAddress: string
  }
}

export const revalidate = 60

const EarnVaultManagePage = async ({ params }: EarnVaultManagePageProps) => {
  const parsedNetwork = humanNetworktoSDKNetwork(params.network)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const { config: systemConfig } = parseServerResponseToClient(await systemConfigHandler())

  const parsedVaultId = isAddress(params.vaultId)
    ? params.vaultId
    : getVaultIdByVaultCustomName(params.vaultId, String(parsedNetworkId), systemConfig)

  const [vault, { vaults }, position, { userActivity, topDepositors }] = await Promise.all([
    getVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
    getVaultsList(),
    getUserPosition({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
      walletAddress: params.walletAddress,
    }),
    getUserActivity({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
      walletAddress: params.walletAddress,
    }),
  ])

  if (!vault) {
    return (
      <Text>
        No vault found with the id {params.vaultId} on the network {parsedNetwork}
      </Text>
    )
  }

  if (!position) {
    return (
      <Text>
        No position found on {params.walletAddress} on the network {parsedNetwork}
      </Text>
    )
  }

  const interestRates = await getInterestRates({
    network: parsedNetwork,
    arksList: vault.arks,
  })

  const [positionHistory, positionForecastResponse] = await Promise.all([
    await getPositionHistory({
      network: parsedNetwork,
      address: params.walletAddress.toLowerCase(),
      vault,
    }),
    await fetchForecastData({
      fleetAddress: vault.id as `0x${string}`,
      chainId: Number(parsedNetworkId),
      amount: Number(position.amount.amount),
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
      viewWalletAddress={params.walletAddress}
      userActivity={userActivity}
      topDepositors={topDepositors}
    />
  )
}

export default EarnVaultManagePage
