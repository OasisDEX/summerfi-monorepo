import {
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateSteps,
} from '@/features/claim-and-delegate/types'

export const claimDelegateState: ClaimDelegateState = {
  step: ClaimDelegateSteps.TERMS,
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
    default:
      return prevState
  }
}
