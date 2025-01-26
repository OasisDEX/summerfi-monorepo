import {
  type ClaimDelegateState,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'

import { ClaimDelegateStakeStepTabs } from './types'

export const getStakeButtonLabel = ({
  state,
  withApproval,
  tab,
  isBase,
}: {
  state: ClaimDelegateState
  withApproval: boolean
  tab: ClaimDelegateStakeStepTabs
  isBase: boolean
}) => {
  if (!isBase) {
    return 'Change network to Base'
  }

  if (state.stakingApproveStatus === ClaimDelegateTxStatuses.PENDING) {
    return 'Approving...'
  }

  if (state.stakingStatus === ClaimDelegateTxStatuses.PENDING) {
    return tab === ClaimDelegateStakeStepTabs.ADD_STAKE ? 'Staking...' : 'Unstaking...'
  }

  if ([state.stakingStatus, state.stakingApproveStatus].includes(ClaimDelegateTxStatuses.FAILED)) {
    return 'Retry'
  }

  if (withApproval && tab === ClaimDelegateStakeStepTabs.ADD_STAKE) {
    return 'Approve'
  }

  return tab === ClaimDelegateStakeStepTabs.ADD_STAKE ? 'Stake' : 'Unstake'
}
