import {
  type ClaimDelegateReducerAction,
  ClaimDelegateStakeType,
  type ClaimDelegateState,
  ClaimDelegateSteps,
} from '@/features/claim-and-delegate/types'

export const claimDelegateState: ClaimDelegateState = {
  step: ClaimDelegateSteps.STAKE,
  delegatee: undefined,
  claimStatus: undefined,
  delegateStatus: undefined,
  stakingStatus: undefined,
  stakingApproveStatus: undefined,
  walletAddress: '0x0', // dummy, invalid address for init
  stakeType: ClaimDelegateStakeType.ADD_STAKE,
  stakeChangeAmount: undefined,
}

export const claimDelegateReducer = (
  prevState: ClaimDelegateState,
  action: ClaimDelegateReducerAction,
) => {
  switch (action.type) {
    case 'update-step':
      return {
        ...prevState,
        step: action.payload,
      }
    case 'update-delegatee':
      return {
        ...prevState,
        delegatee: action.payload,
      }
    case 'update-claim-status':
      return {
        ...prevState,
        claimStatus: action.payload,
      }
    case 'update-delegate-status':
      return {
        ...prevState,
        delegateStatus: action.payload,
      }
    case 'update-staking-approve-status':
      return {
        ...prevState,
        stakingApproveStatus: action.payload,
      }
    case 'update-staking-status':
      return {
        ...prevState,
        stakingStatus: action.payload,
      }
    case 'update-stake-type':
      return {
        ...prevState,
        stakeType: action.payload,
      }
    case 'update-stake-change-amount':
      return {
        ...prevState,
        stakeChangeAmount: action.payload,
      }
    default:
      return prevState
  }
}
