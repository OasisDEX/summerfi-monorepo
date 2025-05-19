import { useMemo } from 'react'
import {
  type EarnTransactionViewStates,
  TransactionAction,
  type TransactionWithStatus,
} from '@summerfi/app-types'
import { TransactionType } from '@summerfi/sdk-common'

export const useSidebarContentComponent = ({
  nextTransaction,
  selectedSwitchVault,
  sidebarTransactionType,
  txStatus,
}: {
  nextTransaction?: TransactionWithStatus
  selectedSwitchVault: `${string}-${number}` | undefined
  sidebarTransactionType: TransactionAction
  txStatus: EarnTransactionViewStates
}) => {
  const isSwitch = sidebarTransactionType === TransactionAction.SWITCH
  const isDeposit = sidebarTransactionType === TransactionAction.DEPOSIT
  const isWithdraw = sidebarTransactionType === TransactionAction.WITHDRAW
  const isDepositOrWithdraw = isDeposit || isWithdraw

  const sidebarContentName:
    | 'ControlsSwitch'
    | 'ControlsSwitchTransactionView'
    | 'ControlsSwitchSuccessErrorView'
    | 'ControlsApproval'
    | 'OrderInfoDeposit'
    | 'ControlsDepositWithdraw'
    | 'OrderInfoWithdraw'
    | `Transaction (${string}) not supported` = useMemo(() => {
    // TODO: this hook needs a rework after vault switching is done
    // trying to make this simple - if there is no next transaction, we are in the entry points
    // also adding a fail safe for the mapping missing here at the end
    if (!nextTransaction) {
      if (isSwitch) {
        if (txStatus === 'txSuccess' && selectedSwitchVault) {
          // a success screen specially for the switch action
          return 'ControlsSwitchSuccessErrorView' as const
        }

        return 'ControlsSwitch'
      } else if (isDepositOrWithdraw) {
        return 'ControlsDepositWithdraw' as const
      }

      return `Transaction (undefined) not supported` as const
    }
    if (isSwitch && selectedSwitchVault) {
      return 'ControlsSwitchTransactionView' as const
    }
    if (nextTransaction.type === TransactionType.Approve) {
      return 'ControlsApproval' as const
    } else if (nextTransaction.type === TransactionType.Deposit) {
      return 'OrderInfoDeposit' as const
    } else if (nextTransaction.type === TransactionType.Withdraw) {
      return 'OrderInfoWithdraw' as const
    } else {
      // this is a fail safe for the mapping missing here at the end
      // we should never get here
      return `Transaction (${nextTransaction.type}) not supported` as const
    }
  }, [nextTransaction, isSwitch, selectedSwitchVault, isDepositOrWithdraw, txStatus])

  return sidebarContentName
}
