import { sdkSupportedChains } from '@summerfi/app-types'
import { simpleSort, SortDirection } from '@summerfi/app-utils'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import { OrderDirection, Rebalance_OrderBy as OrderBy } from '@summerfi/subgraph-manager-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export const getGlobalRebalances = async ({
  first = 10,
  skip = 0,
  orderBy = OrderBy.Timestamp,
  orderDirection = OrderDirection.Desc,
}: {
  first?: number
  skip?: number
  orderBy?: OrderBy
  orderDirection?: OrderDirection
}) => {
  const rebalancesByNetwork = await Promise.all(
    sdkSupportedChains.map((networkId) => {
      const chainInfo = getChainInfoByChainId(networkId)

      return backendSDK.armada.users.getGlobalRebalancesRaw({
        chainInfo,
        first,
        skip,
        orderBy,
        orderDirection,
      })
    }),
  )

  // flatten the list
  const rebalancesList = rebalancesByNetwork
    .reduce<(typeof rebalancesByNetwork)[number]['rebalances']>(
      (acc, { rebalances }) => [...acc, ...rebalances],
      [],
    )
    // additional sorting by timestamp since it combines data from independent subgraphs
    .sort((a, b) => simpleSort({ a: a.timestamp, b: b.timestamp, direction: SortDirection.DESC }))

  return {
    rebalances: rebalancesList,
    callDataTimestamp: Date.now(),
  }
}
