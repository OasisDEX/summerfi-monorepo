import { getChainInfoByChainId } from '@summerfi/sdk-common'
import { type GetVaultsQueryRwa } from '@summerfi/subgraph-manager-common'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getBackendInstiSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { rwaSupportedChainIds } from '@/app/server-handlers/subgraphs-map'
import { getRwaClientIdsForChain, isVaultDisabled } from '@/helpers/vault-custom-value-helpers'

export const getRwaVaultsListRaw: () => Promise<{
  vaults: GetVaultsQueryRwa['vaults']
  callDataTimestamp: number
}> = async () => {
  const systemConfig = await getCachedConfig()

  // Supported RWA networks come from rwaSubgraphsMap; the institutions per network are derived from
  // the fleet config's `vaultInstitutionId` (single source of truth). Each (network, institution) is
  // fetched independently and degrades to an empty list, so one failing/empty pair never takes down
  // the whole RWA list.
  const vaultsListByChainAndClient = await Promise.all(
    rwaSupportedChainIds.flatMap((chainId) =>
      getRwaClientIdsForChain(chainId, systemConfig).map((clientId) =>
        getBackendInstiSDK(clientId)
          .rwa.getVaultsRaw({
            chainInfo: getChainInfoByChainId(chainId),
            clientId,
          })
          // An active institution can still own vaults flagged `disabled: true` in config (hidden/
          // unused), which the subgraph returns alongside the live ones — drop them here so they
          // never enter the data pipeline.
          .then(({ vaults }) =>
            vaults.filter((vault) => !isVaultDisabled(vault.id, chainId, systemConfig)),
          )
          .catch((error: unknown) => {
            // eslint-disable-next-line no-console
            console.error(
              `getRwaVaultsListRaw failed for chainId ${chainId} clientId ${clientId}`,
              error,
            )

            return [] as GetVaultsQueryRwa['vaults']
          }),
      ),
    ),
  )

  return {
    vaults: vaultsListByChainAndClient.flat(),
    callDataTimestamp: Date.now(),
  }
}
