import { sdkSupportedNetworks } from '@summerfi/app-types'
import { getChainInfoByChainId } from '@summerfi/sdk-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export async function getRebalances() {
  const rebalancesByNetwork = await Promise.all(
    sdkSupportedNetworks.map((networkId) => {
      const chainInfo = getChainInfoByChainId(networkId)

      return backendSDK.armada.users.getRebalancesRaw({
        chainInfo,
      })
    }),
  )

  // flatten the list
  const rebalancesList = rebalancesByNetwork.reduce<
    (typeof rebalancesByNetwork)[number]['rebalances']
  >((acc, { rebalances }) => [...acc, ...rebalances], [])

  return {
    rebalances: rebalancesList,
    callDataTimestamp: Date.now(),
  }
}
