import {
  type DropdownOption,
  type DropdownRawOption,
  type SDKVaultishType,
  type SDKVaultType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'

import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { InputWithDropdown } from '@/components/molecules/InputWithDropdown/InputWithDropdown'
import { ProjectedEarnings } from '@/components/molecules/ProjectedEarnings/ProjectedEarnings'

type ControlsDepositWithdrawProps = {
  amountDisplay: string
  amountDisplayUSD: string
  options: DropdownOption[]
  dropdownValue: DropdownOption
  tokenSymbol: string
  tokenBalance: BigNumber | undefined
  tokenBalanceLoading: boolean
  vault: SDKVaultType | SDKVaultishType
  estimatedEarnings: string
  isLoadingForecast: boolean
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDropdownChange: (option: DropdownRawOption) => void
  onFocus: () => void
  onBlur: () => void
  manualSetAmount: (amountParsed: string | undefined) => void
  ownerView?: boolean
}

export const ControlsDepositWithdraw = ({
  amountDisplay,
  amountDisplayUSD,
  options,
  dropdownValue,
  tokenSymbol,
  tokenBalance,
  tokenBalanceLoading,
  vault,
  estimatedEarnings,
  isLoadingForecast,
  handleAmountChange,
  handleDropdownChange,
  onFocus,
  onBlur,
  manualSetAmount,
  ownerView,
}: ControlsDepositWithdrawProps) => {
  return (
    <>
      <InputWithDropdown
        value={amountDisplay}
        secondaryValue={amountDisplayUSD}
        handleChange={handleAmountChange}
        handleDropdownChange={handleDropdownChange}
        options={options}
        dropdownValue={dropdownValue}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={!ownerView}
        selectAllOnFocus
        heading={{
          label: 'Balance',
          value: tokenBalanceLoading ? (
            <SkeletonLine width={60} height={10} />
          ) : tokenBalance ? (
            `${formatCryptoBalance(tokenBalance)} ${tokenSymbol}`
          ) : (
            '-'
          ),
          action: ownerView
            ? () => {
                if (tokenBalance) {
                  manualSetAmount(tokenBalance.toString())
                }
              }
            : undefined,
        }}
      />
      {ownerView && (
        <ProjectedEarnings
          earnings={estimatedEarnings}
          symbol={vault.inputToken.symbol as TokenSymbolsList}
          isLoading={isLoadingForecast}
        />
      )}
    </>
  )
}
