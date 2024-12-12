import { InputWithDropdown, ProjectedEarnings, SkeletonLine } from '@summerfi/app-earn-ui'
import {
  type DropdownOption,
  type DropdownRawOption,
  type SDKVaultishType,
  type SDKVaultType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'

type ControlsDepositWithdrawProps = {
  amountDisplay: string
  amountDisplayUSD: string
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDropdownChange: (option: DropdownRawOption) => void
  options: DropdownOption[]
  dropdownValue: DropdownOption
  onFocus: () => void
  onBlur: () => void
  tokenSymbol: string
  tokenBalance: BigNumber | undefined
  tokenBalanceLoading: boolean
  manualSetAmount: (amountParsed: string | undefined) => void
  vault: SDKVaultType | SDKVaultishType
  estimatedEarnings: string
  isLoadingForecast: boolean
}

export const ControlsDepositWithdraw = ({
  amountDisplay,
  amountDisplayUSD,
  handleAmountChange,
  handleDropdownChange,
  options,
  dropdownValue,
  onFocus,
  onBlur,
  tokenSymbol,
  tokenBalance,
  tokenBalanceLoading,
  manualSetAmount,
  vault,
  estimatedEarnings,
  isLoadingForecast,
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
          action: () => {
            if (tokenBalance) {
              manualSetAmount(tokenBalance.toString())
            }
          },
        }}
      />
      <ProjectedEarnings
        earnings={estimatedEarnings}
        symbol={vault.inputToken.symbol as TokenSymbolsList}
        isLoading={isLoadingForecast}
      />
    </>
  )
}
