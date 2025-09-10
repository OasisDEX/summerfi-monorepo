import { type IconNamesList } from '@summerfi/app-types'

import { UnstakeVaultTokenStep } from '@/features/unstake-vault-token/types'

export const unstakeTokenIconMap: { [key in UnstakeVaultTokenStep]: IconNamesList } = {
  [UnstakeVaultTokenStep.INIT]: 'withdraw',
  [UnstakeVaultTokenStep.PENDING]: 'withdraw',
  [UnstakeVaultTokenStep.COMPLETED]: 'checkmark',
  [UnstakeVaultTokenStep.ERROR]: 'close',
}

export const unstakeTokenTitleMap: { [key in UnstakeVaultTokenStep]: string } = {
  [UnstakeVaultTokenStep.INIT]: 'You have staked vault tokens',
  [UnstakeVaultTokenStep.PENDING]: 'Transaction processing',
  [UnstakeVaultTokenStep.COMPLETED]: 'Successfully withdrawal',
  [UnstakeVaultTokenStep.ERROR]: 'Withdrawal failed',
}
