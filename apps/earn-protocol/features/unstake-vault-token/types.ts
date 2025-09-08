import { type IToken, type TokenSymbolsList, type UiTransactionStatuses } from '@summerfi/app-types'

export enum UnstakeVaultTokenStep {
  INIT = 'init',
  PENDING = 'pending',
  ERROR = 'error',
  COMPLETED = 'completed',
}

export type UnstakeVaultTokenState = {
  step: UnstakeVaultTokenStep
  txStatus: UiTransactionStatuses | undefined
  walletAddress: string
  vaultToken: TokenSymbolsList | undefined
  vaultTokenPrice: number | undefined
}

export type UnstakeVaultTokenReducerAction =
  | {
      type: 'update-step'
      payload: UnstakeVaultTokenStep
    }
  | {
      type: 'update-tx-status'
      payload: UiTransactionStatuses | undefined
    }
  | {
      type: 'reset'
      payload?: Partial<UnstakeVaultTokenState>
    }

export type UnstakeVaultTokenBalance = {
  amount: string | undefined
  isLoading: boolean
  isError: boolean
  token: IToken | undefined
}
