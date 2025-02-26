'use client'

import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from 'react'
import {
  type DropdownOption,
  type DropdownRawOption,
  type SDKVaultishType,
} from '@summerfi/app-types'
import { sdkNetworkToHumanNetwork, subgraphNetworkToSDKId } from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'
import { capitalize } from 'lodash-es'
import Link from 'next/link'

import { WithArrow } from '@/components/atoms/WithArrow/WithArrow'
import { SidebarMobileHeader } from '@/components/molecules/SidebarMobileHeader/SidebarMobileHeader'
import { ControlsDepositWithdraw } from '@/components/organisms/ControlsDepositWithdraw/ControlsDepositWithdraw'
import { Sidebar } from '@/components/organisms/Sidebar/Sidebar'
import { useForecast } from '@/features/forecast/use-forecast'
import { getDisplayToken } from '@/helpers/get-display-token'
import { getVaultUrl } from '@/helpers/get-vault-url'
import { useLocalStorageOnce } from '@/hooks/use-local-storage-once'

import classNames from './VaultSimulationForm.module.scss'

export type VaultSimulationFormProps = {
  vaultData: SDKVaultishType
  tokenBalance?: BigNumber
  tokenPriceUSD?: number
  isTokenBalanceLoading?: boolean
  isMobile?: boolean
  tokenOptions: DropdownOption[]
  selectedTokenOption: DropdownOption
  handleTokenSelectionChange: (option: DropdownRawOption) => void
  hiddenHeaderChevron?: boolean
  handleAmountChange: (ev: React.ChangeEvent<HTMLInputElement>) => void
  inputProps: {
    onFocus: () => void
    onBlur: () => void
    amountDisplay: string
    amountDisplayUSDWithSwap: string
    manualSetAmount: Dispatch<SetStateAction<string | undefined>>
  }
  resolvedForecastAmount: BigNumber
  amountParsed: BigNumber
  isEarnApp?: boolean
  positionExists?: boolean
  userWalletAddress?: string
  isLoading?: boolean
}

export const VaultSimulationForm = ({
  vaultData,
  tokenBalance,
  isTokenBalanceLoading,
  isMobile,
  tokenOptions,
  selectedTokenOption,
  handleTokenSelectionChange,
  hiddenHeaderChevron,
  handleAmountChange,
  inputProps: { onFocus, onBlur, amountDisplay, amountDisplayUSDWithSwap, manualSetAmount },
  resolvedForecastAmount,
  amountParsed,
  isEarnApp,
  positionExists,
  userWalletAddress,
  isLoading = false,
}: VaultSimulationFormProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isGradientBorder, setIsGradientBorder] = useState(false)

  const { isLoadingForecast, oneYearEarningsForecast } = useForecast({
    fleetAddress: vaultData.id,
    chainId: subgraphNetworkToSDKId(vaultData.protocol.network),
    amount: resolvedForecastAmount.toString(),
    isEarnApp,
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

  const estimatedEarnings = useMemo(() => {
    if (!oneYearEarningsForecast) return '0'

    return oneYearEarningsForecast
  }, [oneYearEarningsForecast])

  const vaultUrl = !isEarnApp ? `/earn${getVaultUrl(vaultData)}` : getVaultUrl(vaultData)

  return (
    <div style={{ position: 'relative', width: '100%', padding: '2px' }}>
      <Sidebar
        {...{
          title: 'Deposit',
          subtitle: isEarnApp
            ? `Deposit  ${getDisplayToken(vaultData.inputToken.symbol)} on ${capitalize(sdkNetworkToHumanNetwork(vaultData.protocol.network))}`
            : undefined,
          content: (
            <ControlsDepositWithdraw
              amountDisplay={amountDisplay}
              amountDisplayUSD={amountDisplayUSDWithSwap}
              handleAmountChange={handleAmountChange}
              handleDropdownChange={handleTokenSelectionChange}
              options={tokenOptions}
              dropdownValue={selectedTokenOption}
              onFocus={onFocus}
              onBlur={onBlur}
              tokenSymbol={selectedTokenOption.value}
              tokenBalance={isEarnApp ? tokenBalance : undefined}
              tokenBalanceLoading={!!isEarnApp && !!isTokenBalanceLoading}
              manualSetAmount={manualSetAmount}
              vault={vaultData}
              estimatedEarnings={estimatedEarnings}
              isLoadingForecast={isLoadingForecast}
              ownerView
              isSimulation
            />
          ),
          customHeader:
            !isDrawerOpen && isMobile ? (
              <SidebarMobileHeader
                type="open"
                amount={estimatedEarnings}
                token={getDisplayToken(vaultData.inputToken.symbol)}
                isLoadingForecast={isLoadingForecast}
              />
            ) : undefined,
          customHeaderStyles:
            !isDrawerOpen && isMobile ? { padding: 'var(--general-space-12) 0' } : undefined,
          handleIsDrawerOpen: (flag: boolean) => setIsDrawerOpen(flag),
          primaryButton:
            positionExists && userWalletAddress
              ? {
                  label: 'View your position',
                  url: `${vaultUrl}/${userWalletAddress}`,
                  disabled: isLoading,
                }
              : {
                  label: 'Deposit',
                  url: vaultUrl,
                  action: () => {
                    setStorageOnce(amountParsed.toNumber())
                  },
                  disabled: isLoading,
                },
          footnote: !positionExists ? (
            <Link href={vaultUrl}>
              <WithArrow>View strategy</WithArrow>
            </Link>
          ) : null,
        }}
        isMobile={isMobile}
        hiddenHeaderChevron={hiddenHeaderChevron}
      />
      {isGradientBorder && <div className={classNames.cardAnimateGradientBorder} />}
    </div>
  )
}
