import { type ChangeEvent, useState } from 'react'
import { Sidebar, SidebarFootnote, sidebarFootnote, StrategyCard } from '@summerfi/app-earn-ui'
import { type DropdownOption, type Risk, type TokenSymbolsList } from '@summerfi/app-types'
import { mapNumericInput } from '@summerfi/app-utils'

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
    footnote: (
      <SidebarFootnote
        title={sidebarFootnote.title}
        list={sidebarFootnote.list}
        tooltip={{ style: sidebarFootnote.tooltip.style, showAbove: true }}
      />
    ),
  }

  return (
    <div className={classNames.wrapper}>
      <StrategyCard
        apy={apy}
        bestFor={bestFor}
        symbol={symbol}
        risk={risk}
        totalAssets={totalAssets}
      />
      <Sidebar {...sidebarProps} />
    </div>
  )
}
