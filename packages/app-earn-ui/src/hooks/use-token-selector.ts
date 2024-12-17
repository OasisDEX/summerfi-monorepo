'use client'
import { useMemo, useState } from 'react'
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
const testTokens = ['USDBC', 'WSTETH']

/**
 * Custom hook to manage token selection for a given vault.
 *
 * @param {UseAmountProps} props - The properties for the hook.
 * @param {SDKVaultishType} props.vault - The vault object containing the input token.
 * @returns {Object} An object containing token options, the selected token option, and a handler to change the selected token.
 * @returns {DropdownOption[]} return.tokenOptions - The list of token options available for selection.
 * @returns {DropdownOption} return.selectedTokenOption - The currently selected token option.
 * @returns {Function} return.handleTokenSelectionChange - The function to handle changes in token selection.
 */
export const useTokenSelector = ({ vault }: UseAmountProps) => {
  const tokenOptions = useMemo(() => {
    const options: DropdownOption[] = [
      ...[vault.inputToken.symbol].map((symbol) => ({
        tokenSymbol: symbol as TokenSymbolsList,
        label: symbol,
        value: symbol,
      })),
    ]

    testTokens.forEach((testToken) => {
      if (testToken !== vault.inputToken.symbol) {
        options.push({
          tokenSymbol: testToken as TokenSymbolsList,
          label: testToken,
          value: testToken,
        })
      }
    })

    return options
  }, [vault.inputToken.symbol])

  const [selectedTokenOption, setSelectedTokenOption] = useState(() => {
    if (tokenOptions.length === 0) {
      throw new Error('No token options available')
    }

    return (
      tokenOptions.find((option) => option.value === vault.inputToken.symbol) ?? tokenOptions[0]
    )
  })
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
