'use client'

import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { useQuery } from '@tanstack/react-query'

import { type VaultOpenCoreData } from '@/app/server-handlers/vault-open/get-vault-open-core-data'
import { type VaultOpenDetailsData } from '@/app/server-handlers/vault-open/get-vault-open-details-data'
import {
  getVaultOpenCoreQueryKey,
  getVaultOpenDetailsQueryKey,
} from '@/components/layout/VaultOpenView/vault-open-query-keys'

export type VaultOpenCoreResponse = VaultOpenCoreData
export type VaultOpenDetailsResponse = VaultOpenDetailsData

const encodeSegment = (value: string) => encodeURIComponent(value)

export const fetchVaultOpenCore = async (
  network: SupportedSDKNetworks,
  vaultId: string,
): Promise<VaultOpenCoreResponse | null> => {
  const response = await fetch(
    `/earn/api/vault-open/${encodeSegment(network)}/${encodeSegment(vaultId)}`,
  )

  if (!response.ok) {
    throw new Error(`vault-open ${response.status}`)
  }

  return response.json() as Promise<VaultOpenCoreResponse | null>
}

export const fetchVaultOpenDetails = async (
  network: SupportedSDKNetworks,
  vaultId: string,
): Promise<VaultOpenDetailsResponse | null> => {
  const response = await fetch(
    `/earn/api/vault-open-details/${encodeSegment(network)}/${encodeSegment(vaultId)}`,
  )

  if (!response.ok) {
    throw new Error(`vault-open-details ${response.status}`)
  }

  return response.json() as Promise<VaultOpenDetailsResponse | null>
}

const sharedQueryOptions = {
  staleTime: 60_000,
  gcTime: 5 * 60_000,
  retry: 1,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
} as const

export const useVaultOpenCoreQuery = (network: SupportedSDKNetworks, vaultId: string) =>
  useQuery({
    queryKey: getVaultOpenCoreQueryKey(network, vaultId),
    queryFn: () => fetchVaultOpenCore(network, vaultId),
    ...sharedQueryOptions,
  })

export const useVaultOpenDetailsQuery = (network: SupportedSDKNetworks, vaultId: string) =>
  useQuery({
    queryKey: getVaultOpenDetailsQueryKey(network, vaultId),
    queryFn: () => fetchVaultOpenDetails(network, vaultId),
    ...sharedQueryOptions,
  })
