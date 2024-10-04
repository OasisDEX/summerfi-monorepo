import React, { type ChangeEvent, useState } from 'react'
import { Card, Pill, Sidebar, Text } from '@summerfi/app-earn-ui'
import { type DropdownOption, type Risk, type TokenSymbolsList } from '@summerfi/app-types'
import { mapNumericInput } from '@summerfi/app-utils'

import { StrategyWithRisk } from '@/components/molecues/StrategyWithRisk/StrategyWithRisk'

import classNames from '@/components/organisms/LandingPageStrategyPicker/LandingPageStrategyPicker.module.scss'

export const LandingPageStrategyPicker = ({
  apy,
  symbol,
  risk,
  totalAssets,
  bestFor,
  options,
}: {
  id: string
  apy: string
  symbol: TokenSymbolsList
  risk: Risk
  totalAssets: string
  bestFor: string
  options: DropdownOption[]
}) => {
  const [value, setValue] = useState(mapNumericInput('10000'))

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(mapNumericInput(e.target.value))
  }

  const dropdownValue = options.find((option) => option.value === symbol) || options[0]

  const sidebarProps = {
    title: 'Deposit',
    inputValue: value,
    dropdown: { value: dropdownValue, options },
    handleInputChange: handleChange,
    banner: {
      title: 'Estimated earnings after 1 year',
      value: '67,353 USDC',
    },
    primaryButton: {
      label: 'Get Started',
      action: () => null,
      disabled: false,
    },
    footnote: {
      title: 'Key details about your assets',
      tooltip: 'Lorem ipsum',
    },
  }

  return (
    <div className={classNames.wrapper}>
      <Card className={classNames.strategyCard} variant="cardPrimary">
        <div className={classNames.strategyCardHeaderWrapper}>
          <StrategyWithRisk symbol={symbol} risk={risk} />
          <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
            <Pill>APY {apy}%</Pill>
          </Text>
        </div>
        <div className={classNames.strategyCardAssetsWrapper}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              Total assets
            </Text>
            <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>${totalAssets}</Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              Best for
            </Text>
            <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>${bestFor}</Text>
          </div>
        </div>
      </Card>
      <Sidebar {...sidebarProps} />
    </div>
  )
}
