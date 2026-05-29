import {
  type SDKVaultsListType,
  type SDKVaultType,
  type SupportedSDKNetworks,
} from '@summerfi/app-types'

import { resolveVaultDetailsContext } from '@/app/server-handlers/vault-details/resolve-vault-details-context'

export type VaultDetailsCoreData = {
  vault: SDKVaultType
  vaults: SDKVaultsListType
}

// Above-the-fold data the VaultGridDetails shell (title, vault switcher, layout) needs to paint.
// Shared by the /api/vault-details route and the server-side prefetch in the page, so the data has
// a single source of truth and the client renders straight from the hydrated cache.
export const getVaultDetailsCoreData = async ({
  network,
  vaultId,
}: {
  network: SupportedSDKNetworks
  vaultId: string
}): Promise<VaultDetailsCoreData | null> => {
  const ctx = await resolveVaultDetailsContext({ network, vaultId })

  if (!ctx.vaultWithConfig) {
    return null
  }

  return {
    vault: ctx.vaultWithConfig,
    vaults: ctx.allVaultsWithConfig,
  }
}
