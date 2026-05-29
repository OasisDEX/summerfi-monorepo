'use client'

import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { useQuery } from '@tanstack/react-query'

import { type VaultDetailsContentData } from '@/app/server-handlers/vault-details/get-vault-details-content-data'
import { type VaultDetailsCoreData } from '@/app/server-handlers/vault-details/get-vault-details-core-data'
import {
  getVaultDetailsContentQueryKey,
  getVaultDetailsCoreQueryKey,
} from '@/components/layout/VaultDetailsView/vault-details-query-keys'

export type VaultDetailsCoreResponse = VaultDetailsCoreData
export type VaultDetailsContentResponse = VaultDetailsContentData

const encodeSegment = (value: string) => encodeURIComponent(value)

const buildPath = (base: string, network: string, vaultId: string) =>
  `/earn/api/${base}/${encodeSegment(network)}/${encodeSegment(vaultId)}`

export const fetchVaultDetailsCore = async (
  network: SupportedSDKNetworks,
  vaultId: string,
): Promise<VaultDetailsCoreResponse | null> => {
  const response = await fetch(buildPath('vault-details', network, vaultId))

  if (!response.ok) {
    throw new Error(`vault-details ${response.status}`)
  }

  return response.json() as Promise<VaultDetailsCoreResponse | null>
}

export const fetchVaultDetailsContent = async (
  network: SupportedSDKNetworks,
  vaultId: string,
): Promise<VaultDetailsContentResponse | null> => {
  const response = await fetch(buildPath('vault-details-content', network, vaultId))

  if (!response.ok) {
    throw new Error(`vault-details-content ${response.status}`)
  }

  return response.json() as Promise<VaultDetailsContentResponse | null>
}

const sharedQueryOptions = {
  staleTime: 60_000,
  gcTime: 5 * 60_000,
  retry: 1,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
} as const

export const useVaultDetailsCoreQuery = (network: SupportedSDKNetworks, vaultId: string) =>
  useQuery({
    queryKey: getVaultDetailsCoreQueryKey(network, vaultId),
    queryFn: () => fetchVaultDetailsCore(network, vaultId),
    ...sharedQueryOptions,
  })

export const useVaultDetailsContentQuery = (network: SupportedSDKNetworks, vaultId: string) =>
  useQuery({
    queryKey: getVaultDetailsContentQueryKey(network, vaultId),
    queryFn: () => fetchVaultDetailsContent(network, vaultId),
    ...sharedQueryOptions,
  })
