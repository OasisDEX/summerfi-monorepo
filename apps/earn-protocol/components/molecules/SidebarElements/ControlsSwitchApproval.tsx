import { Input, SelectionBlock, Text } from '@summerfi/app-earn-ui'
import { type EarnAllowanceTypes } from '@summerfi/app-types'
import type BigNumber from 'bignumber.js'
import clsx from 'clsx'

import controlsApprovalStyles from './ControlsSwitchApproval.module.scss'

type ControlsSwitchApprovalProps = {
  tokenSymbol: string
  approvalType: EarnAllowanceTypes
  setApprovalType: (type: EarnAllowanceTypes) => void
  setApprovalCustomValue: (e: React.ChangeEvent<HTMLInputElement>) => void
  customApprovalManualSetAmount: (value: string) => void
  approvalCustomValue: string
  tokenBalance?: BigNumber
  customApprovalOnBlur?: () => void
  customApprovalOnFocus?: () => void
}

export const ControlsSwitchApproval = ({
  tokenSymbol,
  approvalType,
  setApprovalType,
  setApprovalCustomValue,
  customApprovalManualSetAmount,
  approvalCustomValue,
  tokenBalance,
  customApprovalOnBlur,
  customApprovalOnFocus,
}: ControlsSwitchApprovalProps) => {
  const handleMaxApproval = () => {
    if (!tokenBalance) return
    customApprovalManualSetAmount(tokenBalance.toString())
  }

  return (
    <>
      <Text variant="p2" className={controlsApprovalStyles.approvalText}>
        Approvals give our platform permission to interact with your tokens up to a threshold,
        determined by you. You can revoke the permission anytime you want.{' '}
      </Text>
      <SelectionBlock
        title={`${tokenSymbol} deposit`}
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
