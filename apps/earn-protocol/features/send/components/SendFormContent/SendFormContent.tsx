import { type Dispatch, type FC } from 'react'
import { Alert } from '@summerfi/app-earn-ui'
import { type DropdownOption, type DropdownRawOption } from '@summerfi/app-types'
import type BigNumber from 'bignumber.js'

import { SendFormInitialStep } from '@/features/send/components/SendFormInitialStep/SendFormInitialStep'
import { SendFormOrderInformation } from '@/features/send/components/SendFormOrderInformation/SendFormOrderInformation'
import { SendFormStatusStep } from '@/features/send/components/SendFormStatusStep/SendFormStatusStep'
import {
  type SendReducerAction,
  type SendState,
  SendStep,
  SendTxStatuses,
} from '@/features/send/types'

interface SendFormContentProps {
  amountDisplay: string
  amountDisplayUSD: string
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
  transactionFee: string | undefined
  transactionFeeLoading: boolean
}

export const SendFormContent: FC<SendFormContentProps> = ({
  amountDisplay,
  amountDisplayUSD,
  handleAmountChange,
  handleDropdownChange,
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
  transactionFee,
  transactionFeeLoading,
}) => {
  return (
    <>
      {state.step === SendStep.INIT && (
        <SendFormInitialStep
          amountDisplay={amountDisplay}
          amountDisplayUSD={amountDisplayUSD}
          dropdownOptions={dropdownOptions}
          selectedTokenBalance={selectedTokenBalance}
          selectedTokenBalanceLoading={selectedTokenBalanceLoading}
          isOwner={isOwner}
          isLoading={isLoading}
          state={state}
          dispatch={dispatch}
          handleDropdownChange={handleDropdownChange}
          handleAmountChange={handleAmountChange}
          onFocus={onFocus}
          onBlur={onBlur}
          manualSetAmount={manualSetAmount}
        />
      )}
      {[SendStep.PENDING, SendStep.COMPLETED].includes(state.step) && (
        <SendFormStatusStep state={state} />
      )}
      <SendFormOrderInformation
        state={state}
        amountDisplay={amountDisplay}
        transactionFee={transactionFee}
        transactionFeeLoading={transactionFeeLoading}
      />
      {state.txStatus === SendTxStatuses.FAILED && (
        <Alert
          error="Transaction failed, please try again."
          variant="critical"
          wrapperStyles={{ marginBottom: 'var(--general-space-16)' }}
        />
      )}
    </>
  )
}
