export enum ClaimDelegateSteps {
  TERMS = 'terms',
  CLAIM = 'claim',
  DELEGATE = 'delegate',
}

export type ClaimDelegateState = {
  step: ClaimDelegateSteps
}

export type ClaimDelegateReducerAction = {
  type: 'update-step'
  payload: ClaimDelegateSteps
}
