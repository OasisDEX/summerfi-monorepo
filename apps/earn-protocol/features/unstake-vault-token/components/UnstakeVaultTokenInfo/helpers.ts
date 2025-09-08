import {
  type UnstakeVaultTokenBalance,
  type UnstakeVaultTokenState,
  UnstakeVaultTokenStep,
} from '@/features/unstake-vault-token/types'

export const getUnstakeVaultTokenInfoLabel = ({
  state,
  balance,
}: {
  state: UnstakeVaultTokenState
  balance: UnstakeVaultTokenBalance
}) => {
  switch (state.step) {
    case UnstakeVaultTokenStep.INIT:
    case UnstakeVaultTokenStep.PENDING:
      return `You’ll get ${balance.token?.symbol}`
    case UnstakeVaultTokenStep.COMPLETED:
      return 'You have'
    default:
      return 'You’ll get'
  }
}

export const getUnstakeVaultTokenInfoButtonLabel = ({
  state,
}: {
  state: UnstakeVaultTokenState
}) => {
  switch (state.step) {
    case UnstakeVaultTokenStep.PENDING:
      return 'Withdrawing...'
    case UnstakeVaultTokenStep.ERROR:
      return 'Try again'
    default:
      return 'Confirm withdrawal'
  }
}
