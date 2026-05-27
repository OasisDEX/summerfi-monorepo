'use client'

import { useCallback, useMemo } from 'react'
import { getRewardsTokenBonus, getUniqueVaultId } from '@summerfi/app-earn-ui'
import {
  type GetVaultsApyResponse,
  type RewardTokenPrices,
  type SDKVaultishType,
  type SDKVaultsListType,
} from '@summerfi/app-types'
import { findVaultInfo } from '@summerfi/app-utils'
import { type IArmadaVaultInfo } from '@summerfi/sdk-common'
import { type ReadonlyURLSearchParams } from 'next/navigation'

import { getVaultApySelector } from '@/components/layout/VaultsListView/get-vault-apy-selector'
import { type VaultMetricsMap, VaultsSorting } from '@/components/layout/VaultsListView/types'

export const useVaultsListFiltering = ({
  vaultsList,
  filteredWalletAssetsVaults,
  vaultsApyByNetworkMap,
  vaultsInfo,
  rewardTokenPrices,
  queryParams,
  daoManagedVaultsEnabled,
  rwaVaultsEnabled,
}: {
  vaultsList: SDKVaultsListType
  filteredWalletAssetsVaults: SDKVaultsListType
  vaultsApyByNetworkMap: GetVaultsApyResponse
  vaultsInfo?: IArmadaVaultInfo[]
  rewardTokenPrices: RewardTokenPrices
  queryParams: ReadonlyURLSearchParams
  daoManagedVaultsEnabled: boolean
  rwaVaultsEnabled: boolean
}) => {
  const filterNetworks = useMemo(() => queryParams.get('networks')?.split(',') ?? [], [queryParams])
  const filterAssets = useMemo(() => queryParams.get('assets')?.split(',') ?? [], [queryParams])
  const filterWallet = useMemo(() => queryParams.get('walletAddress') ?? '', [queryParams])
  const filterVaults = useMemo(() => queryParams.get('vaults')?.split(',') ?? [], [queryParams])
  const isPermissionedRwaTab = rwaVaultsEnabled && filterVaults.includes('permissioned-rwa-vaults')
  const sortingMethodId = useMemo(
    () => queryParams.get('sort') ?? VaultsSorting.HIGHEST_APY,
    [queryParams],
  )

  const vaultsFilteredByType = useMemo(() => {
    if (rwaVaultsEnabled) {
      return filterWallet ? filteredWalletAssetsVaults : vaultsList
    }

    if (!daoManagedVaultsEnabled) {
      return vaultsList
    }

    const vaultsListToUse = filterWallet ? filteredWalletAssetsVaults : vaultsList

    if (filterVaults.includes('dao-risk-managed')) {
      return vaultsListToUse.filter((vault) => {
        return vault.isDaoManaged
      })
    } else {
      return vaultsListToUse.filter((vault) => {
        return !vault.isDaoManaged
      })
    }
  }, [
    daoManagedVaultsEnabled,
    filterWallet,
    filteredWalletAssetsVaults,
    rwaVaultsEnabled,
    vaultsList,
    filterVaults,
  ])

  const filterAssetVaults = useCallback(
    (vault: (typeof vaultsList)[number]) => {
      const assetsFilterList = [...filterAssets.map((asset) => asset.toLowerCase())]

      if (assetsFilterList.includes('eth')) {
        assetsFilterList.push('weth')
      }
      if (assetsFilterList.includes('USDT'.toLowerCase())) {
        assetsFilterList.push('USD₮0'.toLowerCase())
      }

      const filtered = assetsFilterList.includes(vault.inputToken.symbol.toLowerCase())

      return filtered
    },
    [filterAssets],
  )

  const filterNetworkVaults = useCallback(
    ({ protocol }: (typeof vaultsList)[number]) => {
      const filtered = filterNetworks
        .map((network) => network.toLowerCase())
        .includes(protocol.network.toLowerCase())

      return filtered
    },
    [filterNetworks],
  )

  // Precompute apy + reward-token bonus per vault once, so the sort comparator (and the DAO
  // banner reduce) do O(1) lookups instead of recomputing getRewardsTokenBonus / findVaultInfo
  // for every comparison (which made sorting roughly O(n^2 log n)).
  const vaultMetricsMap = useMemo<VaultMetricsMap>(() => {
    const map: VaultMetricsMap = new Map()

    for (const vault of [...vaultsList, ...filteredWalletAssetsVaults]) {
      const uniqueId = getUniqueVaultId(vault)

      if (!map.has(uniqueId)) {
        const apyData = vaultsApyByNetworkMap[getVaultApySelector(vault)]
        const { rawTokenBonus } = getRewardsTokenBonus({
          merklRewards: findVaultInfo(vaultsInfo, vault)?.merklRewards,
          tokensPriceMap: rewardTokenPrices,
          totalValueLockedUSD: vault.totalValueLockedUSD,
        })

        map.set(uniqueId, {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          apy: apyData ? Number(apyData.apy) : 0,
          rawTokenBonus: Number(rawTokenBonus),
        })
      }
    }

    return map
  }, [vaultsList, filteredWalletAssetsVaults, vaultsApyByNetworkMap, vaultsInfo, rewardTokenPrices])

  const sortVaults = useCallback(
    (a: (typeof vaultsList)[number], b: (typeof vaultsList)[number]) => {
      if (sortingMethodId === VaultsSorting.HIGHEST_TVL) {
        return Number(a.totalValueLockedUSD) > Number(b.totalValueLockedUSD) ? -1 : 1
      }

      const aMetrics = vaultMetricsMap.get(getUniqueVaultId(a))
      const bMetrics = vaultMetricsMap.get(getUniqueVaultId(b))
      const aBonus = aMetrics?.rawTokenBonus ?? 0
      const bBonus = bMetrics?.rawTokenBonus ?? 0

      if (sortingMethodId === VaultsSorting.HIGHEST_REWARDS) {
        return aBonus > bBonus ? -1 : 1
      }

      // default sorting method which is VaultsSorting.HIGHEST_APY
      const aApy = aMetrics?.apy ?? 0
      const bApy = bMetrics?.apy ?? 0

      return aApy + aBonus > bApy + bBonus ? -1 : 1
    },
    [sortingMethodId, vaultMetricsMap],
  )

  const filteredSafeVaultsList = useMemo(() => {
    // the 'safe' means theres always gonna be a vault on this list (even if the filteredAndSortedVaults
    // is empty due to filters) but we try to make it at least have something in common with the filters
    const [vaultFilteredByNetwork] = vaultsList.filter(filterNetworkVaults)
    const [vaultFilteredByAssets] = vaultsList
      .filter(filterAssetVaults)
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      .filter((vault) => vault.id !== vaultFilteredByNetwork?.id)

    const vaultsSafeSorted = [vaultFilteredByAssets, vaultFilteredByNetwork]
      .filter(Boolean)
      .sort(sortVaults)

    return [...(vaultsSafeSorted.length ? vaultsSafeSorted : [vaultsList[0]])]
  }, [filterAssetVaults, filterNetworkVaults, sortVaults, vaultsList])

  const filteredAndSortedVaults = useMemo(() => {
    const networkFilteredVaults = filterNetworks.length
      ? vaultsFilteredByType.filter(filterNetworkVaults)
      : vaultsFilteredByType

    const assetFilteredVaults = filterAssets.length
      ? (networkFilteredVaults.filter(filterAssetVaults) as SDKVaultishType[] | undefined)
      : networkFilteredVaults

    const sortedVaults = assetFilteredVaults?.sort(sortVaults)

    return sortedVaults
  }, [
    vaultsFilteredByType,
    filterNetworks.length,
    filterNetworkVaults,
    filterAssets.length,
    filterAssetVaults,
    sortVaults,
  ])

  return {
    filterNetworks,
    filterAssets,
    filterWallet,
    filterVaults,
    isPermissionedRwaTab,
    sortingMethodId,
    vaultMetricsMap,
    filteredAndSortedVaults,
    filteredSafeVaultsList,
  }
}
