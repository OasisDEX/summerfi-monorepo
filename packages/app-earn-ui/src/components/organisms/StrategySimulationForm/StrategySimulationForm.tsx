'use client'

import { useMemo, useState } from 'react'
import { type DropdownOption, type SDKVaultishType } from '@summerfi/app-types'
import { formatCryptoBalance, mapNumericInput } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { sidebarFootnote } from '@/common/sidebar/footnote'
import { SidebarFootnote } from '@/components/molecules/SidebarFootnote/SidebarFootnote'
import { Sidebar } from '@/components/organisms/Sidebar/Sidebar'
import { getStrategyUrl } from '@/helpers/get-strategy-url'

export type StrategySimulationFormProps = {
  strategyData: SDKVaultishType
}

export const StrategySimulationForm = ({ strategyData }: StrategySimulationFormProps) => {
  const [inputValue, setInputValue] = useState<string>('1000')

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value) {
      setInputValue(mapNumericInput(ev.target.value))
    }
  }

  const estimatedEarnings = useMemo(() => {
    if (!strategyData?.calculatedApr) return 0

    return formatCryptoBalance(
      new BigNumber(
        Number(inputValue.replaceAll(',', '')) * (Number(strategyData?.calculatedApr) / 100),
      ),
    )
  }, [strategyData, inputValue])

  const dropdownLockedValue = useMemo(() => {
    return {
      tokenSymbol: strategyData?.inputToken.symbol,
      label: strategyData?.inputToken.symbol,
      value: strategyData?.inputToken.symbol,
    } as DropdownOption
  }, [strategyData])

  const balance = new BigNumber(123123)
  const token = strategyData?.inputToken.symbol

  return (
    <Sidebar
      {...{
        title: 'Deposit',
        inputValue,
        dropdown: { value: dropdownLockedValue, options: [dropdownLockedValue] },
        inputHeading: {
          label: 'Balance',
          value: `${formatCryptoBalance(balance)} ${token}`,
          // eslint-disable-next-line no-console
          action: () => console.log('clicked'),
        },
        handleInputChange,
        banner: {
          title: 'Estimated earnings after 1 year',
          value: `${estimatedEarnings} ${strategyData?.inputToken.symbol}`,
        },
        primaryButton: {
          label: 'Get Started',
          url: getStrategyUrl(strategyData),
          disabled: false,
        },
        footnote: (
          <SidebarFootnote
            title={sidebarFootnote.title}
            list={sidebarFootnote.list}
            tooltip={sidebarFootnote.tooltip}
          />
        ),
      }}
    />
  )
}
