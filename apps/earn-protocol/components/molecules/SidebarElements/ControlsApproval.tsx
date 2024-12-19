import { Input, SelectionBlock, Text } from '@summerfi/app-earn-ui'
import { type EarnAllowanceTypes } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'

import controlsApprovalStyles from './ControlsApproval.module.scss'

type ControlsApprovalProps = {
  tokenSymbol: string
  approvalType: EarnAllowanceTypes
  setApprovalType: (type: EarnAllowanceTypes) => void
  setApprovalCustomValue: (value: BigNumber) => void
  approvalCustomValue: BigNumber
  tokenBalance?: BigNumber
}

export const ControlsApproval = ({
  tokenSymbol,
  approvalType,
  setApprovalType,
  setApprovalCustomValue,
  approvalCustomValue,
  tokenBalance,
}: ControlsApprovalProps) => {
  const handleCustomApproval = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = new BigNumber(e.target.value)

    setApprovalCustomValue(value)
  }

  const handleMaxApproval = () => {
    if (!tokenBalance) return
    setApprovalCustomValue(tokenBalance)
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
        customContent={
          <div className={controlsApprovalStyles.customApprovalInputWrapper}>
            <Input
              className={clsx(controlsApprovalStyles.customApprovalInput, {
                [controlsApprovalStyles.disabled]: approvalType !== 'custom',
              })}
              min="0"
              step="any"
              value={approvalCustomValue.toString()}
              placeholder={`0 ${tokenSymbol}`}
              type="number"
              disabled={approvalType !== 'custom'}
              onChange={handleCustomApproval}
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
        }
        style={{ marginBottom: 'var(--spacing-space-x-large) !important' }}
      />
    </>
  )
}
