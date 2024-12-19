import { useMemo } from 'react'
import { type DropdownOption, type SDKVaultishType, TransactionAction } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'

import { useSwapQuote } from './use-swap-quote'

type UseAmountProps = {
  vault: SDKVaultishType
  vaultChainId: number
  amountDisplay: string
  amountDisplayUSD: string
  transactionType: TransactionAction
  selectedTokenOption: DropdownOption
}

export const useAmountWithSwap = ({
  vault,
  vaultChainId,
  amountDisplay,
  amountDisplayUSD,
  transactionType,
  selectedTokenOption,
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
    slippage: 0.01,
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
  }
}
