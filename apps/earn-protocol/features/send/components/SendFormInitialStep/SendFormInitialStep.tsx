import { type Dispatch, type FC } from 'react'
import { Alert, Input, InputWithDropdown, SkeletonLine, Text } from '@summerfi/app-earn-ui'
import { type DropdownOption, type DropdownRawOption } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'

import { type SendReducerAction, type SendState, SendTxStatuses } from '@/features/send/types'
import { isValidAddress } from '@/helpers/is-valid-address'

import classNames from './SendFormInitialStep.module.css'

interface SendFormInitialStepProps {
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
}

export const SendFormInitialStep: FC<SendFormInitialStepProps> = ({
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
}) => {
  const isInvalidAddress = state.recipientAddress !== '' && !isValidAddress(state.recipientAddress)

  return (
    <div className={classNames.sendFormInitialStepWrapper}>
      <div className={classNames.toWrapper}>
        <Text
          as="p"
          variant="p3semi"
          style={{
            marginBottom: 'var(--general-space-8)',
            color: 'var(--color-text-primary-disabled)',
          }}
        >
          To
        </Text>
        <Input
          value={state.recipientAddress}
          onChange={(e) => dispatch({ type: 'update-recipient-address', payload: e.target.value })}
          placeholder="Recievers address"
          disabled={isLoading || state.txStatus === SendTxStatuses.COMPLETED}
          variant="dark"
          maxLength={42}
          button={
            <Text
              as="p"
              variant="p3semi"
              className={classNames.pasteButton}
              onClick={async () => {
                try {
                  const text = await navigator.clipboard.readText()

                  dispatch({ type: 'update-recipient-address', payload: text.toLowerCase() })
                } catch (err) {
                  // eslint-disable-next-line no-console
                  console.error('Failed to read clipboard:', err)
                }
              }}
            >
              Paste
            </Text>
          }
          style={{ paddingRight: 'var(--general-space-64)' }}
          buttonStyles={{ right: '15px' }}
        />
      </div>
      <Alert
        error="Please enter a valid recipient address"
        variant="critical"
        wrapperStyles={{
          marginTop: 'var(--general-space-8)',
          display: isInvalidAddress ? 'block' : 'none',
        }}
      />
      <InputWithDropdown
        value={amountDisplay}
        secondaryValue={amountDisplayUSD}
        handleChange={(e) => {
          handleAmountChange(e)
          dispatch({
            type: 'update-tx-status',
            payload: undefined,
          })
        }}
        handleDropdownChange={handleDropdownChange}
        options={dropdownOptions}
        dropdownValue={state.tokenDropdown}
        heading={{
          label: '',
          value: selectedTokenBalanceLoading ? (
            <SkeletonLine width={80} height={14} style={{ marginTop: 'var(--general-space-8)' }} />
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
    </div>
  )
}
