'use client'

import { useMemo } from 'react'
import { getUniqueVaultId } from '@summerfi/app-earn-ui'
import { type SDKVaultsListType, type TokenSymbolsList } from '@summerfi/app-types'

import { type VaultMetricsMap } from '@/components/layout/VaultsListView/types'
import { getManagementFee } from '@/helpers/get-management-fee'

export const useDaoManagedBannerData = ({
  vaultsList,
  vaultMetricsMap,
}: {
  vaultsList: SDKVaultsListType
  vaultMetricsMap: VaultMetricsMap
}) => {
  return useMemo(() => {
    if (!vaultsList.length) {
      return {
        assets: [],
        highestApy: 0,
        highestApyToken: '',
      }
    }

    const daoManagedVaults = vaultsList.filter((vault) => vault.isDaoManaged)
    const assets = Array.from(
      new Set(daoManagedVaults.map((vault) => vault.inputToken.symbol)),
    ) as TokenSymbolsList[]

    const getApyWithBonus = (vault: (typeof vaultsList)[number]) => {
      const metrics = vaultMetricsMap.get(getUniqueVaultId(vault))

      return (metrics?.apy ?? 0) + (metrics?.rawTokenBonus ?? 0)
    }

    const highest7dApyVault = (daoManagedVaults.length ? daoManagedVaults : vaultsList).reduce(
      (prev, current) => (getApyWithBonus(current) > getApyWithBonus(prev) ? current : prev),
    )

    const managementFee = getManagementFee(highest7dApyVault.inputToken.symbol)

    return {
      assets,
      highestApy: getApyWithBonus(highest7dApyVault) - managementFee,
      highestApyToken: highest7dApyVault.inputToken.symbol,
    }
  }, [vaultsList, vaultMetricsMap])
}
