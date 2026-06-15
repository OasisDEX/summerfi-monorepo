import { getChainInfoByChainId } from '@summerfi/sdk-common'

import { backendInstiSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { rwaSupportedChainIds } from '@/app/server-handlers/subgraphs-map'
import { RWA_CLIENT_ID } from '@/constants/rwa'

export const getRwaVaultsInfoListRaw = async () => {
  // Supported RWA networks are derived from rwaSubgraphsMap; each is fetched independently and
  // degrades to an empty list so one failing/empty network never takes down the whole info list.
  const vaultsListByNetwork = await Promise.all(
    rwaSupportedChainIds.map((chainId) =>
      backendInstiSDK.rwa
        .getVaultInfoListPerChain({
          chainId: getChainInfoByChainId(chainId).chainId,
          clientId: RWA_CLIENT_ID,
        })
        .catch((error: unknown) => {
          // eslint-disable-next-line no-console
          console.error(`getRwaVaultsInfoListRaw failed for chainId ${chainId}`, error)

          return { list: [] }
        }),
    ),
  )

  return {
    vaults: vaultsListByNetwork.flatMap(({ list }) => list),
    callDataTimestamp: Date.now(),
  }
}
