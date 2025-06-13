import { type DropdownOption, type DropdownRawOption, TransactionAction } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'

import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { InputWithDropdown } from '@/components/molecules/InputWithDropdown/InputWithDropdown'

import constrolsDepositWithdrawStyles from './ControlsDepositWithdraw.module.css'

type ControlsDepositWithdrawProps = {
  amountDisplay: string
  amountDisplayUSD: string
  options: DropdownOption[]
  dropdownValue: DropdownOption
  tokenSymbol: string
  tokenBalance: BigNumber | undefined
  tokenBalanceLoading: boolean
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDropdownChange: (option: DropdownRawOption) => void
  onFocus: () => void
  onBlur: () => void
  manualSetAmount: (amountParsed: string | undefined) => void
  ownerView?: boolean
  transactionType?: TransactionAction
  contentAfterInput?: React.ReactNode
}

export const ControlsDepositWithdraw = ({
  amountDisplay,
  amountDisplayUSD,
  options,
  dropdownValue,
  tokenSymbol,
  tokenBalance,
  tokenBalanceLoading,
  ownerView,
  handleAmountChange,
  handleDropdownChange,
  onFocus,
  onBlur,
  manualSetAmount,
  transactionType,
  contentAfterInput,
}: ControlsDepositWithdrawProps): React.ReactNode => {
  return (
    <div className={constrolsDepositWithdrawStyles.depositViewWrapper}>
      <InputWithDropdown
        value={amountDisplay}
        placeholder="10,000.00"
        secondaryValue={amountDisplayUSD}
        handleChange={handleAmountChange}
        handleDropdownChange={handleDropdownChange}
        options={options.sort((a, b) => a.label.localeCompare(b.label))}
        withSearch={options.length > 8}
        dropdownValue={dropdownValue}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={!ownerView}
        selectAllOnFocus
        heading={{
          // this was used as a 'row', like 'Balance: 1000 USDC', but now is used as columns
          // Deposit token      Balance: 10 USDC
          // some token         deposit amount
          // also i'm removing the `-` because its always showing up on landing page
          label:
            transactionType === TransactionAction.WITHDRAW ? 'Withdraw token' : 'Deposit token',
          value: tokenBalanceLoading ? (
            <SkeletonLine width={60} height={10} />
          ) : tokenBalance ? (
            `Balance: ${formatCryptoBalance(tokenBalance)} ${tokenSymbol}`
          ) : (
            ''
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
      {contentAfterInput}
    </div>
  )
}
