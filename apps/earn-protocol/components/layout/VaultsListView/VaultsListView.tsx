'use client'

import { type CSSProperties, useCallback, useEffect, useMemo, useState } from 'react'
import {
  DataBlock,
  Dropdown,
  GenericMultiselect,
  getSumrTokenBonus,
  getUniqueVaultId,
  getVaultsProtocolsList,
  getVaultUrl,
  networkIconByNetworkName,
  SimpleGrid,
  SUMR_CAP,
  Text,
  useAmount,
  useAmountWithSwap,
  useLocalConfig,
  useMobileCheck,
  useTokenSelector,
  VaultCard,
  VaultGrid,
  VaultSimulationForm,
} from '@summerfi/app-earn-ui'
import {
  type DropdownRawOption,
  type GetVaultsApyResponse,
  type IconNamesList,
  type IToken,
  type SDKNetwork,
  type SDKVaultishType,
  type SDKVaultsListType,
  TransactionAction,
} from '@summerfi/app-types'
import {
  formatCryptoBalance,
  sdkNetworkToHumanNetwork,
  subgraphNetworkToId,
  subgraphNetworkToSDKId,
  zero,
} from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'
import { type ReadonlyURLSearchParams, useRouter, useSearchParams } from 'next/navigation'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { mapTokensToMultiselectOptions } from '@/features/latest-activity/table/filters/mappers'
import { filterStablecoins } from '@/helpers/filter-stablecoins'
import { getResolvedForecastAmountParsed } from '@/helpers/get-resolved-forecast-amount-parsed'
import { revalidateVaultsListData } from '@/helpers/revalidation-handlers'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { usePosition } from '@/hooks/use-position'
import { useTokenBalances } from '@/hooks/use-tokens-balances'
import { useUserWallet } from '@/hooks/use-user-wallet'

import vaultsListViewStyles from './VaultsListView.module.css'

type VaultsListViewProps = {
  vaultsList: SDKVaultsListType
  vaultsApyByNetworkMap: GetVaultsApyResponse
}

enum VaultsSorting {
  HIGHEST_APY = 'highest-apy',
  HIGHEST_REWARDS = 'highest-rewards',
  HIGHEST_TVL = 'highest-tvl',
}

const sortingMethods = [
  {
    // default sorting method
    id: VaultsSorting.HIGHEST_APY,
    label: 'Highest APY',
  },
  {
    id: VaultsSorting.HIGHEST_REWARDS,
    label: 'Highest SUMR Rewards',
  },
  {
    id: VaultsSorting.HIGHEST_TVL,
    label: 'Highest TVL',
  },
]

const softRouterPush = (url: string) => {
  window.history.pushState(null, '', url)
}

const VaultsSortingItem = ({ label, style }: { label: string; style?: CSSProperties }) => {
  return (
    <Text variant="p3semi" style={style}>
      {label}
    </Text>
  )
}

const updateQueryParams = (
  queryParams: ReadonlyURLSearchParams,
  newFilters: { assets?: string[]; networks?: string[]; sorting?: DropdownRawOption },
) => {
  // use soft router push to update the URL without reloading the page
  const newQueryParams = {
    ...(newFilters.assets && { assets: newFilters.assets.join(',') }),
    ...(newFilters.networks && { networks: newFilters.networks.join(',') }),
    ...(newFilters.sorting && {
      sort: newFilters.sorting.value !== 'highest-apy' ? newFilters.sorting.value : '', // if its the default one its gonna be deleted below
    }),
  }

  const nextQueryParams = new URLSearchParams(newQueryParams)
  const currentQueryParams = new URLSearchParams(queryParams.toString())
  const mergedQueryParams = new URLSearchParams({
    ...Object.fromEntries(currentQueryParams.entries()),
    ...Object.fromEntries(nextQueryParams.entries()),
  })

  for (const param of ['assets', 'networks', 'sort']) {
    if (mergedQueryParams.get(param) === null || mergedQueryParams.get(param) === '') {
      mergedQueryParams.delete(param)
    }
  }

  const newUrl = `/earn?${mergedQueryParams.toString()}`

  softRouterPush(newUrl)
}

export const VaultsListView = ({ vaultsList, vaultsApyByNetworkMap }: VaultsListViewProps) => {
  const { deviceType } = useDeviceType()
  const { push } = useRouter()
  const queryParams = useSearchParams()

  const { isMobile, isTablet, isMobileOrTablet } = useMobileCheck(deviceType)
  const filterNetworks = useMemo(() => queryParams.get('networks')?.split(',') ?? [], [queryParams])
  const filterAssets = useMemo(() => queryParams.get('assets')?.split(',') ?? [], [queryParams])
  const sortingMethodId = useMemo(
    () => queryParams.get('sort') ?? VaultsSorting.HIGHEST_APY,
    [queryParams],
  )

  const {
    state: { sumrNetApyConfig, slippageConfig },
  } = useLocalConfig()

  const sdk = useAppSDK()
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

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
      const aRewards = getSumrTokenBonus(
        a.rewardTokens,
        a.rewardTokenEmissionsAmount,
        estimatedSumrPrice,
        aTvl,
        a.rewardTokenEmissionsFinish,
      ).rawSumrTokenBonus
      const bRewards = getSumrTokenBonus(
        b.rewardTokens,
        b.rewardTokenEmissionsAmount,
        estimatedSumrPrice,
        bTvl,
        b.rewardTokenEmissionsFinish,
      ).rawSumrTokenBonus

      if (sortingMethodId === VaultsSorting.HIGHEST_TVL) {
        return Number(aTvl) > Number(bTvl) ? -1 : 1
      }
      if (sortingMethodId === VaultsSorting.HIGHEST_REWARDS) {
        return Number(aRewards) > Number(bRewards) ? -1 : 1
      }

      const aApy = vaultsApyByNetworkMap[`${a.id}-${subgraphNetworkToId(a.protocol.network)}`]
      const bApy = vaultsApyByNetworkMap[`${b.id}-${subgraphNetworkToId(b.protocol.network)}`]

      // default sorting method which is VaultsSorting.HIGHEST_APY
      return Number(aApy.apy) > Number(bApy.apy) ? -1 : 1
    },
    [vaultsApyByNetworkMap, estimatedSumrPrice, sortingMethodId],
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
      ? vaultsList.filter(filterNetworkVaults)
      : vaultsList

    const assetFilteredVaults = filterAssets.length
      ? (networkFilteredVaults.filter(filterAssetVaults) as SDKVaultishType[] | undefined)
      : networkFilteredVaults

    const sortedVaults = assetFilteredVaults?.sort(sortVaults)

    return sortedVaults
  }, [sortVaults, filterNetworks, filterNetworkVaults, filterAssetVaults, vaultsList, filterAssets])

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

  const { userWalletAddress } = useUserWallet()

  const { position: positionExists, isLoading } = usePosition({
    chainId: subgraphNetworkToSDKId(resolvedVaultData.protocol.network),
    vaultId: resolvedVaultData.id,
    onlyActive: true,
  })

  const { handleTokenSelectionChange, selectedTokenOption, tokenOptions } = useTokenSelector({
    vault: resolvedVaultData,
    chainId: subgraphNetworkToSDKId(resolvedVaultData.protocol.network),
  })

  const tokenBalances = useTokenBalances({
    tokenSymbol: selectedTokenOption.value,
    network: resolvedVaultData.protocol.network,
    vaultTokenSymbol: resolvedVaultData.inputToken.symbol,
  })

  const handleChangeVault = (nextselectedVaultId: string) => {
    if (nextselectedVaultId === selectedVaultId) {
      const vaultUrl = getVaultUrl(resolvedVaultData)

      push(vaultUrl)

      return
    }
    setSelectedVaultId(nextselectedVaultId)
  }

  const formattedTotalLiquidity = useMemo(() => {
    return formatCryptoBalance(
      vaultsList.reduce((acc, vault) => acc.plus(vault.withdrawableTotalAssetsUSD ?? zero), zero),
    )
  }, [vaultsList])

  const formattedTotalAssets = useMemo(() => {
    return formatCryptoBalance(
      vaultsList.reduce((acc, vault) => acc.plus(vault.totalValueLockedUSD), zero),
    )
  }, [vaultsList])

  const formattedProtocolsSupportedList = useMemo(
    () => getVaultsProtocolsList(vaultsList),
    [vaultsList],
  )

  const formattedProtocolsSupportedCount = formattedProtocolsSupportedList.length

  const {
    amountParsed,
    manualSetAmount,
    amountDisplay,
    amountDisplayUSD,
    handleAmountChange,
    onBlur,
    onFocus,
  } = useAmount({
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
    vaultChainId: subgraphNetworkToSDKId(resolvedVaultData.protocol.network),
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

  const assetsList = useMemo(
    () =>
      mapTokensToMultiselectOptions(vaultsList).filter((option) => {
        return option.token !== 'USD₮0' // remove the fancy glyphs
      }),
    [vaultsList],
  )
  const tokenOptionGroups = useMemo(
    () => [
      {
        id: 'all-tokens',
        key: 'All tokens',
        icon: 'earn_network_all' as IconNamesList,
        buttonStyle: {
          paddingLeft: '8px',
          paddingTop: '4px',
          paddingBottom: '4px',
        },
        options: assetsList.map(({ value }) => value),
      },
      {
        id: 'all-stables',
        key: 'All stables',
        icon: 'usd_circle' as IconNamesList,
        buttonStyle: {
          paddingLeft: '8px',
          paddingTop: '4px',
          paddingBottom: '4px',
        },
        iconStyle: {
          color: '#777576',
        },
        options: assetsList.map(({ value }) => value).filter(filterStablecoins),
      },
    ],
    [assetsList],
  )

  const vaultsNetworksList = useMemo(
    () => [
      ...[...new Set(vaultsList.map(({ protocol }) => protocol.network))].map((network) => ({
        icon: networkIconByNetworkName[network] as IconNamesList,
        value: network,
        label: capitalize(sdkNetworkToHumanNetwork(network)),
      })),
    ],
    [vaultsList],
  )
  const vaultsNetworksOptionGroups = useMemo(() => {
    return [
      {
        id: 'all-networks',
        key: 'All networks',
        icon: 'earn_network_all' as IconNamesList,
        buttonStyle: {
          paddingLeft: '8px',
          paddingTop: '4px',
          paddingBottom: '4px',
        },
        options: vaultsNetworksList.map(({ value }) => value),
      },
    ]
  }, [vaultsNetworksList])

  const selectedSortingMethod = useMemo(() => {
    const sortingMethod = sortingMethods.find(({ id }) => id === sortingMethodId)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return sortingMethod ?? sortingMethods.find(({ id }) => id === 'highest-apy')! // selecting the default one
  }, [sortingMethodId])

  return (
    <VaultGrid
      isMobileOrTablet={isMobileOrTablet}
      onRefresh={revalidateVaultsListData}
      topContent={
        <SimpleGrid
          columns={isMobile ? 1 : 3}
          rows={isMobile ? 3 : 1}
          className={vaultsListViewStyles.topContentGrid}
          gap={isMobile ? 16 : isTablet ? 64 : 170}
        >
          <DataBlock
            title="Protocol TVL"
            titleTooltip="Protocol TVL is the total amount of Assets currently deployed across all of the strategies"
            size="large"
            value={`$${formattedTotalAssets}`}
          />

          <DataBlock
            title="Instant Liquidity"
            titleTooltip={`This is the total amount of assets in USD that is instantly withdrawable from the strategies. There are currently ${formattedProtocolsSupportedCount} different protocols or markets supported across all active strategies.`}
            size="large"
            value={`$${formattedTotalLiquidity}`}
          />
          <DataBlock
            title="Protocols Supported"
            // TODO: fill data (this is just a placeholder)
            titleTooltip={`Protocols supported: ${Array.from(formattedProtocolsSupportedList)
              .filter((item) => item !== 'BufferArk')
              .join(', ')}`}
            size="large"
            value={formattedProtocolsSupportedCount}
          />
        </SimpleGrid>
      }
      leftContent={
        <>
          <div className={vaultsListViewStyles.leftHeaderRow}>
            <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              Choose a strategy
            </Text>
          </div>
          <div className={vaultsListViewStyles.leftHeaderFiltersRow}>
            <div className={vaultsListViewStyles.filtersGroup}>
              <GenericMultiselect
                options={assetsList}
                label="Tokens"
                onChange={(assets) => {
                  updateQueryParams(queryParams, { assets })
                }}
                initialValues={filterAssets}
                optionGroups={tokenOptionGroups}
                style={{ width: isMobile ? '100%' : 'fit-content' }}
              />
              <GenericMultiselect
                options={vaultsNetworksList}
                label="Networks"
                onChange={(networks) => {
                  updateQueryParams(queryParams, { networks })
                }}
                initialValues={filterNetworks}
                optionGroups={vaultsNetworksOptionGroups}
                style={{ width: isMobile ? '100%' : 'fit-content' }}
              />
            </div>
            <Dropdown
              dropdownChildrenStyle={{
                width: isMobile ? '100%' : 'fit-content',
              }}
              dropdownValue={{
                value: selectedSortingMethod.id,
                content: <VaultsSortingItem label={selectedSortingMethod.label} />,
              }}
              options={sortingMethods.map(({ id, label }) => ({
                value: id,
                content: <VaultsSortingItem label={label} />,
              }))}
              onChange={(sorting: DropdownRawOption) => {
                updateQueryParams(queryParams, { sorting })
              }}
              asPill
            >
              <VaultsSortingItem
                label={selectedSortingMethod.label}
                style={{ paddingLeft: '5px' }}
              />
            </Dropdown>
          </div>
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
                onClick={handleChangeVault}
                withTokenBonus={sumrNetApyConfig.withSumr}
                sumrPrice={estimatedSumrPrice}
                vaultApyData={
                  vaultsApyByNetworkMap[
                    `${vault.id}-${subgraphNetworkToId(vault.protocol.network)}`
                  ]
                }
              />
            ))
          ) : (
            <div className={vaultsListViewStyles.noVaultsWrapper}>
              <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                No vaults available
                {filterNetworks.length
                  ? ` for ${filterNetworks.map((network) => capitalize(sdkNetworkToHumanNetwork(network as SDKNetwork))).join(' and ')}`
                  : ''}
                {filterAssets.length
                  ? ` with ${filterAssets.join(' and ')} token${filterAssets.length > 1 ? 's' : ''}`
                  : ''}
              </Text>
              <Text
                as="p"
                variant="p1semiColorful"
                style={{ color: 'var(--earn-protocol-secondary-60)' }}
              >
                You might like these:
              </Text>
            </div>
          )}
          {usingSafeVaultsList && (
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
                  onClick={handleChangeVault}
                  withTokenBonus={sumrNetApyConfig.withSumr}
                  sumrPrice={estimatedSumrPrice}
                  vaultApyData={
                    vaultsApyByNetworkMap[
                      `${vault.id}-${subgraphNetworkToId(vault.protocol.network)}`
                    ]
                  }
                />
              ))}
            </>
          )}
        </>
      }
      rightContent={
        <VaultSimulationForm
          vaultData={resolvedVaultData}
          isMobileOrTablet={isMobileOrTablet}
          tokenBalance={tokenBalances.tokenBalance}
          isTokenBalanceLoading={tokenBalances.tokenBalanceLoading}
          selectedTokenOption={selectedTokenOption}
          handleTokenSelectionChange={handleTokenSelectionChange}
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
        />
      }
    />
  )
}
