import { UiTransactionStatuses } from '@summerfi/app-types'

import {
  ClaimDelegateStakeType,
  type ClaimDelegateState,
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

  if (state.stakingApproveStatus === UiTransactionStatuses.PENDING) {
    return 'Approving...'
  }

  if (state.stakingStatus === UiTransactionStatuses.PENDING) {
    return state.stakeType === ClaimDelegateStakeType.ADD_STAKE ? 'Staking...' : 'Unstaking...'
  }

  if ([state.stakingStatus, state.stakingApproveStatus].includes(UiTransactionStatuses.FAILED)) {
    return 'Retry'
  }

  if (
    withApproval &&
    state.stakeType === ClaimDelegateStakeType.ADD_STAKE &&
    state.stakingApproveStatus !== UiTransactionStatuses.COMPLETED
  ) {
    return 'Approve'
  }

  return state.stakeType === ClaimDelegateStakeType.ADD_STAKE ? 'Stake' : 'Unstake'
}
