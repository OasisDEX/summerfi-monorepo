import { type SendReducerAction, type SendState, SendStep, type SendTokenDropdown } from './types'

export const sendState: SendState = {
  step: SendStep.INIT,
  txStatus: undefined,
  recipientAddress: '',
  tokenDropdown: {
    label: '',
    value: '',
    tokenSymbol: '',
    chainId: '',
  } as unknown as SendTokenDropdown,
  walletAddress: '0x0', // dummy address just for init,
}

export const sendReducer = (state: SendState, action: SendReducerAction) => {
  switch (action.type) {
    case 'update-step':
      return { ...state, step: action.payload }
    case 'update-tx-status':
      return { ...state, txStatus: action.payload }
    case 'reset':
      return { ...state, ...action.payload }
    case 'update-recipient-address':
      return { ...state, recipientAddress: action.payload }
    case 'update-token-dropdown':
      return { ...state, tokenDropdown: action.payload }
    default:
      return state
  }
}
