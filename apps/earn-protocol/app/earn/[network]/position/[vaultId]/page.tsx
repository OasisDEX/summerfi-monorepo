import { Text } from '@summerfi/app-earn-ui'
import {
  humanNetworktoSDKNetwork,
  type PositionForecastAPIResponse,
  type SDKNetwork,
} from '@summerfi/app-types'

import { getUserActivity } from '@/app/server-handlers/sdk/get-user-activity'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { VaultOpenView } from '@/components/layout/VaultOpenView/VaultOpenView'
import { fetchForecastData } from '@/features/forecast/fetch-forecast-data'
import { parseForecastDatapoints } from '@/features/forecast/parse-forecast-datapoints'
import { subgraphNetworkToId } from '@/helpers/network-helpers'

type EarnVaultOpenPageProps = {
  params: {
    vaultId: string
    network: SDKNetwork
  }
}

export const revalidate = 60

const EarnVaultOpenPage = async ({ params }: EarnVaultOpenPageProps) => {
  const parsedNetwork = humanNetworktoSDKNetwork(params.network)
  const [vault, { vaults }, { userActivity, topDepositors }, forecastData] = await Promise.all([
    getVaultDetails({
      vaultAddress: params.vaultId,
      network: parsedNetwork,
    }),
    getVaultsList(),
    getUserActivity({ vaultAddress: params.vaultId, network: parsedNetwork }),
    fetchForecastData({
      fleetAddress: params.vaultId as `0x${string}`,
      amount: 100, // rule of thumb value
      chainId: subgraphNetworkToId(parsedNetwork),
    }).then(async (data) => (await data.json()) as PositionForecastAPIResponse),
  ])

  if (!vault) {
    return (
      <Text>
        No vault found with the id {params.vaultId} on the network {parsedNetwork}
      </Text>
    )
  }

  return (
    <VaultOpenView
      vault={vault}
      vaults={vaults}
      userActivity={userActivity}
      topDepositors={topDepositors}
      preloadedForecast={parseForecastDatapoints(forecastData)}
    />
  )
}

export default EarnVaultOpenPage
