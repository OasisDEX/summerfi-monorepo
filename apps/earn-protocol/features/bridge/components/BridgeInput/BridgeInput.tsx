'use client'
import { useEffect, useState } from 'react'
import { InputWithDropdown } from '@summerfi/app-earn-ui'

import { QuickActionTags } from '@/features/bridge/components/QuickActionTags/QuickActionTags'

import styles from './BridgeInput.module.scss'

export interface BridgeInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  conversionRate?: number
}

const defaultOption = { label: 'SUMR', value: 'SUMR', tokenSymbol: 'SUMR' }

export const BridgeInput = ({
  value,
  onChange,
  placeholder = 'Enter amount',
  conversionRate = 0,
}: BridgeInputProps) => {
  const [usdValue, setUsdValue] = useState('0.00')

  useEffect(() => {
    const numericValue = parseFloat(value)
    if (!isNaN(numericValue) && conversionRate > 0) {
      setUsdValue((numericValue * conversionRate).toFixed(2))
    } else {
      setUsdValue('0.00')
    }
  }, [value, conversionRate])

  return (
    <div className={styles.inputSection}>
      <InputWithDropdown
        value={value}
        heading={{
          label: 'Balance',
          value: '100,000 SUMR',
        }}
        secondaryValue={`$${usdValue}`}
        handleChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        handleDropdownChange={() => {}}
        options={[defaultOption]}
        dropdownValue={defaultOption}
        selectAllOnFocus
        placeholder={placeholder}
        tagsRow={
          <QuickActionTags
            onSelect={(percentage) => {
              // handle percentage selection
            }}
          />
        }
      />
    </div>
  )
}
