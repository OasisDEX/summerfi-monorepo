import {
  type ClaimDelegateState,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'

export const getStakeDelegateButtonLabel = ({
  state,
  hasNothingToStake,
  withApproval,
}: {
  state: ClaimDelegateState
  hasNothingToStake: boolean
  withApproval: boolean
}) => {
  if (state.stakingApproveStatus === ClaimDelegateTxStatuses.PENDING) {
    return 'Approving...'
  }

  if (state.stakingStatus === ClaimDelegateTxStatuses.PENDING) {
    return 'Staking...'
  }

  if (state.delegateStatus === ClaimDelegateTxStatuses.PENDING) {
    return 'Delegating'
  }

  if (
    [state.delegateStatus, state.stakingStatus, state.stakingApproveStatus].includes(
      ClaimDelegateTxStatuses.FAILED,
    )
  ) {
    return 'Retry'
  }

  if (hasNothingToStake || state.delegateStatus !== ClaimDelegateTxStatuses.COMPLETED) {
    return 'Delegate'
  }

  if (withApproval) {
    return 'Approve'
  }

  return 'Stake'
}
