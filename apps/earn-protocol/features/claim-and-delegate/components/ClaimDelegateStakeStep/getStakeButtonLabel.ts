import {
  ClaimDelegateStakeType,
  type ClaimDelegateState,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'

export const getStakeButtonLabel = ({
  state,
  withApproval,
  isBase,
}: {
  state: ClaimDelegateState
  withApproval: boolean
  isBase: boolean
}) => {
  if (!isBase) {
    return 'Change network to Base'
  }

  if (state.stakingApproveStatus === ClaimDelegateTxStatuses.PENDING) {
    return 'Approving...'
  }

  if (state.stakingStatus === ClaimDelegateTxStatuses.PENDING) {
    return state.stakeType === ClaimDelegateStakeType.ADD_STAKE ? 'Staking...' : 'Unstaking...'
  }

  if ([state.stakingStatus, state.stakingApproveStatus].includes(ClaimDelegateTxStatuses.FAILED)) {
    return 'Retry'
  }

  if (withApproval && state.stakeType === ClaimDelegateStakeType.ADD_STAKE) {
    return 'Approve'
  }

  return state.stakeType === ClaimDelegateStakeType.ADD_STAKE ? 'Stake' : 'Unstake'
}
