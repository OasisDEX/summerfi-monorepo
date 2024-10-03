import React, { type ChangeEvent, useState } from 'react'
import { Button, Card, Icon, Pill, Text, Tooltip } from '@summerfi/app-earn-ui'
import { type DropdownOption, type Risk, type TokenSymbolsList } from '@summerfi/app-types'
import { mapNumericInput } from '@summerfi/app-utils'

import { InputWithDropdown } from '@/components/molecues/InputWithDropdown/InputWithDropdown'
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
      <Card className={classNames.strategyCard} variant="cardPrimary">
        <div className={classNames.depositCardHeaderWrapper}>
          <Text as="h5" variant="h5" style={{ color: 'white' }}>
            Deposit
          </Text>
        </div>

        <div className={classNames.depositCardHeaderSpacer} />
        <InputWithDropdown
          value={value}
          handleChange={handleChange}
          options={options}
          dropdownValue={dropdownValue}
        />
        <Card className={classNames.bannerWrapper} variant="cardSecondary">
          <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
            Estimated earnings after 1 year
          </Text>
          <Text as="p" variant="p1semiColorful">
            67,353 USDC
          </Text>
        </Card>
        <Button
          variant="primaryLarge"
          style={{ marginBottom: 'var(--general-space-20)', width: '100%' }}
        >
          Get started
        </Button>
        <div className={classNames.footerWrapper}>
          <Tooltip
            tooltip="Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
            showAbove
          >
            <Icon iconName="question_o" variant="xs" color="rgba(255, 73, 164, 1)" />
          </Tooltip>
          <Text as="p" variant="p4" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            Key details about your assets
          </Text>
        </div>
      </Card>
    </div>
  )
}
