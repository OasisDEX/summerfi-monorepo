'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  type DropdownOption,
  type SDKVaultishType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatCryptoBalance, mapNumericInput } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { WithArrow } from '@/components/atoms/WithArrow/WithArrow.tsx'
import { InputWithDropdown } from '@/components/molecules/InputWithDropdown/InputWithDropdown'
import { ProjectedEarnings } from '@/components/molecules/ProjectedEarnings/ProjectedEarnings'
import { SidebarMobileHeader } from '@/components/molecules/SidebarMobileHeader/SidebarMobileHeader.tsx'
import { Sidebar } from '@/components/organisms/Sidebar/Sidebar'
import { getVaultUrl } from '@/helpers/get-vault-url'
import { useLocalStorageOnce } from '@/hooks/use-local-storage-once'

import classNames from './VaultSimulationForm.module.scss'

export type VaultSimulationFormProps = {
  vaultData: SDKVaultishType
  isMobile?: boolean
}

export const VaultSimulationForm = ({ vaultData, isMobile }: VaultSimulationFormProps) => {
  const [inputValue, setInputValue] = useState<string>('1000')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isGradientBorder, setIsGradientBorder] = useState(false)

  useEffect(() => {
    if (vaultData.id) {
      setIsGradientBorder(true)
      const timeout = setTimeout(() => {
        setIsGradientBorder(false)
      }, 1000)

      return () => {
        setIsGradientBorder(false)
        clearTimeout(timeout)
      }
    }

    return () => null
  }, [vaultData.id])

  const { setStorageOnce } = useLocalStorageOnce({
    key: `${vaultData.id}-amount`,
  })

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value) {
      setInputValue(mapNumericInput(ev.target.value))
    }
  }

  const estimatedEarnings = useMemo(() => {
    if (!vaultData.calculatedApr) return '0'

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
    <div style={{ position: 'relative', width: '100%', padding: '1px' }}>
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
          customHeader:
            !isDrawerOpen && isMobile ? (
              <SidebarMobileHeader
                type="open"
                amount={estimatedEarnings}
                token={vaultData.inputToken.symbol}
              />
            ) : undefined,
          customHeaderStyles:
            !isDrawerOpen && isMobile ? { padding: 'var(--general-space-12) 0' } : undefined,
          handleIsDrawerOpen: (flag: boolean) => setIsDrawerOpen(flag),
          primaryButton: {
            label: 'Get Started',
            url: getVaultUrl(vaultData),
            action: () => {
              setStorageOnce(Number(inputValue.replaceAll(',', '')))
            },
            disabled: false,
          },
          footnote: (
            <Link href={getVaultUrl(vaultData)}>
              <WithArrow>View strategy</WithArrow>
            </Link>
          ),
        }}
        isMobile={isMobile}
      />
      {isGradientBorder && <div className={classNames.cardAnimateGradientBorder} />}
    </div>
  )
}
