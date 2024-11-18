import { Input, SelectionBlock, Text } from '@summerfi/app-earn-ui'
import { type EarnAllowanceTypes, type SDKVaultType } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'

import approvalStyles from './Approval.module.scss'

type ApprovalProps = {
  vault: SDKVaultType
  approvalType: EarnAllowanceTypes
  setApprovalType: (type: EarnAllowanceTypes) => void
  setApprovalCustomValue: (value: BigNumber) => void
  approvalCustomValue: BigNumber
  tokenBalance?: BigNumber
}

export const Approval = ({
  vault,
  approvalType,
  setApprovalType,
  setApprovalCustomValue,
  approvalCustomValue,
  tokenBalance,
}: ApprovalProps) => {
  const tokenSymbol = vault.inputToken.symbol

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
      <Text variant="p2" className={approvalStyles.approvalText}>
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
          <div className={approvalStyles.customApprovalInputWrapper}>
            <Input
              className={clsx(approvalStyles.customApprovalInput, {
                [approvalStyles.disabled]: approvalType !== 'custom',
              })}
              value={approvalCustomValue.toString()}
              placeholder={`0 ${tokenSymbol}`}
              type="number"
              disabled={approvalType !== 'custom'}
              onChange={handleCustomApproval}
            />
            <Text
              variant="p4semiColorful"
              className={clsx({
                [approvalStyles.maxButtonDisabled]: approvalType !== 'custom' || !tokenBalance,
              })}
              onClick={handleMaxApproval}
            >
              Max
            </Text>
          </div>
        }
        style={{ marginBottom: 'var(--spacing-space-x-large)' }}
      />
    </>
  )
}
