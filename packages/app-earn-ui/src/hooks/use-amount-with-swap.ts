'use client'
import { useMemo } from 'react'
import {
  type DropdownOption,
  type SdkClient,
  type SDKVaultishType,
  TransactionAction,
} from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'

import { useSwapQuote } from './use-swap-quote'

type UseAmountProps = {
  vault: SDKVaultishType
  vaultChainId: number
  amountDisplay: string
  amountDisplayUSD: string
  transactionType: TransactionAction
  selectedTokenOption: DropdownOption
  slippageConfig: { slippage: string }
  sdk: SdkClient
}

/**
 * Hook that handles token swap calculations for vault deposits and withdrawals.
 *
 * @param vault - Vault instance from SDK
 * @param vaultChainId - Chain ID where the vault is deployed
 * @param amountDisplay - Amount to swap in crypto units
 * @param amountDisplayUSD - Amount in USD
 * @param transactionType - Type of transaction (deposit/withdraw)
 * @param selectedTokenOption - Selected token from dropdown
 * @param slippageConfig - Slippage configuration object containing slippage percentage
 * @param sdk - SDK client instance
 *
 * @returns {Object} Swap details including:
 *   - fromTokenSymbol: Symbol of the token being swapped from
 *   - toTokenSymbol: Symbol of the token being swapped to
 *   - amountDisplayUSDWithSwap: Formatted amount after swap with token symbol
 *   - rawToTokenAmount: Raw BigNumber amount of the destination token
 *   - rawFromTokenAmount: Raw BigNumber amount of the source token
 */
export const useAmountWithSwap = ({
  vault,
  vaultChainId,
  amountDisplay,
  amountDisplayUSD,
  transactionType,
  selectedTokenOption,
  slippageConfig,
  sdk,
}: UseAmountProps) => {
  const fromTokenSymbol: string = useMemo(() => {
    return {
      [TransactionAction.DEPOSIT]: selectedTokenOption.value,
      [TransactionAction.WITHDRAW]: vault.inputToken.symbol,
    }[transactionType]
  }, [transactionType, selectedTokenOption.value, vault.inputToken.symbol])

  const toTokenSymbol: string = useMemo(() => {
    return {
      [TransactionAction.DEPOSIT]: vault.inputToken.symbol,
      [TransactionAction.WITHDRAW]: selectedTokenOption.value,
    }[transactionType]
  }, [transactionType, selectedTokenOption.value, vault.inputToken.symbol])

  const { quote, quoteLoading } = useSwapQuote({
    chainId: vaultChainId,
    fromTokenSymbol,
    fromAmount: amountDisplay,
    toTokenSymbol,
    slippage: Number(slippageConfig.slippage),
    sdk,
  })

  const amountDisplayUSDWithSwap = useMemo(() => {
    if (quoteLoading) {
      return 'Loading...'
    }

    if (quote === undefined) {
      return amountDisplayUSD
    }

    const amountWithSwap = {
      [TransactionAction.DEPOSIT]: `${formatCryptoBalance(quote.toTokenAmount.toBigNumber())} ${quote.toTokenAmount.token.symbol}`, // Display 2 decimal places for USD
      [TransactionAction.WITHDRAW]: `${formatCryptoBalance(quote.toTokenAmount.toBigNumber())} ${quote.toTokenAmount.token.symbol}`, // Cap decimals at 8 for better readability
    }[transactionType]

    return amountWithSwap
  }, [quote, quoteLoading, amountDisplayUSD, transactionType])

  return {
    fromTokenSymbol,
    toTokenSymbol,
    amountDisplayUSDWithSwap,
    rawToTokenAmount: quote?.toTokenAmount.toBigNumber(),
    rawFromTokenAmount: quote?.fromTokenAmount.toBigNumber(),
  }
}