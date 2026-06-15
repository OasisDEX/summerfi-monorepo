import { type SupportedSDKNetworks } from '@summerfi/app-types'

import { type VaultManageSection } from '@/app/server-handlers/vault-manage/get-vault-manage-section-data'
import { CACHE_TAGS } from '@/constants/revalidation'

// Kept in a non-client module so the server-side prefetch (page.tsx) and the client hooks can
// share the exact same query keys. Keys lead with the VAULTS_LIST tag so the existing refresh
// helpers (useRevalidatePositionData) refetch them, and a discriminator separates the units.
const VAULT_MANAGE_CORE = 'vault-manage-core'
const VAULT_MANAGE_SECTION = 'vault-manage-section'
const RWA_RECEIPTS_HISTORY = 'rwa-receipts-history'

export const getVaultManageCoreQueryKey = (
  network: SupportedSDKNetworks,
  vaultId: string,
  walletAddress: string,
) =>
  [
    CACHE_TAGS.VAULTS_LIST,
    VAULT_MANAGE_CORE,
    network,
    vaultId.toLowerCase(),
    walletAddress.toLowerCase(),
  ] as const

export const getVaultManageSectionQueryKey = (
  section: VaultManageSection,
  network: SupportedSDKNetworks,
  vaultId: string,
  walletAddress: string,
) =>
  [
    CACHE_TAGS.VAULTS_LIST,
    VAULT_MANAGE_SECTION,
    section,
    network,
    vaultId.toLowerCase(),
    walletAddress.toLowerCase(),
  ] as const

// Prefix shared by both sides' infinite-query keys — invalidate this to refresh the whole RWA
// deposits/withdrawals history (e.g. after a claim/cancel/deposit).
export const getRwaReceiptsHistoryBaseQueryKey = (
  network: SupportedSDKNetworks,
  vaultId: string,
  walletAddress: string,
) =>
  [
    CACHE_TAGS.VAULTS_LIST,
    RWA_RECEIPTS_HISTORY,
    network,
    vaultId.toLowerCase(),
    walletAddress.toLowerCase(),
  ] as const

export const getRwaReceiptsHistoryQueryKey = (
  network: SupportedSDKNetworks,
  vaultId: string,
  walletAddress: string,
  side: 'deposit' | 'withdrawal',
) => [...getRwaReceiptsHistoryBaseQueryKey(network, vaultId, walletAddress), side] as const
