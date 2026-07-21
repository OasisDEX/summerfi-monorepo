'use client'

import {
  type GetVaultsApyResponse,
  type RewardTokenPrices,
  type SDKVaultsListType,
} from '@summerfi/app-types'
import { type IArmadaVaultInfo } from '@summerfi/sdk-common'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  getVaultsListAdditionalDataQueryKey,
  getVaultsListRouteQueryKey,
} from '@/components/layout/VaultsListView/vaults-list-query-keys'

export type VaultsListRouteResponse = {
  vaultsList: SDKVaultsListType
  filteredWalletAssetsVaults: SDKVaultsListType
  vaultsApyByNetworkMap?: GetVaultsApyResponse
  vaultsInfo?: IArmadaVaultInfo[]
  // `<chainId>-<vaultAddressLowercase>` -> on-chain paused() state (missing key = not paused)
  vaultsPausedMap?: { [key: string]: boolean }
}

type VaultsListAdditionalDataResponse = {
  sumrPriceUsd: number
  rewardTokenPrices: RewardTokenPrices
  tvl: number
  instantLiquidity: number
  protocolsList: {
    topProtocols: string[]
    allVaultsProtocols: string[]
  }
}

export type VaultsListResponse = VaultsListRouteResponse &
  VaultsListAdditionalDataResponse & {
    vaultsApyByNetworkMap: GetVaultsApyResponse
  }

export const fetchVaultsListRoute = async (
  walletAddress?: string,
): Promise<VaultsListRouteResponse> => {
  const endpoint = 'defi-vaults-list'
  const qs = walletAddress ? `?walletAddress=${encodeURIComponent(walletAddress)}` : ''
  const response = await fetch(`/earn/api/${endpoint}${qs}`)

  if (!response.ok) {
    throw new Error(`${endpoint} ${response.status}`)
  }

  return response.json() as Promise<VaultsListRouteResponse>
}

export const fetchVaultsListAdditionalData =
  async (): Promise<VaultsListAdditionalDataResponse> => {
    const response = await fetch('/earn/api/vaults-list-additional-data')

    if (!response.ok) {
      throw new Error(`vaults-list-additional-data ${response.status}`)
    }

    return response.json() as Promise<VaultsListAdditionalDataResponse>
  }

const sharedQueryOptions = {
  staleTime: 60_000,
  gcTime: 5 * 60_000,
  retry: 1,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
} as const

export const useVaultsListQuery = (walletAddress?: string) => {
  const listQuery = useQuery({
    queryKey: getVaultsListRouteQueryKey(walletAddress),
    queryFn: () => fetchVaultsListRoute(walletAddress),
    ...sharedQueryOptions,
    placeholderData: keepPreviousData,
  })

  const additionalDataQuery = useQuery({
    queryKey: getVaultsListAdditionalDataQueryKey(),
    queryFn: fetchVaultsListAdditionalData,
    ...sharedQueryOptions,
  })

  const data: VaultsListResponse | undefined =
    listQuery.data && additionalDataQuery.data
      ? {
          ...listQuery.data,
          ...additionalDataQuery.data,
          vaultsApyByNetworkMap:
            listQuery.data.vaultsApyByNetworkMap ?? ({} as GetVaultsApyResponse),
        }
      : undefined

  return {
    data,
    isFetching: listQuery.isFetching || additionalDataQuery.isFetching,
    isPlaceholderData: listQuery.isPlaceholderData || additionalDataQuery.isPlaceholderData,
  }
}
