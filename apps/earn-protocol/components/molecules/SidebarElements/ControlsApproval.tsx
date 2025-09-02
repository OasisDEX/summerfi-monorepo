import { Input, SelectionBlock, Text } from '@summerfi/app-earn-ui'
import { type EarnAllowanceTypes, TransactionAction } from '@summerfi/app-types'
import type BigNumber from 'bignumber.js'
import clsx from 'clsx'

import controlsApprovalStyles from './ControlsApproval.module.css'

type ControlsApprovalProps = {
  tokenSymbol: string
  approvalType: EarnAllowanceTypes
  setApprovalType: (type: EarnAllowanceTypes) => void
  setApprovalCustomValue: (e: React.ChangeEvent<HTMLInputElement>) => void
  customApprovalManualSetAmount: (value: string) => void
  approvalCustomValue: string
  tokenBalance?: BigNumber
  customApprovalOnBlur?: () => void
  customApprovalOnFocus?: () => void
  sidebarTransactionType: TransactionAction
}

export const ControlsApproval = ({
  tokenSymbol,
  approvalType,
  setApprovalType,
  setApprovalCustomValue,
  customApprovalManualSetAmount,
  approvalCustomValue,
  tokenBalance,
  customApprovalOnBlur,
  customApprovalOnFocus,
  sidebarTransactionType,
}: ControlsApprovalProps) => {
  const handleMaxApproval = () => {
    if (!tokenBalance) return
    customApprovalManualSetAmount(tokenBalance.toString())
  }

  const action = {
    [TransactionAction.DEPOSIT]: 'deposit',
    [TransactionAction.WITHDRAW]: 'withdraw',
    [TransactionAction.SWITCH]: 'switch',
  }

  return (
    <>
      <Text variant="p2" className={controlsApprovalStyles.approvalText}>
        Approvals give our platform permission to interact with your tokens up to a threshold,
        determined by you. You can revoke the permission anytime you want.{' '}
      </Text>
      <SelectionBlock
        title={`${tokenSymbol} ${action[sidebarTransactionType]}`}
        subTitle="Recommended"
        onClick={() => setApprovalType('deposit')}
        active={approvalType === 'deposit'}
      />
      <SelectionBlock
        title="Custom"
        onClick={() => setApprovalType('custom')}
        active={approvalType === 'custom'}
        style={{ marginBottom: 'var(--spacing-space-x-large) !important' }}
      >
        <div className={controlsApprovalStyles.customApprovalInputWrapper}>
          <Input
            className={clsx(controlsApprovalStyles.customApprovalInput, {
              [controlsApprovalStyles.disabled]: approvalType !== 'custom',
            })}
            value={approvalCustomValue}
            placeholder={`0 ${tokenSymbol}`}
            disabled={approvalType !== 'custom'}
            onChange={setApprovalCustomValue}
            onBlur={customApprovalOnBlur}
            onFocus={customApprovalOnFocus}
          />
          <Text
            variant="p4semiColorful"
            className={clsx({
              [controlsApprovalStyles.maxButtonDisabled]:
                approvalType !== 'custom' || !tokenBalance,
            })}
            onClick={handleMaxApproval}
          >
            Max
          </Text>
        </div>
      </SelectionBlock>
    </>
  )
}
