import { sdkSupportedChains } from '@summerfi/app-types'
import { simpleSort, SortDirection } from '@summerfi/app-utils'
import { getChainInfoByChainId } from '@summerfi/sdk-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export const getGlobalRebalances = async () => {
  const rebalancesByNetwork = await Promise.all(
    sdkSupportedChains.map((networkId) => {
      const chainInfo = getChainInfoByChainId(networkId)

      return backendSDK.armada.users.getGlobalRebalancesRaw({
        chainInfo,
      })
    }),
  )

  // flatten the list
  const rebalancesList = rebalancesByNetwork
    .reduce<(typeof rebalancesByNetwork)[number]['rebalances']>(
      (acc, { rebalances }) => [...acc, ...rebalances],
      [],
    )
    // initially sorted by timestamp since it combines data from independent subgraphs
    .sort((a, b) => simpleSort({ a: a.timestamp, b: b.timestamp, direction: SortDirection.DESC }))

  return {
    rebalances: rebalancesList,
    callDataTimestamp: Date.now(),
  }
}
