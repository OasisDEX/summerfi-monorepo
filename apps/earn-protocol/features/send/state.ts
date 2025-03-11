import { type SendReducerAction, type SendState, SendStep } from './types'

export const sendState: SendState = {
  step: SendStep.INIT,
  txStatus: undefined,
  recipientAddress: '',
}

export const sendReducer = (state: SendState, action: SendReducerAction) => {
  switch (action.type) {
    case 'update-step':
      return { ...state, step: action.payload }
    case 'update-tx-status':
      return { ...state, txStatus: action.payload }
    case 'reset':
      return sendState
    case 'update-recipient-address':
      return { ...state, recipientAddress: action.payload }
    default:
      return state
  }
}
