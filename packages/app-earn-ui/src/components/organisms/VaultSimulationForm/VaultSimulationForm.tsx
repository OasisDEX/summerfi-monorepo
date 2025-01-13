'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  type DropdownOption,
  type DropdownRawOption,
  type SDKVaultishType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatFiatBalance,
  mapNumericInput,
  subgraphNetworkToSDKId,
} from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'
import Link from 'next/link'

import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { WithArrow } from '@/components/atoms/WithArrow/WithArrow'
import { InputWithDropdown } from '@/components/molecules/InputWithDropdown/InputWithDropdown'
import { ProjectedEarnings } from '@/components/molecules/ProjectedEarnings/ProjectedEarnings'
import { SidebarMobileHeader } from '@/components/molecules/SidebarMobileHeader/SidebarMobileHeader'
import { Sidebar } from '@/components/organisms/Sidebar/Sidebar'
import { useForecast } from '@/features/forecast/use-forecast'
import { getVaultUrl } from '@/helpers/get-vault-url'
import { useLocalStorageOnce } from '@/hooks/use-local-storage-once'

import classNames from './VaultSimulationForm.module.scss'

export type VaultSimulationFormProps = {
  vaultData: SDKVaultishType
  tokenSymbol: string
  tokenBalance?: BigNumber
  tokenPriceUSD?: number
  isTokenBalanceLoading?: boolean
  isMobile?: boolean
  tokenOptions: DropdownOption[]
  selectedTokenOption: DropdownOption
  handleTokenSelectionChange: (option: DropdownRawOption) => void
  hiddenHeaderChevron?: boolean
}

export const VaultSimulationForm = ({
  vaultData,
  tokenSymbol,
  tokenBalance,
  isTokenBalanceLoading,
  isMobile,
  tokenOptions,
  selectedTokenOption,
  handleTokenSelectionChange,
  hiddenHeaderChevron,
}: VaultSimulationFormProps) => {
  const [inputValue, setInputValue] = useState<string>(mapNumericInput('1000'))
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isGradientBorder, setIsGradientBorder] = useState(false)

  const rawInputValue = inputValue.replaceAll(',', '') || '0'

  const { isLoadingForecast, oneYearEarningsForecast } = useForecast({
    fleetAddress: vaultData.id,
    chainId: subgraphNetworkToSDKId(vaultData.protocol.network),
    amount: rawInputValue,
  })

  useEffect(() => {
    if (vaultData.id) {
      setIsGradientBorder(true)
      const timeout = setTimeout(() => {
        setIsGradientBorder(false)
      }, 3800)

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
    } else {
      setInputValue('')
    }
  }

  const estimatedEarnings = useMemo(() => {
    if (!oneYearEarningsForecast) return '0'

    return oneYearEarningsForecast
  }, [oneYearEarningsForecast])

  const balance = tokenBalance ? tokenBalance : undefined
  const tokenPrice = vaultData.inputTokenPriceUSD ? Number(vaultData.inputTokenPriceUSD) : undefined
  const balanceSymbol = tokenSymbol

  return (
    <div style={{ position: 'relative', width: '100%', padding: '2px' }}>
      <Sidebar
        {...{
          title: 'Deposit',
          content: (
            <>
              <InputWithDropdown
                value={inputValue}
                secondaryValue={
                  inputValue.length && tokenPrice
                    ? `$${formatFiatBalance(Number(inputValue.replaceAll(',', '')) * tokenPrice)}`
                    : ''
                }
                handleChange={handleInputChange}
                handleDropdownChange={handleTokenSelectionChange}
                options={tokenOptions}
                dropdownValue={selectedTokenOption}
                heading={{
                  label: 'Balance',
                  value: isTokenBalanceLoading ? (
                    <SkeletonLine width={60} height={10} />
                  ) : balance ? (
                    `${formatCryptoBalance(balance)} ${balanceSymbol}`
                  ) : (
                    `-`
                  ),
                  // eslint-disable-next-line no-console
                  action: () => setInputValue(mapNumericInput(balance?.toString() ?? '1000')),
                }}
              />
              <ProjectedEarnings
                earnings={estimatedEarnings}
                symbol={vaultData.inputToken.symbol as TokenSymbolsList}
                isLoading={isLoadingForecast}
              />
            </>
          ),
          customHeader:
            !isDrawerOpen && isMobile ? (
              <SidebarMobileHeader
                type="open"
                amount={estimatedEarnings}
                token={vaultData.inputToken.symbol}
                isLoadingForecast={isLoadingForecast}
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
        hiddenHeaderChevron={hiddenHeaderChevron}
      />
      {isGradientBorder && <div className={classNames.cardAnimateGradientBorder} />}
    </div>
  )
}
