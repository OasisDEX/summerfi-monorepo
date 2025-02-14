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
  tokenSymbols,
}: {
  first?: number
  skip?: number
  orderBy?: OrderBy
  orderDirection?: OrderDirection
  tokenSymbols?: string[]
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
        // eslint-disable-next-line camelcase
        where: tokenSymbols ? { asset_: { symbol_in: tokenSymbols } } : {},
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
