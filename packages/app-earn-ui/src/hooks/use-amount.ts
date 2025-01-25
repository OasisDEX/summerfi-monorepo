'use client'
import { type ChangeEvent, useEffect, useMemo, useState } from 'react'
import { type IToken } from '@summerfi/app-types'
import { formatFiatBalance } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

type UseAmountProps = {
  tokenDecimals: number
  tokenPrice: string | null | undefined
  selectedToken: IToken | undefined
  initialAmount?: string
}

const MAX_AMOUNT_LENGTH = 20

/**
 * Hook for managing amount input with formatting and validation for vault interactions.
 *
 * @param tokenDecimals - Token decimals
 * @param tokenPrice - Token price
 * @param selectedToken - Token selected for the transaction
 * @param initialAmount - Optional initial amount to populate the input
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
  tokenDecimals,
  tokenPrice,
  selectedToken,
  initialAmount,
}: UseAmountProps) => {
  const [editMode, setEditMode] = useState(false)
  const [amountRaw, setAmountRaw] = useState<string | undefined>(initialAmount)

  const amountDisplay = useMemo(() => {
    if (!amountRaw && amountRaw !== '0') {
      return '0'
    }

    if (new BigNumber(amountRaw).isNaN() || editMode) {
      return amountRaw
    }

    const amountWithNoFollowingZeroes = new BigNumber(
      // double parsing removes zeroes at the end
      new BigNumber(amountRaw).toFixed(tokenDecimals), // and this gives it a "max" decimals
    ).toString()

    return amountWithNoFollowingZeroes
  }, [amountRaw, editMode, tokenDecimals])

  const amountDisplayUSD = useMemo(() => {
    if (!tokenPrice) {
      return '-'
    }
    if (!amountRaw && amountRaw !== '0') {
      return '$0.00'
    }

    return `$${formatFiatBalance(new BigNumber(amountDisplay).times(new BigNumber(tokenPrice)))}`
  }, [amountDisplay, amountRaw, tokenPrice])

  useEffect(() => {
    if (!editMode) {
      setAmountRaw(amountDisplay)
    }
  }, [editMode, amountDisplay])

  const amountParsed = useMemo(() => {
    if (!amountRaw || new BigNumber(amountRaw).isNaN()) {
      return new BigNumber(0)
    }

    return new BigNumber(amountRaw)
  }, [amountRaw])

  const handleAmountChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target

    if (value.length > MAX_AMOUNT_LENGTH) {
      ev.stopPropagation()
      ev.preventDefault()

      return
    }

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
    manualSetAmount: setAmountRaw,
    onFocus: () => setEditMode(true),
    onBlur: () => setEditMode(false),
  }
}
