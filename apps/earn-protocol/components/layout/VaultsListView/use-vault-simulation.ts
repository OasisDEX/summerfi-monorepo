'use client'

import {
  useAmount,
  useAmountWithSwap,
  useLocalConfig,
  useTokenSelector,
} from '@summerfi/app-earn-ui'
import {
  type DropdownRawOption,
  type IToken,
  type SDKVaultishType,
  TransactionAction,
} from '@summerfi/app-types'
import { slugifyVault, subgraphNetworkToSDKId, supportedSDKNetwork } from '@summerfi/app-utils'

import { getResolvedForecastAmountParsed } from '@/helpers/get-resolved-forecast-amount-parsed'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useHandleDropdownChangeEvent, useHandleInputChangeEvent } from '@/hooks/use-mixpanel-event'
import { usePosition } from '@/hooks/use-position'
import { useTokenBalances } from '@/hooks/use-tokens-balances'

// All deposit-simulation state for the currently selected vault (the right sidebar). Kept
// together because the token selector + balances are also driven by clicking a vault card.
export const useVaultSimulation = (activeVaultData: SDKVaultishType) => {
  const sdk = useAppSDK()
  const inputChangeHandler = useHandleInputChangeEvent()
  const dropdownChangeHandler = useHandleDropdownChangeEvent()
  const {
    state: { slippageConfig },
  } = useLocalConfig()

  const vaultChainId = subgraphNetworkToSDKId(supportedSDKNetwork(activeVaultData.protocol.network))

  const { position: positionExists, isLoading } = usePosition({
    chainId: vaultChainId,
    vaultId: activeVaultData.id,
    onlyActive: true,
    cached: true,
  })

  const { handleTokenSelectionChange, selectedTokenOption, tokenOptions, setSelectedTokenOption } =
    useTokenSelector({
      vault: activeVaultData,
      chainId: vaultChainId,
    })

  const tokenBalances = useTokenBalances({
    tokenSymbol: selectedTokenOption.value,
    network: supportedSDKNetwork(activeVaultData.protocol.network),
    vaultTokenSymbol: activeVaultData.inputToken.symbol,
    cached: true,
  })

  // wrapper to show skeleton immediately when changing token
  const handleTokenSelectionChangeWrapper = (option: DropdownRawOption) => {
    dropdownChangeHandler({
      inputName: `vault-list-token-selector-${slugifyVault(activeVaultData)}`,
      value: option.value,
    })
    tokenBalances.handleSetTokenBalanceLoading(true)
    handleTokenSelectionChange(option)
  }

  const {
    amountParsed,
    manualSetAmount,
    amountDisplay,
    amountDisplayUSD,
    handleAmountChange,
    onBlur,
    onFocus,
  } = useAmount({
    inputName: `vault-list-amount-${slugifyVault(activeVaultData)}`,
    inputChangeHandler,
    tokenDecimals: activeVaultData.inputToken.decimals,
    tokenPrice: activeVaultData.inputTokenPriceUSD,
    selectedToken:
      tokenBalances.token ??
      ({
        decimals: activeVaultData.inputToken.decimals,
      } as IToken),
  })

  const { amountDisplayUSDWithSwap, rawToTokenAmount } = useAmountWithSwap({
    vault: activeVaultData,
    vaultChainId,
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

  return {
    positionExists,
    isLoading,
    selectedTokenOption,
    tokenOptions,
    setSelectedTokenOption,
    handleTokenSelectionChangeWrapper,
    tokenBalances,
    amountParsed,
    manualSetAmount,
    amountDisplay,
    amountDisplayUSDWithSwap,
    handleAmountChange,
    onBlur,
    onFocus,
    resolvedForecastAmount,
  }
}

export type VaultSimulation = ReturnType<typeof useVaultSimulation>
