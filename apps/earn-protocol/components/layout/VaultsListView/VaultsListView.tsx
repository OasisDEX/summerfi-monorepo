'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useUser } from '@account-kit/react'
import {
  Card,
  DataBlock,
  getSumrTokenBonus,
  getUniqueVaultId,
  getVaultPositionUrl,
  getVaultsProtocolsList,
  getVaultUrl,
  isUserSmartAccount,
  SumrStakeCard,
  TabBar,
  Text,
  useAmount,
  useAmountWithSwap,
  useLocalConfig,
  useMobileCheck,
  useTokenSelector,
  useUserWallet,
  VaultCard,
  VaultGrid,
  VaultSimulationForm,
} from '@summerfi/app-earn-ui'
import {
  type DropdownRawOption,
  type GetVaultsApyResponse,
  type IToken,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SupportedSDKNetworks,
  type TokenSymbolsList,
  TransactionAction,
} from '@summerfi/app-types'
import {
  convertWethToEth,
  findVaultInfo,
  formatAddress,
  formatCryptoBalance,
  formatPercent,
  sdkNetworkToHumanNetwork,
  slugifyVault,
  subgraphNetworkToId,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
  zero,
} from '@summerfi/app-utils'
import { type IArmadaVaultInfo } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { capitalize } from 'lodash-es'
import { useRouter, useSearchParams } from 'next/navigation'

import { VaultsSorting } from '@/components/layout/VaultsListView/types'
import { useVaultsListQueryParams } from '@/components/layout/VaultsListView/use-vaults-list-query-params'
import { VaultsFiltersIntermediary } from '@/components/layout/VaultsListView/VaultsListFilters'
import { VaultsInfoSidebarBlock } from '@/components/molecules/VaultsInfoSidebarBlock/VaultsInfoSidebarBlock'
import { MAX_MULTIPLE } from '@/constants/sumr-staking-v2'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { useUserStakeInfo } from '@/features/claim-and-delegate/hooks/use-user-stake-info'
import { filterOutNonSCACompatibleVaults } from '@/helpers/filter-out-non-sca-compatible-vaults'
import { getResolvedForecastAmountParsed } from '@/helpers/get-resolved-forecast-amount-parsed'
import { useAppSDK } from '@/hooks/use-app-sdk'
import {
  useHandleButtonClickEvent,
  useHandleDropdownChangeEvent,
  useHandleInputChangeEvent,
  useHandleTooltipOpenEvent,
} from '@/hooks/use-mixpanel-event'
import { usePosition } from '@/hooks/use-position'
import { useRevalidateVaultsListData } from '@/hooks/use-revalidate'
import { useTokenBalances } from '@/hooks/use-tokens-balances'

import vaultsListViewStyles from './VaultsListView.module.css'

type VaultsListViewProps = {
  vaultsList: SDKVaultsListType
  filteredWalletAssetsVaults?: SDKVaultsListType
  vaultsApyByNetworkMap: GetVaultsApyResponse
  vaultsInfo?: IArmadaVaultInfo[]
  sumrPriceUsd: number
  tvl: number
}

export const VaultsListView = ({
  vaultsList,
  filteredWalletAssetsVaults,
  vaultsApyByNetworkMap,
  vaultsInfo,
  sumrPriceUsd,
  tvl,
}: VaultsListViewProps) => {
  const { deviceType } = useDeviceType()
  const { push } = useRouter()
  const queryParams = useSearchParams()
  const tooltipEventHandler = useHandleTooltipOpenEvent()
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const inputChangeHandler = useHandleInputChangeEvent()
  const dropdownChangeHandler = useHandleDropdownChangeEvent()
  const { userWalletAddress } = useUserWallet()
  const revalidateVaultsListData = useRevalidateVaultsListData()
  const { features } = useSystemConfig()
  const [maxApy, setMaxApy] = useState<number>(0)
  const [sumrRewardApy, setSumrRewardApy] = useState<string | undefined>()
  const [isLoadingRewardRates, setIsLoadingRewardRates] = useState<boolean>(true)
  const {
    state: { sumrNetApyConfig, slippageConfig },
  } = useLocalConfig()

  const user = useUser()
  const userIsSmartAccount = isUserSmartAccount(user)

  const { sumrStakeInfo } = useUserStakeInfo()

  const stakingV2Enabled = !!features?.StakingV2
  const daoManagedVaultsEnabled = !!features?.DaoManagedVaults

  const sumrAvailableToStake =
    Number(sumrStakeInfo?.sumrBalances.total ?? 0) +
    Number(sumrStakeInfo?.sumrStakeInfo.stakedAmount ?? 0)

  const sumrAvailableToStakeUSD = sumrAvailableToStake * sumrPriceUsd

  const { isMobileOrTablet } = useMobileCheck(deviceType)
  const filterNetworks = useMemo(() => queryParams.get('networks')?.split(',') ?? [], [queryParams])
  const filterAssets = useMemo(() => queryParams.get('assets')?.split(',') ?? [], [queryParams])
  const filterWallet = useMemo(() => queryParams.get('walletAddress') ?? '', [queryParams])
  const filterVaults = useMemo(() => queryParams.get('vaults')?.split(',') ?? [], [queryParams])
  const sortingMethodId = useMemo(
    () => queryParams.get('sort') ?? VaultsSorting.HIGHEST_APY,
    [queryParams],
  )

  const sdk = useAppSDK()

  const fetchStakingData = useCallback(async () => {
    try {
      setIsLoadingRewardRates(true)
      // Fetch all data in parallel
      const [rewardRates] = await Promise.all([
        sdk.getStakingRewardRatesV2({
          sumrPriceUsd,
        }),
      ])

      setMaxApy(rewardRates.maxApy.value)
      const summerRewardApyValue = formatPercent(
        new BigNumber(rewardRates.summerRewardYield.value).times(MAX_MULTIPLE),
        {
          precision: 2,
        },
      )

      setSumrRewardApy(summerRewardApyValue)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch staking data:', error)
    } finally {
      setIsLoadingRewardRates(false)
    }
  }, [sdk, sumrPriceUsd])

  // Fetch all staking data on mount
  useEffect(() => {
    void fetchStakingData()
  }, [fetchStakingData])

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

  const sortVaults = useCallback(
    (a: (typeof vaultsList)[number], b: (typeof vaultsList)[number]) => {
      const aTvl = a.totalValueLockedUSD
      const bTvl = b.totalValueLockedUSD

      const aMerklRewards = findVaultInfo(vaultsInfo, a)?.merklRewards
      const bMerklRewards = findVaultInfo(vaultsInfo, b)?.merklRewards

      const aRewards = getSumrTokenBonus({
        merklRewards: aMerklRewards,
        sumrPrice: sumrPriceUsd,
        totalValueLockedUSD: aTvl,
      }).rawSumrTokenBonus
      const bRewards = getSumrTokenBonus({
        merklRewards: bMerklRewards,
        sumrPrice: sumrPriceUsd,
        totalValueLockedUSD: bTvl,
      }).rawSumrTokenBonus

      if (sortingMethodId === VaultsSorting.HIGHEST_TVL) {
        return Number(aTvl) > Number(bTvl) ? -1 : 1
      }
      if (sortingMethodId === VaultsSorting.HIGHEST_REWARDS) {
        return Number(aRewards) > Number(bRewards) ? -1 : 1
      }

      const aApy =
        vaultsApyByNetworkMap[
          `${a.id}-${subgraphNetworkToId(supportedSDKNetwork(a.protocol.network))}`
        ]
      const bApy =
        vaultsApyByNetworkMap[
          `${b.id}-${subgraphNetworkToId(supportedSDKNetwork(b.protocol.network))}`
        ]

      // default sorting method which is VaultsSorting.HIGHEST_APY
      return Number(aApy.apy) > Number(bApy.apy) ? -1 : 1
    },
    [vaultsApyByNetworkMap, sumrPriceUsd, sortingMethodId, vaultsInfo],
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
    const vaultsListTouse = filteredWalletAssetsVaults ?? vaultsList
    const networkFilteredVaults = filterNetworks.length
      ? vaultsListTouse.filter(filterNetworkVaults)
      : vaultsListTouse

    const assetFilteredVaults = filterAssets.length
      ? (networkFilteredVaults.filter(filterAssetVaults) as SDKVaultishType[] | undefined)
      : networkFilteredVaults

    const accountTypeFilteredVaults = userIsSmartAccount
      ? filterOutNonSCACompatibleVaults(assetFilteredVaults ?? [])
      : assetFilteredVaults

    const sortedVaults = accountTypeFilteredVaults?.sort(sortVaults)

    return sortedVaults
  }, [
    vaultsList,
    filteredWalletAssetsVaults,
    filterNetworks.length,
    filterNetworkVaults,
    filterAssets.length,
    filterAssetVaults,
    userIsSmartAccount,
    sortVaults,
  ])

  const [selectedVaultId, setSelectedVaultId] = useState<string | undefined>(
    filteredAndSortedVaults?.length
      ? getUniqueVaultId(filteredAndSortedVaults[0])
      : getUniqueVaultId(filteredSafeVaultsList[0]),
  )

  const selectedVaultData = useMemo(
    () =>
      filteredAndSortedVaults?.find((vault) => getUniqueVaultId(vault) === selectedVaultId) ??
      filteredSafeVaultsList.find((vault) => getUniqueVaultId(vault) === selectedVaultId),
    [filteredAndSortedVaults, filteredSafeVaultsList, selectedVaultId],
  )

  const usingSafeVaultsList = !filteredAndSortedVaults?.[0]
  const resolvedVaultData =
    selectedVaultData ?? filteredAndSortedVaults?.[0] ?? filteredSafeVaultsList[0]

  useEffect(() => {
    // update the selected vault id when the query params change
    const nextSafeSelectedVault = filteredAndSortedVaults?.length
      ? getUniqueVaultId(filteredAndSortedVaults[0])
      : getUniqueVaultId(filteredSafeVaultsList[0])

    if (selectedVaultId !== nextSafeSelectedVault) {
      const tempVaultsIdList = filteredAndSortedVaults?.map((vault) => {
        return getUniqueVaultId(vault)
      })

      if (selectedVaultId && !tempVaultsIdList?.includes(selectedVaultId) && !usingSafeVaultsList) {
        setSelectedVaultId(nextSafeSelectedVault)
      }
    }
  }, [filteredAndSortedVaults, filteredSafeVaultsList, selectedVaultId, usingSafeVaultsList])

  const { position: positionExists, isLoading } = usePosition({
    chainId: subgraphNetworkToSDKId(supportedSDKNetwork(resolvedVaultData.protocol.network)),
    vaultId: resolvedVaultData.id,
    onlyActive: true,
    cached: true,
  })

  const { handleTokenSelectionChange, selectedTokenOption, tokenOptions, setSelectedTokenOption } =
    useTokenSelector({
      vault: resolvedVaultData,
      chainId: subgraphNetworkToSDKId(supportedSDKNetwork(resolvedVaultData.protocol.network)),
    })

  const tokenBalances = useTokenBalances({
    tokenSymbol: selectedTokenOption.value,
    network: supportedSDKNetwork(resolvedVaultData.protocol.network),
    vaultTokenSymbol: resolvedVaultData.inputToken.symbol,
    cached: true,
  })

  // wrapper to show skeleton immediately when changing token
  const handleTokenSelectionChangeWrapper = (option: DropdownRawOption) => {
    dropdownChangeHandler({
      inputName: `vault-list-token-selector-${slugifyVault(resolvedVaultData)}`,
      value: option.value,
    })
    tokenBalances.handleSetTokenBalanceLoading(true)
    handleTokenSelectionChange(option)
  }

  const handleChangeVault = (nextselectedVaultId: string) => {
    if (nextselectedVaultId === selectedVaultId) {
      buttonClickEventHandler(
        `vaults-list-vault-card-${slugifyVault(resolvedVaultData)}-double-click`,
      )
      const vaultUrl =
        positionExists && userWalletAddress
          ? getVaultPositionUrl({
              network: supportedSDKNetwork(resolvedVaultData.protocol.network),
              vaultId: resolvedVaultData.id,
              walletAddress: userWalletAddress,
            })
          : getVaultUrl(resolvedVaultData)

      push(vaultUrl)

      return
    }
    buttonClickEventHandler(`vaults-list-vault-card-${slugifyVault(resolvedVaultData)}-select`)
    setSelectedVaultId(nextselectedVaultId)
  }

  const formattedTotalLiquidity = useMemo(() => {
    return formatCryptoBalance(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      vaultsList.reduce((acc, vault) => acc.plus(vault.withdrawableTotalAssetsUSD ?? zero), zero),
    )
  }, [vaultsList])

  const formattedTotalAssets = useMemo(() => {
    return formatCryptoBalance(tvl)
  }, [tvl])

  const formattedProtocolsSupportedList = useMemo(
    () => getVaultsProtocolsList(vaultsList),
    [vaultsList],
  )

  const formattedProtocolsSupportedCount = formattedProtocolsSupportedList.allVaultsProtocols.length

  const {
    amountParsed,
    manualSetAmount,
    amountDisplay,
    amountDisplayUSD,
    handleAmountChange,
    onBlur,
    onFocus,
  } = useAmount({
    inputName: `vault-list-amount-${slugifyVault(resolvedVaultData)}`,
    inputChangeHandler,
    tokenDecimals: resolvedVaultData.inputToken.decimals,
    tokenPrice: resolvedVaultData.inputTokenPriceUSD,
    selectedToken:
      tokenBalances.token ??
      ({
        decimals: resolvedVaultData.inputToken.decimals,
      } as IToken),
  })

  const { amountDisplayUSDWithSwap, rawToTokenAmount } = useAmountWithSwap({
    vault: resolvedVaultData,
    vaultChainId: subgraphNetworkToSDKId(supportedSDKNetwork(resolvedVaultData.protocol.network)),
    amountDisplay,
    amountDisplayUSD,
    sidebarTransactionType: TransactionAction.DEPOSIT,
    selectedTokenOption,
    sdk,
    slippageConfig,
  })

  const resolvedForecastAmount = getResolvedForecastAmountParsed({
    amountParsed,
    rawToTokenAmount,
  })

  const handleRefresh = () => {
    buttonClickEventHandler(`vaults-list-refresh-vaults-list`)
    revalidateVaultsListData()
  }

  const handleWhatIsLazyClick = () => {
    buttonClickEventHandler('vaults-list-what-is-lazy')
  }

  const { updateQueryParams } = useVaultsListQueryParams()

  return (
    <VaultGrid
      isMobileOrTablet={isMobileOrTablet}
      onRefresh={handleRefresh}
      onWhatIsLazyClick={handleWhatIsLazyClick}
      topContent={
        <div className={vaultsListViewStyles.topContentGrid}>
          <DataBlock
            title="Protocol TVL"
            titleTooltip="Protocol TVL is the total amount of Assets currently deployed across all of the strategies including institutional deployments."
            size="large"
            value={`$${formattedTotalAssets}`}
            tooltipName="vaults-list-protocol-tvl"
            onTooltipOpen={tooltipEventHandler}
          />

          <DataBlock
            title="Instant Liquidity"
            titleTooltip={`This is the total amount of assets in USD that is instantly withdrawable from the strategies. There are currently ${formattedProtocolsSupportedCount} different protocols or markets supported across all active strategies.`}
            size="large"
            value={`$${formattedTotalLiquidity}`}
            tooltipName="vaults-list-instant-liquidity"
            onTooltipOpen={tooltipEventHandler}
          />
          <DataBlock
            title="Protocols Supported"
            // TODO: fill data (this is just a placeholder)
            titleTooltip={`Protocols supported: ${Array.from(
              formattedProtocolsSupportedList.topProtocols,
            )
              .filter((item) => item !== 'BufferArk')
              .map(capitalize)
              .join(', ')}, and ${
              formattedProtocolsSupportedList.allVaultsProtocols.length -
              formattedProtocolsSupportedList.topProtocols.length
            } more.`}
            size="large"
            value={formattedProtocolsSupportedCount}
            tooltipName="vaults-list-protocols-supported"
            onTooltipOpen={tooltipEventHandler}
          />
        </div>
      }
      additionalFullWithTopContent={
        daoManagedVaultsEnabled ? (
          <TabBar
            tabs={[
              {
                id: 'risk-managed',
                label: 'Risk-Managed',
              },
              {
                id: 'dao-managed',
                label: 'DAO-Managed',
              },
            ]}
            handleTabChange={(tab) => {
              updateQueryParams(queryParams, {
                vaults: tab.id,
              })
            }}
            defaultIndex={
              filterVaults.includes('dao-managed')
                ? 1
                : filterVaults.includes('risk-managed')
                  ? 0
                  : 0
            }
            tabContentStyle={{
              padding: 0,
            }}
            wrapperStyle={{
              padding: '0 30px',
            }}
            tabHeadersStyle={{
              borderBottom: 'none',
            }}
            useAsControlled
          />
        ) : null
      }
      leftContent={
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
              <VaultCard
                key={getUniqueVaultId(vault)}
                {...vault}
                withHover
                deviceType={deviceType}
                selected={
                  selectedVaultId === getUniqueVaultId(vault) ||
                  (!selectedVaultId && vaultIndex === 0)
                }
                onClick={(id) => {
                  handleChangeVault(id)
                  // we want to use ETH as native deposit token for WETH vaults
                  const resolvedTokenSymbol = convertWethToEth(
                    vault.inputToken.symbol,
                  ) as TokenSymbolsList

                  setSelectedTokenOption({
                    value: resolvedTokenSymbol,
                    label: resolvedTokenSymbol,
                    tokenSymbol: resolvedTokenSymbol,
                  })
                  tokenBalances.handleSetTokenBalanceLoading(true)
                }}
                withTokenBonus={sumrNetApyConfig.withSumr}
                sumrPrice={sumrPriceUsd}
                vaultApyData={
                  vaultsApyByNetworkMap[
                    `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`
                  ]
                }
                tooltipName="vaults-list-vault-card"
                onTooltipOpen={tooltipEventHandler}
                merklRewards={findVaultInfo(vaultsInfo, vault)?.merklRewards}
              />
            ))
          ) : (
            <div
              className={vaultsListViewStyles.noVaultsWrapper}
              style={{
                textAlign: 'center',
              }}
            >
              <Card
                style={{
                  margin: '0 auto 30px auto',
                }}
              >
                <Text
                  as="p"
                  variant="p2"
                  style={{
                    color: 'var(--earn-protocol-secondary-60)',
                    margin: '30px auto 30px auto',
                  }}
                >
                  No vaults available
                  {filterNetworks.length
                    ? ` on ${filterNetworks.map((network) => capitalize(sdkNetworkToHumanNetwork(network as SupportedSDKNetworks))).join(' and ')}`
                    : ''}
                  {filterAssets.length
                    ? ` with ${filterAssets.join(' and ')} token${filterAssets.length > 1 ? 's' : ''}`
                    : ''}
                  {filterWallet.length
                    ? ` for assets from ${formatAddress(filterWallet)} wallet`
                    : ''}
                  .
                </Text>
              </Card>
              <Text
                as="p"
                variant="p1semiColorful"
                style={{ color: 'var(--earn-protocol-secondary-60)' }}
              >
                You might like these:
              </Text>
            </div>
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
                  onClick={(id) => {
                    handleChangeVault(id)
                    // we want to use ETH as native deposit token for WETH vaults
                    const resolvedTokenSymbol = convertWethToEth(
                      vault.inputToken.symbol,
                    ) as TokenSymbolsList

                    setSelectedTokenOption({
                      value: resolvedTokenSymbol,
                      label: resolvedTokenSymbol,
                      tokenSymbol: resolvedTokenSymbol,
                    })
                    tokenBalances.handleSetTokenBalanceLoading(true)
                  }}
                  withTokenBonus={sumrNetApyConfig.withSumr}
                  sumrPrice={sumrPriceUsd}
                  vaultApyData={
                    vaultsApyByNetworkMap[
                      `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`
                    ]
                  }
                  merklRewards={findVaultInfo(vaultsInfo, vault)?.merklRewards}
                />
              ))}
            </>
          )}
          {stakingV2Enabled && userWalletAddress && sumrStakeInfo && (
            <SumrStakeCard
              availableToStake={sumrAvailableToStake}
              availableToStakeUSD={sumrAvailableToStakeUSD}
              yieldTokenApy={isLoadingRewardRates ? '-' : Number(maxApy / 100).toString()}
              yieldToken="USDC"
              apy={sumrRewardApy}
              tooltipName="sumr-stake-bonus-label"
              onTooltipOpen={tooltipEventHandler}
              handleClick={() => {
                buttonClickEventHandler('vaults-list-sumr-stake-card-click')
                push(`/staking`)
              }}
            />
          )}
        </>
      }
      rightContent={
        <>
          <VaultSimulationForm
            vaultData={resolvedVaultData}
            isMobileOrTablet={isMobileOrTablet}
            tokenBalance={tokenBalances.tokenBalance}
            isTokenBalanceLoading={tokenBalances.tokenBalanceLoading}
            selectedTokenOption={selectedTokenOption}
            handleTokenSelectionChange={handleTokenSelectionChangeWrapper}
            tokenOptions={tokenOptions}
            handleAmountChange={handleAmountChange}
            inputProps={{
              onFocus,
              onBlur,
              amountDisplay,
              amountDisplayUSDWithSwap,
              manualSetAmount,
            }}
            resolvedForecastAmount={resolvedForecastAmount}
            amountParsed={amountParsed}
            isEarnApp
            positionExists={Boolean(positionExists)}
            userWalletAddress={userWalletAddress}
            isLoading={isLoading}
            onButtonClick={buttonClickEventHandler}
          />
          {daoManagedVaultsEnabled && <VaultsInfoSidebarBlock />}
        </>
      }
    />
  )
}
