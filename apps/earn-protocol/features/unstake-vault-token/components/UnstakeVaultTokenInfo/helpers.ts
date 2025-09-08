import { humanReadableChainToLabelMap } from '@summerfi/app-utils'

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
      return `You’ll get ${balance.token?.symbol ?? 'vault token'}`
    case UnstakeVaultTokenStep.COMPLETED:
      return 'You have'
    default:
      return 'You’ll get'
  }
}

export const getUnstakeVaultTokenInfoButtonLabel = ({
  state,
  isOnCorrectChain,
}: {
  state: UnstakeVaultTokenState
  isOnCorrectChain: boolean
}) => {
  if (!isOnCorrectChain && state.vaultChainId) {
    return `Switch network to ${humanReadableChainToLabelMap[state.vaultChainId]}`
  }

  switch (state.step) {
    case UnstakeVaultTokenStep.PENDING:
      return 'Withdrawing...'
    case UnstakeVaultTokenStep.ERROR:
      return 'Try again'
    default:
      return 'Confirm withdrawal'
  }
}
