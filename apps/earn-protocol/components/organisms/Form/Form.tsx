'use client'
import { type ChangeEvent, useState } from 'react'
import { Sidebar, SidebarFootnote, sidebarFootnote } from '@summerfi/app-earn-ui'
import { type DropdownOption } from '@summerfi/app-types'
import { formatCryptoBalance, mapNumericInput } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import { capitalize } from 'lodash-es'

import { strategiesList } from '@/constants/dev-strategies-list'
import type { FleetConfig } from '@/helpers/sdk/types'

enum Action {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export type FormProps = {
  fleetConfig: FleetConfig
  selectedStrategyData?: (typeof strategiesList)[number]
}

const options: DropdownOption[] = [
  ...[...new Set(strategiesList.map((strategy) => strategy.symbol))].map((symbol) => ({
    tokenSymbol: symbol,
    label: symbol,
    value: symbol,
  })),
]

const getStrategyUrl = (selectedStrategy?: (typeof strategiesList)[number]) => {
  if (!selectedStrategy) return ''

  return `/earn/${selectedStrategy.network}/open/${selectedStrategy.id}`
}

const Form = ({ fleetConfig: _fleetConfig, selectedStrategyData }: FormProps) => {
  const [action, setAction] = useState(Action.DEPOSIT)
  const [amountValue, setAmountValue] = useState<string>()

  const _unused = {
    setAction,
  }

  const confirmDisabled = !amountValue

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setAmountValue(mapNumericInput(ev.target.value))
  }

  const dropdownValue =
    options.find((option) => option.value === selectedStrategyData?.symbol) ?? options[0]

  const balance = new BigNumber(123123)
  const token = dropdownValue.label

  const sidebarProps = {
    title: capitalize(action),
    inputValue: amountValue ?? '',
    inputHeading: {
      label: 'Balance',
      value: `${formatCryptoBalance(balance)} ${token}`,
      // eslint-disable-next-line no-console
      action: () => console.log('clicked'),
    },
    dropdown: { value: dropdownValue, options },
    handleInputChange: handleChange,
    banner: {
      title: 'Estimated earnings after 1 year',
      value: `67,353 ${selectedStrategyData?.symbol}`,
    },
    primaryButton: {
      label: 'Get Started',
      url: getStrategyUrl(selectedStrategyData),
      disabled: confirmDisabled,
    },
    footnote: (
      <SidebarFootnote
        title={sidebarFootnote.title}
        list={sidebarFootnote.list}
        tooltip={sidebarFootnote.tooltip}
      />
    ),
  }

  return (
    <div>
      <Sidebar {...sidebarProps} />
    </div>
  )
}

export default Form
