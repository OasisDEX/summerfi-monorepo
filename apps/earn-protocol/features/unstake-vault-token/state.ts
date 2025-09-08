import {
  type UnstakeVaultTokenReducerAction,
  type UnstakeVaultTokenState,
  UnstakeVaultTokenStep,
} from '@/features/unstake-vault-token/types'

export const unstakeVaultTokenState: UnstakeVaultTokenState = {
  step: UnstakeVaultTokenStep.INIT,
  txStatus: undefined,
  walletAddress: '0x0', // dummy address just for init,
  vaultToken: undefined,
  vaultTokenPrice: undefined,
}

export const unstakeVaultTokenReducer = (
  state: UnstakeVaultTokenState,
  action: UnstakeVaultTokenReducerAction,
) => {
  switch (action.type) {
    case 'update-step':
      return { ...state, step: action.payload }
    case 'update-tx-status':
      return { ...state, txStatus: action.payload }
    case 'reset':
      return { ...state, ...action.payload }
    default:
      return state
  }
}
