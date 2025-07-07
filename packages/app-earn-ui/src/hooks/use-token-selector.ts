'use client'
import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from 'react'
import {
  type DropdownOption,
  type DropdownRawOption,
  type SDKVaultishType,
  type TokenSymbolsList,
} from '@summerfi/app-types'

import { getSwapTokens } from '@/constants/swap-tokens'
import { getDisplayToken } from '@/helpers/get-display-token'

type TokenSelectorProps = {
  vault: SDKVaultishType
  chainId: number
}

/**
 * Custom hook to manage token selection for a given vault.
 *
 * @param {TokenSelectorProps} props - The properties for the hook.
 * @param {SDKVaultishType} props.vault - The vault object containing the input token.
 * @param {number} props.chainId - The chain ID for the vault.
 * @returns {Object} An object containing token options, the selected token option, and a handler to change the selected token.
 * @returns {DropdownOption[]} return.tokenOptions - The list of token options available for selection.
 * @returns {DropdownOption} return.selectedTokenOption - The currently selected token option.
 * @returns {Function} return.handleTokenSelectionChange - The function to handle changes in token selection.
 */
export const useTokenSelector = ({
  vault,
  chainId,
}: TokenSelectorProps): {
  tokenOptions: DropdownOption[]
  baseTokenOptions: DropdownOption[]
  selectedTokenOption: DropdownOption
  handleTokenSelectionChange: (option: DropdownRawOption) => void
  setSelectedTokenOption: Dispatch<SetStateAction<DropdownOption>>
} => {
  const baseTokenOptions = useMemo(() => {
    return [vault.inputToken.symbol].map((symbol) => ({
      tokenSymbol: symbol as TokenSymbolsList,
      label: symbol,
      value: symbol,
    })) as DropdownOption[]
  }, [vault.inputToken.symbol])

  const tokenOptions = useMemo(() => {
    const options: DropdownOption[] = [...baseTokenOptions]

    const tokens = getSwapTokens(chainId)

    tokens.forEach((token) => {
      if (token !== vault.inputToken.symbol) {
        options.push({
          tokenSymbol: token as TokenSymbolsList,
          label: token,
          value: token,
        })
      }
    })

    return options
  }, [vault.inputToken.symbol, chainId])

  const [selectedTokenOption, setSelectedTokenOption] = useState(() => {
    if (tokenOptions.length === 0) {
      throw new Error('No token options available')
    }

    return (
      tokenOptions.find((option) => option.value === getDisplayToken(vault.inputToken.symbol)) ??
      tokenOptions[0]
    )
  })

  // when changing tokenOptions validate the selected token
  useEffect(() => {
    setSelectedTokenOption((selectedOption) => {
      return (
        tokenOptions.find((option) => option.value === getDisplayToken(selectedOption.value)) ??
        tokenOptions[0]
      )
    })
  }, [tokenOptions])

  const handleTokenSelectionChange = (option: DropdownRawOption): void => {
    const value = tokenOptions.find((opt) => opt.value === option.value) ?? tokenOptions[0]

    setSelectedTokenOption(value)
  }

  return {
    tokenOptions,
    baseTokenOptions,
    selectedTokenOption,
    handleTokenSelectionChange,
    setSelectedTokenOption,
  }
}
