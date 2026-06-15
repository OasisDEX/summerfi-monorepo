import { getChainInfoByChainId } from '@summerfi/sdk-common'
import { type GetVaultsQueryRwa } from '@summerfi/subgraph-manager-common'

import { backendInstiSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { rwaSupportedChainIds } from '@/app/server-handlers/subgraphs-map'
import { RWA_CLIENT_ID } from '@/constants/rwa'

export const getRwaVaultsListRaw: () => Promise<{
  vaults: GetVaultsQueryRwa['vaults']
  callDataTimestamp: number
}> = async () => {
  // Supported RWA networks are derived from rwaSubgraphsMap. Each network is fetched independently
  // and degrades to an empty list, so one network (e.g. a newly-enabled Mainnet) failing or having
  // no vaults never takes down the whole RWA list.
  const vaultsListByNetwork = await Promise.all(
    rwaSupportedChainIds.map((chainId) =>
      backendInstiSDK.rwa
        .getVaultsRaw({
          chainInfo: getChainInfoByChainId(chainId),
          clientId: RWA_CLIENT_ID,
        })
        .catch((error: unknown) => {
          // eslint-disable-next-line no-console
          console.error(`getRwaVaultsListRaw failed for chainId ${chainId}`, error)

          return { vaults: [] as GetVaultsQueryRwa['vaults'] }
        }),
    ),
  )

  return {
    vaults: vaultsListByNetwork.flatMap(({ vaults }) => vaults),
    callDataTimestamp: Date.now(),
  }
}
