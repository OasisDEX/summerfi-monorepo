import { CACHE_TAGS } from '@/constants/revalidation'

// Kept in a non-client module so the server-side prefetch (page.tsx) and the client hook can
// share the exact same query keys. Importing these from the 'use client' hook into a server
// component would turn them into uncallable client references.

// The additional-data query is independent of the active tab and wallet, so it uses a constant
// key suffix. Both keys share the leading VAULTS_LIST tag so a manual refresh refetches them
// together (see useRevalidateVaultsListData).
export const ADDITIONAL_DATA_QUERY_KEY = 'additional-data'

export const getVaultsListRouteQueryKey = (walletAddress?: string, vaultsFilter?: string) =>
  [CACHE_TAGS.VAULTS_LIST, vaultsFilter ?? '', walletAddress?.toLowerCase() ?? ''] as const

export const getVaultsListAdditionalDataQueryKey = () =>
  [CACHE_TAGS.VAULTS_LIST, ADDITIONAL_DATA_QUERY_KEY] as const
