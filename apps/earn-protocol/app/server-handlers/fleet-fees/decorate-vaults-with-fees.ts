import { type SDKVaultishType } from '@summerfi/app-types'
import { subgraphNetworkToId, supportedSDKNetwork } from '@summerfi/app-utils'

import { getCachedFleetCommanderFees } from '@/app/server-handlers/cached/get-fleet-fees'

/**
 * Attaches the on-chain fleet fee rates (`managementFee` from `tipRate`, `performanceFee` from
 * `performanceFeeRate`) to each vault so every downstream UI can read them off the vault object
 * instead of guessing from the input token symbol.
 *
 * Each vault's fees are fetched through the per-vault 3h cache, so calling this across a full list
 * is cheap once warm. `managementFee` is normalised to `undefined` when unreadable so consumers can
 * fall back to the legacy token-symbol heuristic.
 */
export const decorateVaultsWithFees = <T extends SDKVaultishType>(vaults: T[]): Promise<T[]> =>
  Promise.all(
    vaults.map(async (vault) => {
      const chainId = subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))

      const { managementFee, performanceFee } = await getCachedFleetCommanderFees({
        fleetAddress: vault.id,
        chainId,
      })

      return {
        ...vault,
        managementFee: managementFee ?? undefined,
        performanceFee,
      }
    }),
  )
