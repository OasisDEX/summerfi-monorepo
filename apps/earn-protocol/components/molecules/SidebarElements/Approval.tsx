import { useState } from 'react'
import { Input, SelectionBlock, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultType } from '@summerfi/app-types'

import approvalStyles from './Approval.module.scss'

type ApprovalProps = {
  vault: SDKVaultType
}

export const Approval = ({ vault }: ApprovalProps) => {
  const tokenSymbol = vault.inputToken.symbol
  const [approvalType, setApprovalType] = useState<'deposit' | 'custom'>('deposit')

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
          <Input className={approvalStyles.customApprovalInput} placeholder={`0 ${tokenSymbol}`} />
        }
        style={{ marginBottom: 'var(--spacing-space-x-large)' }}
      />
    </>
  )
}
