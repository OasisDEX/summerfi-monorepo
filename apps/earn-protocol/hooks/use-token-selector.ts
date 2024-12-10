import { useState } from 'react'
import {
  type DropdownOption,
  type DropdownRawOption,
  type SDKVaultishType,
  type TokenSymbolsList,
} from '@summerfi/app-types'

type UseAmountProps = {
  vault: SDKVaultishType
}

// For swap testing purposes only adding testToken to dropdown
const testTokens = ['USDBC']

export const useTokenSelector = ({ vault }: UseAmountProps) => {
  const tokenOptions: DropdownOption[] = [
    ...[vault.inputToken.symbol].map((symbol) => ({
      tokenSymbol: symbol as TokenSymbolsList,
      label: symbol,
      value: symbol,
    })),
  ]

  testTokens.forEach((testToken) => {
    if (testToken !== vault.inputToken.symbol) {
      tokenOptions.push({
        tokenSymbol: testToken as TokenSymbolsList,
        label: testToken,
        value: testToken,
      })
    }
  })

  const [selectedTokenOption, setSelectedTokenOption] = useState(
    tokenOptions.find((option) => option.value === vault.inputToken.symbol) ?? tokenOptions[0],
  )
  const handleTokenSelectionChange = (option: DropdownRawOption) => {
    const value = tokenOptions.find((opt) => opt.value === option.value) ?? tokenOptions[0]

    setSelectedTokenOption(value)
  }

  return {
    tokenOptions,
    selectedTokenOption,
    handleTokenSelectionChange,
  }
}
