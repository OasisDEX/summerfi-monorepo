/* eslint-disable camelcase */
import { sdkSupportedChains } from '@summerfi/app-types'
import { sdkIdToSubgraphNetwork, simpleSort, type SortDirection } from '@summerfi/app-utils'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import { OrderDirection, Rebalance_OrderBy as OrderBy } from '@summerfi/subgraph-manager-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export const getGlobalRebalances = async ({
  first = 10,
  skip = 0,
  orderBy = OrderBy.Timestamp,
  orderDirection = OrderDirection.Desc,
  tokenSymbols,
  strategy,
  protocol,
}: {
  first?: number
  skip?: number
  orderBy?: OrderBy.AmountUsd | OrderBy.Timestamp
  orderDirection?: OrderDirection
  tokenSymbols?: string[]
  strategy?: string[]
  protocol?: string[]
}) => {
  const rebalancesByNetwork = await Promise.all(
    sdkSupportedChains.map((networkId) => {
      const chainInfo = getChainInfoByChainId(networkId)

      const subgraphNetwork = sdkIdToSubgraphNetwork(networkId)

      const resolvedStrategy = strategy
        ?.filter((item) => item.split('-')[1] === subgraphNetwork)
        .map((item) => item.split('-')[0].toLowerCase())

      const resolvedProtocol = protocol?.map((item) =>
        item.includes('Buffer') ? item : `${item}-${networkId}`,
      )

      const resolvedWhere = {
        ...(tokenSymbols ? { asset_: { symbol_in: tokenSymbols } } : {}),
        ...(strategy ? { vault_: { id_in: resolvedStrategy } } : {}),
        ...(protocol
          ? {
              or: [
                { from_: { name_in: resolvedProtocol } },
                { to_: { name_in: resolvedProtocol } },
              ],
            }
          : {}),
      }

      return backendSDK.armada.users.getGlobalRebalancesRaw({
        chainInfo,
        first,
        skip,
        orderBy,
        orderDirection,
        where: resolvedWhere,
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
    .sort((a, b) =>
      simpleSort({
        a: a[orderBy],
        b: b[orderBy],
        direction: orderDirection.toUpperCase() as SortDirection,
      }),
    )

  return {
    rebalances: rebalancesList,
    callDataTimestamp: Date.now(),
  }
}
