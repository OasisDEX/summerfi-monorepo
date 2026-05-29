import { type SupportedSDKNetworks } from '@summerfi/app-types'

import { CACHE_TAGS } from '@/constants/revalidation'

// Kept in a non-client module so the server-side prefetch (page.tsx) and the client hook can
// share the exact same query keys. Both keys lead with the VAULTS_LIST tag so the existing
// refresh helpers refetch them, and a discriminator separates the two units.
const VAULT_DETAILS_CORE = 'vault-details-core'
const VAULT_DETAILS_CONTENT = 'vault-details-content'

export const getVaultDetailsCoreQueryKey = (network: SupportedSDKNetworks, vaultId: string) =>
  [CACHE_TAGS.VAULTS_LIST, VAULT_DETAILS_CORE, network, vaultId.toLowerCase()] as const

export const getVaultDetailsContentQueryKey = (network: SupportedSDKNetworks, vaultId: string) =>
  [CACHE_TAGS.VAULTS_LIST, VAULT_DETAILS_CONTENT, network, vaultId.toLowerCase()] as const
