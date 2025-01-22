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

  if (!hasNothingToStake && withApproval && state.stakingApproveStatus === undefined) {
    return 'Approve'
  }

  if (hasNothingToStake || state.stakingStatus === ClaimDelegateTxStatuses.COMPLETED) {
    return 'Delegate'
  }

  return 'Stake'
}
