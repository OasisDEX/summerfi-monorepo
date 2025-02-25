import {
  ClaimDelegateStakeType,
  type ClaimDelegateState,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'

export const getStakeButtonLabel = ({
  state,
  withApproval,
  isBase,
  isMobile,
}: {
  state: ClaimDelegateState
  withApproval: boolean
  isBase: boolean
  isMobile: boolean
}) => {
  if (!isBase) {
    return isMobile ? 'Change network' : 'Change network to Base'
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

  if (
    withApproval &&
    state.stakeType === ClaimDelegateStakeType.ADD_STAKE &&
    state.stakingApproveStatus !== ClaimDelegateTxStatuses.COMPLETED
  ) {
    return 'Approve'
  }

  return state.stakeType === ClaimDelegateStakeType.ADD_STAKE ? 'Stake' : 'Unstake'
}
