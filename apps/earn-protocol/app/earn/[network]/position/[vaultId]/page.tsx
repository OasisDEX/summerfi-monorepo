import { Text } from '@summerfi/app-earn-ui'
import { type PositionForecastAPIResponse, type SDKNetwork } from '@summerfi/app-types'
import {
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  subgraphNetworkToId,
} from '@summerfi/app-utils'
import { isAddress } from 'viem'

import { getInterestRates } from '@/app/server-handlers/interest-rates'
import { getUserActivity } from '@/app/server-handlers/sdk/get-user-activity'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { VaultOpenView } from '@/components/layout/VaultOpenView/VaultOpenView'
import { fetchForecastData } from '@/features/forecast/fetch-forecast-data'
import { parseForecastDatapoints } from '@/features/forecast/parse-forecast-datapoints'
import {
  decorateCustomVaultFields,
  getVaultIdByVaultCustomName,
} from '@/helpers/vault-custom-value-helpers'

type EarnVaultOpenPageProps = {
  params: {
    vaultId: string // could be vault address or the vault name
    network: SDKNetwork
  }
}

export const revalidate = 60

const EarnVaultOpenPage = async ({ params }: EarnVaultOpenPageProps) => {
  const parsedNetwork = humanNetworktoSDKNetwork(params.network)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const { config } = parseServerResponseToClient(await systemConfigHandler())

  const parsedVaultId = isAddress(params.vaultId)
    ? params.vaultId
    : getVaultIdByVaultCustomName(params.vaultId, String(parsedNetworkId), config)

  const [vault, { vaults }, { userActivity, topDepositors }, forecastData] = await Promise.all([
    getVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
    getVaultsList(),
    getUserActivity({ vaultAddress: parsedVaultId, network: parsedNetwork }),
    fetchForecastData({
      fleetAddress: parsedVaultId as `0x${string}`,
      amount: 100, // rule of thumb value
      chainId: subgraphNetworkToId(parsedNetwork),
    }).then(async (data) => (await data.json()) as PositionForecastAPIResponse),
  ])

  const interestRates = vault?.arks
    ? await getInterestRates({
        network: parsedNetwork,
        arksList: vault.arks,
      })
    : {}

  const [vaultDecorated] = vault ? decorateCustomVaultFields([vault], config, interestRates) : []
  const vaultsDecorated = decorateCustomVaultFields(vaults, config)

  if (!vault) {
    return (
      <Text>
        No vault found with the id {parsedVaultId} on the network {parsedNetwork}
      </Text>
    )
  }

  return (
    <VaultOpenView
      vault={vaultDecorated}
      vaults={vaultsDecorated}
      userActivity={userActivity}
      topDepositors={topDepositors}
      preloadedForecast={parseForecastDatapoints(forecastData)}
    />
  )
}

export default EarnVaultOpenPage
