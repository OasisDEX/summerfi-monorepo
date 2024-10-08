'use client'

import { type ChangeEvent, useState } from 'react'
import { Sidebar, SidebarFootnote, sidebarFootnote, StrategyCard } from '@summerfi/app-earn-ui'
import { type DropdownOption } from '@summerfi/app-types'
import { mapNumericInput } from '@summerfi/app-utils'

import { strategiesList } from '@/constants/dev-strategies-list'

import classNames from '@/components/organisms/LandingPageStrategyPicker/LandingPageStrategyPicker.module.scss'

export const LandingPageStrategyPicker = ({
  strategy,
}: {
  strategy: (typeof strategiesList)[number]
}) => {
  const [value, setValue] = useState(mapNumericInput('10000'))

  const options: DropdownOption[] = [
    ...[...new Set(strategiesList.map(({ symbol }) => symbol))].map((symbol) => ({
      tokenSymbol: symbol,
      label: symbol,
      value: symbol,
    })),
  ]

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(mapNumericInput(e.target.value))
  }

  const dropdownValue = options.find((option) => option.value === strategy.symbol) ?? options[0]

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
      <StrategyCard {...strategy} />
      <Sidebar {...sidebarProps} />
    </div>
  )
}
