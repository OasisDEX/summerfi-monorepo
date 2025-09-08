import { type FC } from 'react'

import { UnstakeVaultTokenError } from '@/features/unstake-vault-token/components/UnstakeVaultTokenError/UnstakeVaultTokenError'
import { UnstakeVaultTokenInfo } from '@/features/unstake-vault-token/components/UnstakeVaultTokenInfo/UnstakeVaultTokenInfo'
import {
  type UnstakeVaultTokenBalance,
  type UnstakeVaultTokenState,
  UnstakeVaultTokenStep,
} from '@/features/unstake-vault-token/types'

interface UnstakeVaultTokenFormProps {
  state: UnstakeVaultTokenState
  handleTx: () => Promise<void>
  balance: UnstakeVaultTokenBalance
  isOwner: boolean
}

export const UnstakeVaultTokenForm: FC<UnstakeVaultTokenFormProps> = ({
  state,
  handleTx,
  balance,
  isOwner,
}) => {
  switch (state.step) {
    case UnstakeVaultTokenStep.INIT:
    case UnstakeVaultTokenStep.PENDING:
    case UnstakeVaultTokenStep.COMPLETED:
      return (
        <UnstakeVaultTokenInfo
          state={state}
          balance={balance}
          handleTx={handleTx}
          isOwner={isOwner}
        />
      )
    case UnstakeVaultTokenStep.ERROR:
      return <UnstakeVaultTokenError handleTx={handleTx} />
    default:
      // eslint-disable-next-line no-console
      console.error('UnstakeVaultTokenForm: invalid step', state.step)

      return null
  }
}
