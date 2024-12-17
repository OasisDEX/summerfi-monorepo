import {
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateSteps,
} from '@/features/claim-and-delegate/types'

export const claimDelegateState: ClaimDelegateState = {
  step: ClaimDelegateSteps.TERMS,
  delegatee: undefined,
  claimStatus: undefined,
  delegateStatus: undefined,
  walletAddress: '0x0', // dummy, invalid address for init
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
    default:
      return prevState
  }
}
