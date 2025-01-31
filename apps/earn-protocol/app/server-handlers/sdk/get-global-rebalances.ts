import { sdkSupportedChains } from '@summerfi/app-types'
import { simpleSort, SortDirection } from '@summerfi/app-utils'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import { unstable_cache as unstableCache } from 'next/cache'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { REVALIDATION_TIMES } from '@/constants/revalidations'

export const getGlobalRebalances = unstableCache(
  async () => {
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
  },
  [],
  {
    revalidate: REVALIDATION_TIMES.PORTFOLIO_DATA,
  },
)
