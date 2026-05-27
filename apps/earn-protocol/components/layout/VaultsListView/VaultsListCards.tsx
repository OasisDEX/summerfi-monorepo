'use client'

import { Fragment } from 'react'
import { getUniqueVaultId, SumrStakeCard, VaultCard } from '@summerfi/app-earn-ui'
import {
  type DeviceType,
  type GetVaultsApyResponse,
  type RewardTokenPrices,
  type SDKVaultishType,
  type SDKVaultsListType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { findVaultInfo } from '@summerfi/app-utils'
import { type IArmadaVaultInfo } from '@summerfi/sdk-common'
import { type ReadonlyURLSearchParams } from 'next/navigation'

import { getVaultApySelector } from '@/components/layout/VaultsListView/get-vault-apy-selector'
import { VaultsListDaoManagedVaultBanner } from '@/components/layout/VaultsListView/VaultsListDaoManagedVaultBanner'
import { VaultsListEmptyState } from '@/components/layout/VaultsListView/VaultsListEmptyState'
import { VaultsFiltersIntermediary } from '@/components/layout/VaultsListView/VaultsListFilters'

type VaultsListCardsProps = {
  vaultsList: SDKVaultsListType
  filteredAndSortedVaults: SDKVaultsListType | undefined
  filteredSafeVaultsList: SDKVaultsListType
  usingSafeVaultsList: boolean
  sortingMethodId: string
  daoManagedVaultsEnabled: boolean
  rwaVaultsEnabled: boolean
  isPermissionedRwaTab: boolean
  queryParams: ReadonlyURLSearchParams
  filterNetworks: string[]
  filterAssets: string[]
  filterVaults: string[]
  filterWallet: string
  selectedVaultId?: string
  deviceType: DeviceType
  withSumr: boolean
  rewardTokenPrices: RewardTokenPrices
  vaultsApyByNetworkMap: GetVaultsApyResponse
  vaultsInfo?: IArmadaVaultInfo[]
  daoManagedVaultsBannerData: {
    assets: TokenSymbolsList[]
    highestApy: number
    highestApyToken: string
  }
  onSelectVault: (vault: SDKVaultishType, id: string) => void
  onDaoBannerClick: () => void
  onTooltipOpen: (tooltipName: string) => void
  showStakeCard: boolean
  sumrAvailableToStake: number
  sumrAvailableToStakeUSD: number
  isLoadingRewardRates: boolean
  maxApy: number
  sumrRewardApy?: string
  onStakeCardClick: () => void
}

export const VaultsListCards = ({
  vaultsList,
  filteredAndSortedVaults,
  filteredSafeVaultsList,
  usingSafeVaultsList,
  sortingMethodId,
  daoManagedVaultsEnabled,
  rwaVaultsEnabled,
  isPermissionedRwaTab,
  queryParams,
  filterNetworks,
  filterAssets,
  filterVaults,
  filterWallet,
  selectedVaultId,
  deviceType,
  withSumr,
  rewardTokenPrices,
  vaultsApyByNetworkMap,
  vaultsInfo,
  daoManagedVaultsBannerData,
  onSelectVault,
  onDaoBannerClick,
  onTooltipOpen,
  showStakeCard,
  sumrAvailableToStake,
  sumrAvailableToStakeUSD,
  isLoadingRewardRates,
  maxApy,
  sumrRewardApy,
  onStakeCardClick,
}: VaultsListCardsProps) => {
  return (
    <>
      <VaultsFiltersIntermediary
        vaultsList={vaultsList}
        sortingMethodId={sortingMethodId}
        daoManagedVaultsEnabled={daoManagedVaultsEnabled}
        queryParams={queryParams}
        filterNetworks={filterNetworks}
        filterAssets={filterAssets}
        filterVaults={filterVaults}
        filterWallet={filterWallet}
      />
      {filteredAndSortedVaults?.length ? (
        filteredAndSortedVaults.map((vault, vaultIndex) => (
          <Fragment key={getUniqueVaultId(vault)}>
            {vaultIndex === 1 &&
              !rwaVaultsEnabled &&
              !filterVaults.includes('dao-risk-managed') && (
                <VaultsListDaoManagedVaultBanner
                  assets={daoManagedVaultsBannerData.assets}
                  highestApy={daoManagedVaultsBannerData.highestApy}
                  highestApyToken={daoManagedVaultsBannerData.highestApyToken}
                  onClick={onDaoBannerClick}
                />
              )}
            <VaultCard
              {...vault}
              withHover
              deviceType={deviceType}
              selected={
                selectedVaultId === getUniqueVaultId(vault) ||
                (!selectedVaultId && vaultIndex === 0)
              }
              onClick={(id) => onSelectVault(vault, id)}
              withTokenBonus={withSumr}
              rewardTokenPrices={rewardTokenPrices}
              isRwaVault={isPermissionedRwaTab}
              vaultApyData={vaultsApyByNetworkMap[getVaultApySelector(vault)]}
              tooltipName="vaults-list-vault-card"
              onTooltipOpen={onTooltipOpen}
              merklRewards={findVaultInfo(vaultsInfo, vault)?.merklRewards}
            />
          </Fragment>
        ))
      ) : (
        <VaultsListEmptyState
          isPermissionedRwaTab={isPermissionedRwaTab}
          filterVaults={filterVaults}
          filterNetworks={filterNetworks}
          filterAssets={filterAssets}
          filterWallet={filterWallet}
        />
      )}
      {usingSafeVaultsList && filteredSafeVaultsList.length && (
        <>
          {filteredSafeVaultsList.map((vault, vaultIndex) => (
            <VaultCard
              key={getUniqueVaultId(vault)}
              {...vault}
              withHover
              selected={
                selectedVaultId === getUniqueVaultId(vault) ||
                (!selectedVaultId && vaultIndex === 0)
              }
              onClick={(id) => onSelectVault(vault, id)}
              withTokenBonus={withSumr}
              rewardTokenPrices={rewardTokenPrices}
              vaultApyData={vaultsApyByNetworkMap[getVaultApySelector(vault)]}
              merklRewards={findVaultInfo(vaultsInfo, vault)?.merklRewards}
            />
          ))}
        </>
      )}
      {showStakeCard && (
        <SumrStakeCard
          availableToStake={sumrAvailableToStake}
          availableToStakeUSD={sumrAvailableToStakeUSD}
          yieldTokenApy={isLoadingRewardRates ? '-' : Number(maxApy / 100).toString()}
          yieldToken="USDC"
          apy={sumrRewardApy}
          tooltipName="sumr-stake-bonus-label"
          onTooltipOpen={onTooltipOpen}
          handleClick={onStakeCardClick}
        />
      )}
    </>
  )
}
