'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  getUniqueVaultId,
  getVaultPositionUrl,
  getVaultUrl,
  useEarnProtocolWallet,
  useLocalConfig,
  useMobileCheck,
  VaultGrid,
} from '@summerfi/app-earn-ui'
import {
  type GetVaultsApyResponse,
  type RewardTokenPrices,
  type SDKVaultishType,
  type SDKVaultsListType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { convertWethToEth, slugifyVault, supportedSDKNetwork } from '@summerfi/app-utils'
import { type IArmadaVaultInfo } from '@summerfi/sdk-common'
import { useRouter, useSearchParams } from 'next/navigation'

import { useSumrStakingRewards } from '@/components/layout/VaultsListView/use-sumr-staking-rewards'
import { useVaultSimulation } from '@/components/layout/VaultsListView/use-vault-simulation'
import { useVaultsListFiltering } from '@/components/layout/VaultsListView/use-vaults-list-filtering'
import { useVaultsListQuery } from '@/components/layout/VaultsListView/useVaultsListQuery'
import { VaultSimulationSidebar } from '@/components/layout/VaultsListView/VaultSimulationSidebar'
import { VaultsListCards } from '@/components/layout/VaultsListView/VaultsListCards'
import { VaultsListMetrics } from '@/components/layout/VaultsListView/VaultsListMetrics'
import {
  VaultsListLeftContentLoading,
  VaultsListViewLoading,
} from '@/components/layout/VaultsListView/VaultsListViewLoading'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { useUserStakeInfo } from '@/features/claim-and-delegate/hooks/use-user-stake-info'
import { useHandleButtonClickEvent, useHandleTooltipOpenEvent } from '@/hooks/use-mixpanel-event'
import { useRevalidateVaultsListData } from '@/hooks/use-revalidate'

type VaultsListViewInnerProps = {
  vaultsList: SDKVaultsListType
  filteredWalletAssetsVaults: SDKVaultsListType
  vaultsApyByNetworkMap: GetVaultsApyResponse
  vaultsInfo?: IArmadaVaultInfo[]
  sumrPriceUsd: number
  rewardTokenPrices: RewardTokenPrices
  tvl: number
  instantLiquidity: number
  protocolsList: {
    topProtocols: string[]
    allVaultsProtocols: string[]
  }
  vaultsListLoading?: boolean
}

type VaultsListViewProps = {
  walletAddress?: string
}

const VaultsListViewInner = ({
  vaultsList,
  filteredWalletAssetsVaults,
  vaultsApyByNetworkMap,
  vaultsInfo,
  sumrPriceUsd,
  rewardTokenPrices,
  tvl,
  instantLiquidity,
  protocolsList,
  vaultsListLoading,
}: VaultsListViewInnerProps) => {
  const { deviceType } = useDeviceType()
  const { push } = useRouter()
  const queryParams = useSearchParams()
  const tooltipEventHandler = useHandleTooltipOpenEvent()
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const revalidateVaultsListData = useRevalidateVaultsListData()
  const { features } = useSystemConfig()
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const { sumrStakeInfo } = useUserStakeInfo()
  const { isMobileOrTablet } = useMobileCheck(deviceType)

  const stakingV2Enabled = !!features?.StakingV2
  const daoManagedVaultsEnabled = !!features?.DaoManagedVaults

  const sumrAvailableToStake =
    Number(sumrStakeInfo?.sumrBalances.total ?? 0) +
    Number(sumrStakeInfo?.sumrStakeInfo.stakedAmount ?? 0)
  const sumrAvailableToStakeUSD = sumrAvailableToStake * sumrPriceUsd

  const {
    filterNetworks,
    filterAssets,
    filterWallet,
    filterVaults,
    sortingMethodId,
    filteredAndSortedVaults,
    filteredSafeVaultsList,
  } = useVaultsListFiltering({
    vaultsList,
    filteredWalletAssetsVaults,
    vaultsApyByNetworkMap,
    vaultsInfo,
    rewardTokenPrices,
    queryParams,
  })

  const [selectedVaultId, setSelectedVaultId] = useState<string | undefined>(
    filteredAndSortedVaults.length
      ? getUniqueVaultId(filteredAndSortedVaults[0])
      : getUniqueVaultId(filteredSafeVaultsList[0]),
  )

  const selectedVaultData = useMemo(
    () =>
      filteredAndSortedVaults.find((vault) => getUniqueVaultId(vault) === selectedVaultId) ??
      filteredSafeVaultsList.find((vault) => getUniqueVaultId(vault) === selectedVaultId),
    [filteredAndSortedVaults, filteredSafeVaultsList, selectedVaultId],
  )

  const usingSafeVaultsList = !filteredAndSortedVaults[0]
  const activeVaultData =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    selectedVaultData ?? filteredAndSortedVaults[0] ?? filteredSafeVaultsList[0]

  useEffect(() => {
    // update the selected vault id when the query params change
    const nextSafeSelectedVault = filteredAndSortedVaults.length
      ? getUniqueVaultId(filteredAndSortedVaults[0])
      : getUniqueVaultId(filteredSafeVaultsList[0])

    if (selectedVaultId !== nextSafeSelectedVault) {
      const tempVaultsIdList = filteredAndSortedVaults.map((vault) => {
        return getUniqueVaultId(vault)
      })

      if (selectedVaultId && !tempVaultsIdList.includes(selectedVaultId)) {
        setSelectedVaultId(nextSafeSelectedVault)
      }
    }
  }, [filteredAndSortedVaults, filteredSafeVaultsList, selectedVaultId])

  const simulation = useVaultSimulation(activeVaultData)
  const { maxApy, sumrRewardApy, isLoadingRewardRates } = useSumrStakingRewards(sumrPriceUsd)

  const handleChangeVault = (nextselectedVaultId: string) => {
    if (nextselectedVaultId === selectedVaultId) {
      buttonClickEventHandler(
        `vaults-list-vault-card-${slugifyVault(activeVaultData)}-double-click`,
      )
      const vaultUrl =
        simulation.positionExists && userWalletAddress
          ? getVaultPositionUrl({
              network: supportedSDKNetwork(activeVaultData.protocol.network),
              vaultId: activeVaultData.id,
              walletAddress: userWalletAddress,
            })
          : getVaultUrl(activeVaultData)

      push(vaultUrl)

      return
    }
    buttonClickEventHandler(`vaults-list-vault-card-${slugifyVault(activeVaultData)}-select`)
    setSelectedVaultId(nextselectedVaultId)
  }

  const handleSelectVault = (vault: SDKVaultishType, id: string) => {
    handleChangeVault(id)
    // we want to use ETH as native deposit token for WETH vaults
    const resolvedTokenSymbol = convertWethToEth(vault.inputToken.symbol) as TokenSymbolsList

    simulation.setSelectedTokenOption({
      value: resolvedTokenSymbol,
      label: resolvedTokenSymbol,
      tokenSymbol: resolvedTokenSymbol,
    })
    simulation.tokenBalances.handleSetTokenBalanceLoading(true)
  }

  const handleRefresh = () => {
    buttonClickEventHandler(`vaults-list-refresh-vaults-list`)
    revalidateVaultsListData()
  }

  const handleWhatIsLazyClick = () => {
    buttonClickEventHandler('vaults-list-what-is-lazy')
  }

  const handleStakeCardClick = () => {
    buttonClickEventHandler('vaults-list-sumr-stake-card-click')
    push(`/staking`)
  }

  const showStakeCard = stakingV2Enabled && !!userWalletAddress && !!sumrStakeInfo

  return (
    <VaultGrid
      isMobileOrTablet={isMobileOrTablet}
      onRefresh={handleRefresh}
      onWhatIsLazyClick={handleWhatIsLazyClick}
      topContent={
        <VaultsListMetrics
          tvl={tvl}
          instantLiquidity={instantLiquidity}
          protocolsList={protocolsList}
          onTooltipOpen={tooltipEventHandler}
        />
      }
      leftContent={
        vaultsListLoading ? (
          <VaultsListLeftContentLoading />
        ) : (
          <VaultsListCards
            vaultsList={vaultsList}
            filteredAndSortedVaults={filteredAndSortedVaults}
            filteredSafeVaultsList={filteredSafeVaultsList}
            usingSafeVaultsList={usingSafeVaultsList}
            sortingMethodId={sortingMethodId}
            daoManagedVaultsEnabled={daoManagedVaultsEnabled}
            queryParams={queryParams}
            filterNetworks={filterNetworks}
            filterAssets={filterAssets}
            filterVaults={filterVaults}
            filterWallet={filterWallet}
            selectedVaultId={selectedVaultId}
            deviceType={deviceType}
            withSumr={sumrNetApyConfig.withSumr}
            rewardTokenPrices={rewardTokenPrices}
            vaultsApyByNetworkMap={vaultsApyByNetworkMap}
            vaultsInfo={vaultsInfo}
            onSelectVault={handleSelectVault}
            onTooltipOpen={tooltipEventHandler}
            showStakeCard={showStakeCard}
            sumrAvailableToStake={sumrAvailableToStake}
            sumrAvailableToStakeUSD={sumrAvailableToStakeUSD}
            isLoadingRewardRates={isLoadingRewardRates}
            maxApy={maxApy}
            sumrRewardApy={sumrRewardApy}
            onStakeCardClick={handleStakeCardClick}
          />
        )
      }
      rightContent={
        <VaultSimulationSidebar
          activeVaultData={activeVaultData}
          isMobileOrTablet={isMobileOrTablet}
          userWalletAddress={userWalletAddress}
          daoManagedVaultsEnabled={daoManagedVaultsEnabled}
          onButtonClick={buttonClickEventHandler}
          simulation={simulation}
        />
      }
    />
  )
}

export const VaultsListView = ({ walletAddress }: VaultsListViewProps) => {
  const { data, isFetching, isPlaceholderData } = useVaultsListQuery(walletAddress)

  if (!data) {
    return <VaultsListViewLoading />
  }

  return (
    <VaultsListViewInner
      vaultsList={data.vaultsList}
      filteredWalletAssetsVaults={data.filteredWalletAssetsVaults}
      vaultsApyByNetworkMap={data.vaultsApyByNetworkMap}
      vaultsInfo={data.vaultsInfo}
      sumrPriceUsd={data.sumrPriceUsd}
      rewardTokenPrices={data.rewardTokenPrices}
      tvl={data.tvl}
      instantLiquidity={data.instantLiquidity}
      protocolsList={data.protocolsList}
      vaultsListLoading={isFetching && isPlaceholderData}
    />
  )
}
