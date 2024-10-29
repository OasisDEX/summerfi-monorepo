'use client'
import { type ChangeEvent, useState } from 'react'
import {
  getVaultUrl,
  InputWithDropdown,
  ProjectedEarnings,
  Sidebar,
  SidebarFootnote,
  sidebarFootnote,
} from '@summerfi/app-earn-ui'
import {
  type DropdownOption,
  type SDKVaultishType,
  type SDKVaultsListType,
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
  vaultData: SDKVaultishType
  vaultsList: SDKVaultsListType
}

export const Form = ({ fleetConfig: _fleetConfig, vaultData, vaultsList }: FormProps) => {
  const options: DropdownOption[] = [
    ...[...new Set(vaultsList.map((vault) => vault.inputToken.symbol))].map((symbol) => ({
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
    options.find((option) => option.value === vaultData.inputToken.symbol) ?? options[0]

  const balance = new BigNumber(123123)
  const token = dropdownValue.label

  const inputValue = amountValue ?? ''

  const sidebarProps = {
    title: capitalize(action),
    content: (
      <>
        <InputWithDropdown
          value={inputValue}
          secondaryValue={`$${inputValue}`}
          handleChange={handleChange}
          options={options}
          dropdownValue={dropdownValue}
          heading={{
            label: 'Balance',
            value: `${formatCryptoBalance(balance)} ${token}`,
            // eslint-disable-next-line no-console
            action: () => console.log('clicked'),
          }}
        />
        <ProjectedEarnings
          earnings="1353"
          symbol={vaultData.inputToken.symbol as TokenSymbolsList}
        />
      </>
    ),

    primaryButton: {
      label: 'Get Started',
      url: getVaultUrl(vaultData),
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
