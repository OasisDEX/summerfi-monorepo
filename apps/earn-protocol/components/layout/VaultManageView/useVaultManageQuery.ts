'use client'

import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { useQuery } from '@tanstack/react-query'

import { type VaultManageCoreData } from '@/app/server-handlers/vault-manage/get-vault-manage-core-data'
import {
  type VaultManageCurationData,
  type VaultManageExposureData,
  type VaultManagePerformanceData,
  type VaultManageRebalancingData,
  type VaultManageSection,
  type VaultManageUserActivityData,
  type VaultManageYieldChartData,
} from '@/app/server-handlers/vault-manage/get-vault-manage-section-data'
import {
  getVaultManageCoreQueryKey,
  getVaultManageSectionQueryKey,
} from '@/components/layout/VaultManageView/vault-manage-query-keys'

export type VaultManageCoreResponse = VaultManageCoreData

const encodeSegment = (value: string) => encodeURIComponent(value)

export const fetchVaultManageCore = async (
  network: SupportedSDKNetworks,
  vaultId: string,
  walletAddress: string,
): Promise<VaultManageCoreResponse | null> => {
  const response = await fetch(
    `/earn/api/vault-manage/${encodeSegment(network)}/${encodeSegment(vaultId)}/${encodeSegment(walletAddress)}`,
  )

  if (!response.ok) {
    throw new Error(`vault-manage ${response.status}`)
  }

  return response.json() as Promise<VaultManageCoreResponse | null>
}

const fetchVaultManageSection = async <T>(
  section: VaultManageSection,
  network: SupportedSDKNetworks,
  vaultId: string,
  walletAddress: string,
): Promise<T | null> => {
  const response = await fetch(
    `/earn/api/vault-manage-section/${encodeSegment(network)}/${encodeSegment(vaultId)}/${encodeSegment(walletAddress)}/${section}`,
  )

  if (!response.ok) {
    throw new Error(`vault-manage-section/${section} ${response.status}`)
  }

  return response.json() as Promise<T | null>
}

const sharedQueryOptions = {
  staleTime: 60_000,
  gcTime: 5 * 60_000,
  retry: 1,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
} as const

export const useVaultManageCoreQuery = (
  network: SupportedSDKNetworks,
  vaultId: string,
  walletAddress: string,
) =>
  useQuery({
    queryKey: getVaultManageCoreQueryKey(network, vaultId, walletAddress),
    queryFn: () => fetchVaultManageCore(network, vaultId, walletAddress),
    ...sharedQueryOptions,
  })

// One hook per lazily-loaded expander section. `enabled` is wired to whether the expander is open,
// so the data is only fetched once the user reveals it (and then cached across collapse/expand).
const useVaultManageSectionQuery = <T>(
  section: VaultManageSection,
  network: SupportedSDKNetworks,
  vaultId: string,
  walletAddress: string,
  enabled: boolean,
) =>
  useQuery({
    queryKey: getVaultManageSectionQueryKey(section, network, vaultId, walletAddress),
    queryFn: () => fetchVaultManageSection<T>(section, network, vaultId, walletAddress),
    enabled,
    ...sharedQueryOptions,
  })

export const useVaultManagePerformanceQuery = (
  network: SupportedSDKNetworks,
  vaultId: string,
  walletAddress: string,
  enabled: boolean,
) =>
  useVaultManageSectionQuery<VaultManagePerformanceData>(
    'performance',
    network,
    vaultId,
    walletAddress,
    enabled,
  )

export const useVaultManageYieldChartQuery = (
  network: SupportedSDKNetworks,
  vaultId: string,
  walletAddress: string,
  enabled: boolean,
) =>
  useVaultManageSectionQuery<VaultManageYieldChartData>(
    'yield-chart',
    network,
    vaultId,
    walletAddress,
    enabled,
  )

export const useVaultManageExposureQuery = (
  network: SupportedSDKNetworks,
  vaultId: string,
  walletAddress: string,
  enabled: boolean,
) =>
  useVaultManageSectionQuery<VaultManageExposureData>(
    'exposure',
    network,
    vaultId,
    walletAddress,
    enabled,
  )

export const useVaultManageRebalancingQuery = (
  network: SupportedSDKNetworks,
  vaultId: string,
  walletAddress: string,
  enabled: boolean,
) =>
  useVaultManageSectionQuery<VaultManageRebalancingData>(
    'rebalancing',
    network,
    vaultId,
    walletAddress,
    enabled,
  )

export const useVaultManageCurationQuery = (
  network: SupportedSDKNetworks,
  vaultId: string,
  walletAddress: string,
  enabled: boolean,
) =>
  useVaultManageSectionQuery<VaultManageCurationData>(
    'curation',
    network,
    vaultId,
    walletAddress,
    enabled,
  )

export const useVaultManageUserActivityQuery = (
  network: SupportedSDKNetworks,
  vaultId: string,
  walletAddress: string,
  enabled: boolean,
) =>
  useVaultManageSectionQuery<VaultManageUserActivityData>(
    'user-activity',
    network,
    vaultId,
    walletAddress,
    enabled,
  )
