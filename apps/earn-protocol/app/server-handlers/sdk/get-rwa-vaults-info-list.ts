import { getChainInfoByChainId, type IRwaVaultInfo } from '@summerfi/sdk-common'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getBackendInstiSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { rwaSupportedChainIds } from '@/app/server-handlers/subgraphs-map'
import { getRwaClientIdsForChain, isVaultDisabled } from '@/helpers/vault-custom-value-helpers'

export const getRwaVaultsInfoListRaw = async () => {
  const systemConfig = await getCachedConfig()

  // Supported RWA networks come from rwaSubgraphsMap; the institutions per network are derived from
  // the fleet config's `vaultInstitutionId`. Each (network, institution) is fetched independently and
  // degrades to an empty list so one failing/empty pair never takes down the whole info list.
  const vaultsListByChainAndClient = await Promise.all(
    rwaSupportedChainIds.flatMap((chainId) =>
      getRwaClientIdsForChain(chainId, systemConfig).map((clientId) =>
        getBackendInstiSDK(clientId)
          .rwa.getVaultInfoListPerChain({
            chainId: getChainInfoByChainId(chainId).chainId,
            clientId,
          })
          // Drop vaults flagged `disabled: true` in config (an active institution can still own
          // hidden/unused vaults the subgraph returns alongside the live ones).
          .then(({ list }) =>
            list.filter(
              (vaultInfo) =>
                !isVaultDisabled(vaultInfo.id.fleetAddress.value, chainId, systemConfig),
            ),
          )
          .catch((error: unknown) => {
            // eslint-disable-next-line no-console
            console.error(
              `getRwaVaultsInfoListRaw failed for chainId ${chainId} clientId ${clientId}`,
              error,
            )

            return [] as IRwaVaultInfo[]
          }),
      ),
    ),
  )

  return {
    vaults: vaultsListByChainAndClient.flat(),
    callDataTimestamp: Date.now(),
  }
}
