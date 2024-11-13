'use client'

import { useMemo, useState } from 'react'
import {
  type DropdownOption,
  type SDKVaultishType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatCryptoBalance, mapNumericInput } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { sidebarFootnote } from '@/common/sidebar/footnote'
import { InputWithDropdown } from '@/components/molecules/InputWithDropdown/InputWithDropdown'
import { ProjectedEarnings } from '@/components/molecules/ProjectedEarnings/ProjectedEarnings'
import { SidebarFootnote } from '@/components/molecules/SidebarFootnote/SidebarFootnote'
import { Sidebar } from '@/components/organisms/Sidebar/Sidebar'
import { getVaultUrl } from '@/helpers/get-vault-url'

export type VaultSimulationFormProps = {
  vaultData: SDKVaultishType
}

export const VaultSimulationForm = ({ vaultData }: VaultSimulationFormProps) => {
  const [inputValue, setInputValue] = useState<string>('1000')

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value) {
      setInputValue(mapNumericInput(ev.target.value))
    }
  }

  const estimatedEarnings = useMemo(() => {
    if (!vaultData.calculatedApr) return 0

    return formatCryptoBalance(
      new BigNumber(
        Number(inputValue.replaceAll(',', '')) * (Number(vaultData.calculatedApr) / 100),
      ),
    )
  }, [vaultData, inputValue])

  const dropdownLockedValue = useMemo(() => {
    return {
      tokenSymbol: vaultData.inputToken.symbol,
      label: vaultData.inputToken.symbol,
      value: vaultData.inputToken.symbol,
    } as DropdownOption
  }, [vaultData])

  const balance = new BigNumber(123123)
  const token = vaultData.inputToken.symbol

  return (
    <Sidebar
      {...{
        title: 'Deposit',
        content: (
          <>
            <InputWithDropdown
              value={inputValue}
              secondaryValue={`$${inputValue}`}
              handleChange={handleInputChange}
              options={[dropdownLockedValue]}
              dropdownValue={dropdownLockedValue}
              heading={{
                label: 'Balance',
                value: `${formatCryptoBalance(balance)} ${token}`,
                // eslint-disable-next-line no-console
                action: () => console.log('clicked'),
              }}
            />
            <ProjectedEarnings
              earnings={estimatedEarnings}
              symbol={vaultData.inputToken.symbol as TokenSymbolsList}
            />
          </>
        ),
        primaryButton: {
          label: 'Get Started',
          url: getVaultUrl(vaultData),
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
