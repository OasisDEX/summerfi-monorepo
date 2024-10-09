'use client'
import { type ChangeEvent, useState } from 'react'
import { Box, Sidebar, SidebarFootnote, sidebarFootnote, Text } from '@summerfi/app-earn-ui'
import { type DropdownOption } from '@summerfi/app-types'
import { mapNumericInput } from '@summerfi/app-utils'
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

  const handleConfirm = async () => {
    return await Promise.resolve(null)
  }

  const dropdownValue =
    options.find((option) => option.value === selectedStrategyData?.symbol) ?? options[0]

  const sidebarProps = {
    title: capitalize(action),
    inputValue: amountValue ?? '',
    dropdown: { value: dropdownValue, options },
    handleInputChange: handleChange,
    banner: {
      title: 'Estimated earnings after 1 year',
      value: `67,353 ${selectedStrategyData?.symbol}`,
    },
    primaryButton: {
      label: 'Get Started',
      action: handleConfirm,
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
      {selectedStrategyData && (
        <Box
          style={{
            marginTop: 'var(--general-space-16)',
            minWidth: '100%',
            flexDirection: 'column',
          }}
          light
        >
          <Text variant="p4semi" style={{ textAlign: 'center' }}>
            DEBUG - Loaded Strategy Data
          </Text>
          <pre style={{ padding: '10px', margin: 0, fontSize: '12px' }}>
            {JSON.stringify(selectedStrategyData, null, 2)}
          </pre>
        </Box>
      )}
    </div>
  )
}

export default Form
