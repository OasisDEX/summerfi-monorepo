import { type ChangeEvent, useEffect, useMemo, useState } from 'react'
import { type SDKVaultishType } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'

type UseAmountProps = {
  vault: SDKVaultishType
}

export const useAmount = ({ vault }: UseAmountProps) => {
  const vaultTokenDecimals = vault.inputToken.decimals

  const [editMode, setEditMode] = useState(false)
  const [amountRaw, setAmountRaw] = useState<string>()

  const amountDisplay = useMemo(() => {
    if (!amountRaw && amountRaw !== '0') {
      return '0.00'
    }

    if (new BigNumber(amountRaw).isNaN() || editMode) {
      return amountRaw
    }

    const amountWithNoFollowingZeroes = new BigNumber(
      // double parsing removes zeroes at the end
      new BigNumber(amountRaw).toFixed(vaultTokenDecimals), // and this gives it a "max" decimals
    ).toString()

    return amountWithNoFollowingZeroes
  }, [amountRaw, editMode, vaultTokenDecimals])

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

    if (!value) {
      setAmountRaw(undefined)

      return
    }
    const [integer, decimal] = value.split('.')

    if (integer.startsWith('0')) {
      ev.stopPropagation()
      ev.preventDefault()

      return
    }

    if (
      // only one dot
      value.split('').filter((char) => char === '.').length > 1 ||
      // only numbers and dots
      /[^0-9.]/gu.test(value) ||
      // leading numbers max is vaultTokenDecimals
      (decimal || '').length > vaultTokenDecimals
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