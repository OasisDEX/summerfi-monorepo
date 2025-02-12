'use client'
import React, { useEffect, useState } from 'react'
import { InputWithDropdown, Text } from '@summerfi/app-earn-ui'

// Define the props for AmountInput.
export interface AmountInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  conversionRate?: number // USD conversion factor (e.g., USD per token)
}

// Preset the dropdown option for our token (in this case, SUMR).
const defaultOption = { label: 'SUMR', value: 'SUMR', tokenSymbol: 'SUMR' }

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter amount',
  conversionRate = 0,
}) => {
  const [usdValue, setUsdValue] = useState('0.00')

  // Update the USD conversion display when value or conversionRate changes.
  useEffect(() => {
    const numericValue = parseFloat(value)
    if (!isNaN(numericValue) && conversionRate > 0) {
      setUsdValue((numericValue * conversionRate).toFixed(2))
    } else {
      setUsdValue('0.00')
    }
  }, [value, conversionRate])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {/* Reuse InputWithDropdown; the dropdown is preset and not meant to be changed */}
      <InputWithDropdown
        value={value}
        secondaryValue={`$${usdValue}`}
        handleChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        handleDropdownChange={() => {}}
        options={[defaultOption]}
        dropdownValue={defaultOption}
        selectAllOnFocus
        placeholder={placeholder}
      />
    </div>
  )
}

export default AmountInput
