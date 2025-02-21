'use client'

import { useMemo, useState } from 'react'
import {
  DataBlock,
  getUniqueVaultId,
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
  type IconNamesList,
  type IToken,
  type SDKNetwork,
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

import { type GetVaultsApyResponse } from '@/app/server-handlers/vaults-apy'
import { networkIconByNetworkName } from '@/constants/networkIcons'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { getResolvedForecastAmountParsed } from '@/helpers/get-resolved-forecast-amount-parsed'
import { revalidateVaultsListData } from '@/helpers/revalidation-handlers'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { usePosition } from '@/hooks/use-position'
import { useTokenBalances } from '@/hooks/use-tokens-balances'
import { useUserWallet } from '@/hooks/use-user-wallet'

type VaultsListViewProps = {
  vaultsList: SDKVaultsListType
  selectedNetwork?: SDKNetwork | 'all-networks'
  vaultsApyByNetworkMap: GetVaultsApyResponse
}

const allNetworksOption = {
  iconName: 'earn_network_all' as IconNamesList,
  label: 'All Networks',
  value: 'all-networks',
}

const softRouterPush = (url: string) => {
  window.history.pushState(null, '', url)
}

export const VaultsListView = ({
  selectedNetwork,
  vaultsList,
  vaultsApyByNetworkMap,
}: VaultsListViewProps) => {
  const { deviceType } = useDeviceType()
  const { isMobile, isTablet } = useMobileCheck(deviceType)

  const [localVaultNetwork, setLocalVaultNetwork] =
    useState<VaultsListViewProps['selectedNetwork']>(selectedNetwork)
  const {
    state: { sumrNetApyConfig, slippageConfig },
  } = useLocalConfig()

  const networkFilteredVaults = useMemo(() => {
    const properVaultsList =
      localVaultNetwork && localVaultNetwork !== 'all-networks'
        ? vaultsList.filter(({ protocol }) => protocol.network === localVaultNetwork)
        : vaultsList

    return properVaultsList.sort((a, b) => {
      return Number(a.calculatedApr) > Number(b.calculatedApr) ? -1 : 1
    })
  }, [localVaultNetwork, vaultsList])
  const sdk = useAppSDK()
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const [selectedVaultId, setSelectedVaultId] = useState<string | undefined>(
    getUniqueVaultId(networkFilteredVaults[0]),
  )

  const selectedNetworkOption = useMemo(
    () =>
      localVaultNetwork && localVaultNetwork !== 'all-networks'
        ? {
            iconName: networkIconByNetworkName[localVaultNetwork] as IconNamesList,
            value: localVaultNetwork,
            label: capitalize(sdkNetworkToHumanNetwork(localVaultNetwork)),
          }
        : allNetworksOption,
    [localVaultNetwork],
  )
  const vaultsNetworksList = useMemo(
    () => [
      ...[...new Set(vaultsList.map(({ protocol }) => protocol.network))].map((network) => ({
        iconName: networkIconByNetworkName[network] as IconNamesList,
        value: network,
        label: capitalize(sdkNetworkToHumanNetwork(network)),
      })),
      allNetworksOption,
    ],
    [vaultsList],
  )

  const selectedVaultData = useMemo(
    () => vaultsList.find((vault) => getUniqueVaultId(vault) === selectedVaultId),
    [vaultsList, selectedVaultId],
  )

  const resolvedVaultData = selectedVaultData ?? networkFilteredVaults[0]
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

  const handleChangeNetwork = (selected: DropdownRawOption) => {
    setLocalVaultNetwork(selected.value as VaultsListViewProps['selectedNetwork'])
    switch (selected.value) {
      case 'all-networks':
        softRouterPush('/earn')

        break

      default:
        if (selectedVaultData && selectedVaultData.protocol.network !== selected.value) {
          setSelectedVaultId(undefined)
        }
        softRouterPush(`/earn/${sdkNetworkToHumanNetwork(selected.value as SDKNetwork)}`)

        break
    }
  }

  const handleChangeVault = (nextselectedVaultId: string) => {
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
    () => [
      ...new Set(
        vaultsList.reduce<string[]>(
          (acc, { arks }) => [
            // converting a list which looks like `protocolName-token-chainId`
            // into a unique list of protocols for all vaults
            ...acc,
            ...arks
              .map((ark) => {
                if (ark.name === 'BufferArk' || !ark.name) {
                  return null
                }

                const arkNameArray = ark.name.split('-')

                // special case for ERC4626
                if (ark.name.startsWith('ERC4626')) {
                  // examples
                  // ERC4626-Euler_Prime-usdc-1
                  // ERC4626-Gearbox-weth-1
                  return `${arkNameArray[1]}`.replaceAll(/_+/gu, ' ')
                }
                // special case for MorphoVault
                if (ark.name.startsWith('MorphoVault')) {
                  // examples
                  // MorphoVault-usdc-Flagship_USDC-1
                  // MorphoVault-weth-Steakhouse_WETH-1
                  const morphoArkName = `Morpho ${arkNameArray[2].split('_')[0]}`

                  if (
                    acc.filter((item) => item.toLowerCase() === morphoArkName.toLowerCase())
                      .length > 0
                  ) {
                    return false
                  }

                  return morphoArkName
                }

                // the rest should be like this:
                // AaveV3-usdc-1
                // CompoundV3-usdt-1
                // Spark-weth-1
                return arkNameArray[0]
              })
              .filter((arkName): arkName is string => Boolean(arkName)),
          ],
          [],
        ),
      ),
    ],
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
    transactionType: TransactionAction.DEPOSIT,
    selectedTokenOption,
    sdk,
    slippageConfig,
  })

  const resolvedForecastAmount = getResolvedForecastAmountParsed({
    amountParsed,
    rawToTokenAmount,
  })

  return (
    <VaultGrid
      isMobile={isMobile}
      networksList={vaultsNetworksList}
      selectedNetwork={selectedNetworkOption}
      onChangeNetwork={handleChangeNetwork}
      onRefresh={revalidateVaultsListData}
      topContent={
        <SimpleGrid
          columns={isMobile ? 1 : 3}
          rows={isMobile ? 3 : 1}
          style={{ justifyItems: 'stretch' }}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              1. Choose a strategy
            </Text>
          </div>
          {networkFilteredVaults.map((vault, vaultIndex) => (
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
              apy={
                vaultsApyByNetworkMap[`${vault.id}-${subgraphNetworkToId(vault.protocol.network)}`]
              }
            />
          ))}
        </>
      }
      rightContent={
        <VaultSimulationForm
          vaultData={resolvedVaultData}
          isMobile={isMobile}
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
