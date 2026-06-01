import { type SupportedSDKNetworks } from '@summerfi/app-types'

import { CACHE_TAGS } from '@/constants/revalidation'

// Kept in a non-client module so the server-side prefetch (page.tsx) and the client hook can
// share the exact same query keys. Both keys lead with the VAULTS_LIST tag so the existing
// refresh helpers (useRevalidateVaultsListData / useRevalidatePositionData) refetch them, and a
// discriminator separates the two units.
const VAULT_OPEN_CORE = 'vault-open-core'
const VAULT_OPEN_DETAILS = 'vault-open-details'

export const getVaultOpenCoreQueryKey = (network: SupportedSDKNetworks, vaultId: string) =>
  [CACHE_TAGS.VAULTS_LIST, VAULT_OPEN_CORE, network, vaultId.toLowerCase()] as const

export const getVaultOpenDetailsQueryKey = (network: SupportedSDKNetworks, vaultId: string) =>
  [CACHE_TAGS.VAULTS_LIST, VAULT_OPEN_DETAILS, network, vaultId.toLowerCase()] as const
