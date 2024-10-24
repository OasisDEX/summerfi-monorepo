'use client'
import { type ChangeEvent, useState } from 'react'
import { getStrategyUrl, Sidebar, SidebarFootnote, sidebarFootnote } from '@summerfi/app-earn-ui'
import {
  type DropdownOption,
  type SDKVaultsListType,
  type SDKVaultType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatCryptoBalance, mapNumericInput } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import { capitalize } from 'lodash-es'

import type { FleetConfig } from '@/helpers/sdk/types'

enum Action {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export type FormProps = {
  fleetConfig: FleetConfig
  selectedStrategyData: SDKVaultType
  strategiesList: SDKVaultsListType
}

const Form = ({ fleetConfig: _fleetConfig, selectedStrategyData, strategiesList }: FormProps) => {
  const options: DropdownOption[] = [
    ...[...new Set(strategiesList.map((strategy) => strategy.inputToken.symbol))].map((symbol) => ({
      tokenSymbol: symbol as TokenSymbolsList,
      label: symbol,
      value: symbol,
    })),
  ]

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
    options.find((option) => option.value === selectedStrategyData?.inputToken.symbol) ?? options[0]

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
      // TODO: fill data
      value: `67,353 ${selectedStrategyData?.inputToken.symbol}`,
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
