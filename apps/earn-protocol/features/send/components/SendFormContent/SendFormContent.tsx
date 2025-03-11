import { type Dispatch, type FC } from 'react'
import { Alert, Input, InputWithDropdown, SkeletonLine, Text } from '@summerfi/app-earn-ui'
import { type DropdownOption, type DropdownRawOption } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'

import { type SendReducerAction, type SendState, SendTxStatuses } from '@/features/send/types'
import { isValidAddress } from '@/helpers/is-valid-address'

import classNames from './SendFormContent.module.scss'

interface SendFormContentProps {
  amountDisplay: string
  amountDisplayUSD: string
  dropdownValue: DropdownOption
  dropdownOptions: DropdownOption[]
  selectedTokenBalance: BigNumber | undefined
  selectedTokenBalanceLoading: boolean
  isOwner?: boolean
  isLoading: boolean
  state: SendState
  dispatch: Dispatch<SendReducerAction>
  handleDropdownChange: (option: DropdownRawOption) => void
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus: () => void
  onBlur: () => void
  manualSetAmount: (amount: string) => void
}

export const SendFormContent: FC<SendFormContentProps> = ({
  amountDisplay,
  amountDisplayUSD,
  handleAmountChange,
  handleDropdownChange,
  dropdownValue,
  dropdownOptions,
  selectedTokenBalance,
  selectedTokenBalanceLoading,
  isOwner,
  onFocus,
  onBlur,
  isLoading,
  state,
  dispatch,
  manualSetAmount,
}) => {
  return (
    <div className={classNames.sendFormContentWrapper}>
      <InputWithDropdown
        value={amountDisplay}
        secondaryValue={amountDisplayUSD}
        handleChange={handleAmountChange}
        handleDropdownChange={handleDropdownChange}
        options={dropdownOptions}
        dropdownValue={dropdownValue}
        heading={{
          label: 'Token to send',
          value: selectedTokenBalanceLoading ? (
            <SkeletonLine width={80} height={14} />
          ) : (
            `Balance: ${formatCryptoBalance(selectedTokenBalance ?? 0)}`
          ),
          action: isOwner
            ? () => {
                if (selectedTokenBalance) {
                  manualSetAmount(selectedTokenBalance.toString())
                }
              }
            : undefined,
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={isLoading || state.txStatus === SendTxStatuses.COMPLETED}
      />
      <div>
        <Text
          as="p"
          variant="p3semi"
          style={{
            marginBottom: 'var(--general-space-8)',
            color: 'var(--color-text-primary-disabled)',
          }}
        >
          Recipient address
        </Text>
        <Input
          value={state.recipientAddress}
          onChange={(e) => dispatch({ type: 'update-recipient-address', payload: e.target.value })}
          placeholder="0x..."
          disabled={isLoading || state.txStatus === SendTxStatuses.COMPLETED}
          variant="dark"
        />
      </div>

      {state.recipientAddress !== '' && !isValidAddress(state.recipientAddress) && (
        <Alert error="Please enter a valid recipient address" variant="critical" />
      )}
      {state.txStatus === SendTxStatuses.FAILED && (
        <Alert error="Transaction failed, please try again." variant="critical" />
      )}
    </div>
  )
}
