'use client'
import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { type IToken } from '@summerfi/app-types'
import { cleanAmount, formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

type UseAmountProps = {
  tokenDecimals: number
  selectedToken?: IToken
  tokenPrice?: string | null
  initialAmount?: string
  inputChangeHandler: ({ inputName, value }: { inputName: string; value: string }) => void
  inputName: string
}

/**
 * Hook for managing amount input with formatting and validation for vault interactions.
 *
 * @param tokenDecimals - Token decimals
 * @param tokenPrice - Token price
 * @param selectedToken - Token selected for the transaction
 * @param initialAmount - Optional initial amount to populate the input
 * @param inputChangeHandler - Additional event handler for input changes (mixpanel events)
 * @param inputName - Name of the input field for event tracking
 *
 * @returns {Object} Amount management utilities:
 *   - amountRaw: String version of the amount as entered
 *   - amountParsed: BigNumber version of the amount
 *   - amountDisplay: Formatted string version for display (handles decimals)
 *   - amountDisplayUSD: USD value of the amount with $ prefix
 *   - handleAmountChange: Event handler for input changes with validation
 *   - manualSetAmount: Function to programmatically set the amount
 *   - onFocus: Handler to enable edit mode
 *   - onBlur: Handler to disable edit mode and format amount
 */
export const useAmount = ({
  tokenPrice,
  selectedToken,
  initialAmount,
  inputChangeHandler,
  inputName,
}: UseAmountProps): {
  /**
    A is a string version of the amount
  */
  amountRaw: string | undefined
  /**
    A parsed (bignumber) version of the amount
  */
  amountParsed: BigNumber
  /**
    A string version of the amount, formatted for display
  */
  amountDisplay: string
  amountDisplayUSD: string
  /**
    A function to handle changes to the amount (with event)
  */
  handleAmountChange: (ev: ChangeEvent<HTMLInputElement>) => void
  /**
    A function to manually set the amount
  */
  manualSetAmount: Dispatch<SetStateAction<string | undefined>>
  onFocus: () => void
  onBlur: () => void
  resetToInitialAmount: () => void
} => {
  const [editMode, setEditMode] = useState(false)
  const [amountRaw, setAmountRaw] = useState<string | undefined>(initialAmount)

  const resetToInitialAmount = useCallback(() => {
    if (initialAmount) {
      inputChangeHandler({
        inputName,
        value: `${initialAmount} ${selectedToken?.symbol}`,
      })
    }
    setAmountRaw(initialAmount)
  }, [initialAmount, inputChangeHandler, inputName, selectedToken])

  const amountDisplay = useMemo(() => {
    if (!amountRaw && amountRaw !== '0') {
      return '0'
    }

    if (new BigNumber(amountRaw).isNaN() || editMode) {
      return amountRaw
    }

    return formatCryptoBalance(amountRaw)
  }, [amountRaw, editMode])

  const amountDisplayUSD = useMemo(() => {
    if (!tokenPrice) {
      return '-'
    }
    if (!amountRaw && amountRaw !== '0') {
      return '$0.00'
    }

    return `$${formatFiatBalance(new BigNumber(amountRaw).times(new BigNumber(tokenPrice)))}`
  }, [amountRaw, tokenPrice])

  const amountParsed = useMemo(() => {
    if (!amountRaw || new BigNumber(cleanAmount(amountRaw)).isNaN()) {
      return new BigNumber(0)
    }

    return new BigNumber(cleanAmount(amountRaw))
  }, [amountRaw])

  const handleAmountChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const { value } = ev.target

    if (!value) {
      setAmountRaw(undefined)

      return
    }

    // replace 02 with 2 etc.
    if (/^0[0-9]+$/u.test(value)) {
      setAmountRaw(parseInt(value, 10).toString())

      return
    }

    if (!selectedToken) {
      return
    }

    const [, decimal] = value.split('.')

    if (
      // only one dot
      value.split('').filter((char) => char === '.').length > 1 ||
      // only numbers and dots
      /[^0-9.]/gu.test(value) ||
      // leading numbers max is selected token decimals
      (decimal || '').length > selectedToken.decimals
    ) {
      ev.stopPropagation()
      ev.preventDefault()

      return
    }
    inputChangeHandler({
      inputName,
      value: `${value.trim()} ${selectedToken.symbol}`,
    })
    setAmountRaw(value.trim())
  }

  return {
    /**
      A is a string version of the amount
    */
    amountRaw,
    /**
      A parsed (bignumber) version of the amount
    */
    amountParsed,
    /**
      A string version of the amount, formatted for display
    */
    amountDisplay,
    amountDisplayUSD,
    /**
      A function to handle changes to the amount (with event)
    */
    handleAmountChange,
    /**
      A function to manually set the amount
    */
    manualSetAmount: (value: string | undefined) => {
      inputChangeHandler({
        inputName,
        value: `${value?.trim() ?? '0'} ${selectedToken?.symbol}`,
      })
      setAmountRaw(value)
    },
    onFocus: () => setEditMode(true),
    onBlur: () => setEditMode(false),
    /**
      A function to reset the amount to the initial amount
    */
    resetToInitialAmount,
  }
}
