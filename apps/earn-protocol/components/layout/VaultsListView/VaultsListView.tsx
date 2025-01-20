'use client'

import { useMemo, useState } from 'react'
import {
  DataBlock,
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
  subgraphNetworkToSDKId,
  zero,
} from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'

import { networkIconByNetworkName } from '@/constants/networkIcons'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { getResolvedForecastAmountParsed } from '@/helpers/get-resolved-forecast-amount-parsed'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { usePosition } from '@/hooks/use-position'
import { useTokenBalances } from '@/hooks/use-tokens-balances'
import { useUserWallet } from '@/hooks/use-user-wallet'

type VaultsListViewProps = {
  vaultsList: SDKVaultsListType
  selectedNetwork?: SDKNetwork | 'all-networks'
}

const allNetworksOption = {
  iconName: 'earn_network_all' as IconNamesList,
  label: 'All Networks',
  value: 'all-networks',
}

const softRouterPush = (url: string) => {
  window.history.pushState(null, '', url)
}

export const VaultsListView = ({ selectedNetwork, vaultsList }: VaultsListViewProps) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const [localVaultNetwork, setLocalVaultNetwork] =
    useState<VaultsListViewProps['selectedNetwork']>(selectedNetwork)
  const {
    state: { sumrNetApyConfig, slippageConfig },
  } = useLocalConfig()
  const networkFilteredVaults = useMemo(
    () =>
      localVaultNetwork && localVaultNetwork !== 'all-networks'
        ? vaultsList.filter(({ protocol }) => protocol.network === localVaultNetwork)
        : vaultsList,
    [localVaultNetwork, vaultsList],
  )
  const sdk = useAppSDK()
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const [vaultId, setVaultId] = useState<string | undefined>(networkFilteredVaults[0].id)

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
    () => vaultsList.find((vault) => vault.id === vaultId),
    [vaultsList, vaultId],
  )

  const vaultData = selectedVaultData ?? networkFilteredVaults[0]
  const { userWalletAddress } = useUserWallet()

  const positionExists = usePosition({
    chainId: subgraphNetworkToSDKId(vaultData.protocol.network),
    vaultId: vaultData.id,
    onlyActive: true,
  })

  const { handleTokenSelectionChange, selectedTokenOption, tokenOptions } = useTokenSelector({
    vault: vaultData,
    chainId: subgraphNetworkToSDKId(vaultData.protocol.network),
  })

  const tokenBalances = useTokenBalances({
    tokenSymbol: selectedTokenOption.value,
    network: vaultData.protocol.network,
    vaultTokenSymbol: vaultData.inputToken.symbol,
  })

  const handleChangeNetwork = (selected: DropdownRawOption) => {
    setLocalVaultNetwork(selected.value as VaultsListViewProps['selectedNetwork'])
    switch (selected.value) {
      case 'all-networks':
        softRouterPush('/earn')

        break

      default:
        if (selectedVaultData && selectedVaultData.protocol.network !== selected.value) {
          setVaultId(undefined)
        }
        softRouterPush(`/earn/${sdkNetworkToHumanNetwork(selected.value as SDKNetwork)}`)

        break
    }
  }

  const handleChangeVault = (nextVaultId: string) => {
    setVaultId(nextVaultId)
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
    () =>
      new Set(
        vaultsList.reduce<string[]>(
          (acc, { arks }) => [
            // converting a list which looks like `protocolName-token-chainId`
            // into a unique list of protocols for all vaults
            ...acc,
            ...arks
              .map((ark) => ark.name?.split('-')[0])
              .filter((arkName): arkName is string => Boolean(arkName)),
          ],
          [],
        ),
      ),
    [vaultsList],
  )

  // -1 because BufferArk is not a protocol
  const formattedProtocolsSupportedCount = formattedProtocolsSupportedList.size - 1

  const {
    amountParsed,
    manualSetAmount,
    amountDisplay,
    amountDisplayUSD,
    handleAmountChange,
    onBlur,
    onFocus,
  } = useAmount({
    vault: vaultData,
    selectedToken:
      tokenBalances.token ??
      ({
        decimals: vaultData.inputToken.decimals,
      } as IToken),
  })

  const { amountDisplayUSDWithSwap, rawToTokenAmount } = useAmountWithSwap({
    vault: vaultData,
    vaultChainId: subgraphNetworkToSDKId(vaultData.protocol.network),
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
      topContent={
        <SimpleGrid
          columns={isMobile ? 1 : 3}
          rows={isMobile ? 3 : 1}
          style={{ justifyItems: 'stretch' }}
          gap={isMobile ? 16 : 170}
        >
          <DataBlock
            title="Total Assets"
            // TODO: fill data
            titleTooltip="Tooltip about assets or something"
            size="large"
            value={`$${formattedTotalAssets}`}
          />

          <DataBlock
            title="Total Liquidity"
            // TODO: fill data
            titleTooltip="Tooltip about liquidity or something"
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
              Choose a strategy
            </Text>
          </div>
          {networkFilteredVaults.map((vault, vaultIndex) => (
            <VaultCard
              key={vault.id}
              {...vault}
              withHover
              selected={vaultId === vault.id || (!vaultId && vaultIndex === 0)}
              onClick={handleChangeVault}
              withTokenBonus={sumrNetApyConfig.withSumr}
              sumrPrice={estimatedSumrPrice}
            />
          ))}
        </>
      }
      rightContent={
        <VaultSimulationForm
          vaultData={vaultData}
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
        />
      }
    />
  )
}
