import { useMemo } from 'react'
import { getEarnProtocolChainById } from '@summerfi/app-earn-ui'
import {
  type EarnTransactionViewStates,
  type SupportedNetworkIds,
  TransactionAction,
  type TransactionWithStatus,
} from '@summerfi/app-types'
import { slugify } from '@summerfi/app-utils'
import { type IToken, TransactionType } from '@summerfi/sdk-common'
import type BigNumber from 'bignumber.js'
import { capitalize } from 'lodash-es'

type SidebarButton = {
  label: string
  action?: () => void
  disabled?: boolean
  loading?: boolean
  hidden?: boolean
}

type UseTransactionSidebarParams = {
  userWalletAddress?: `0x${string}`
  isAuthModalOpen: boolean
  ownerView?: boolean
  isProperChainSelected: boolean
  isSettingChain: boolean
  vaultChainId: SupportedNetworkIds
  flow: 'open' | 'manage'
  isWithdrawAmountOverPosition: boolean
  amount: BigNumber | undefined
  txStatus: EarnTransactionViewStates
  token: IToken | undefined
  nextTransaction?: TransactionWithStatus
  approvalTokenSymbol: string
  sidebarTransactionType: TransactionAction
  referralCodeError?: string | null
  login: () => void
  setChain: (params: { chain: number }) => void
  buttonClickEventHandler: (event: string) => void
  getTransactionsList: () => void
  executeNextTransaction: () => void
  reset: () => void
  refreshView: () => void
}

/**
 * Builds the transaction sidebar view-model (title + primary/secondary buttons) from
 * the current transaction state.
 */
export const useTransactionSidebar = ({
  userWalletAddress,
  isAuthModalOpen,
  ownerView,
  isProperChainSelected,
  isSettingChain,
  vaultChainId,
  flow,
  isWithdrawAmountOverPosition,
  amount,
  txStatus,
  token,
  nextTransaction,
  approvalTokenSymbol,
  sidebarTransactionType,
  referralCodeError,
  login,
  setChain,
  buttonClickEventHandler,
  getTransactionsList,
  executeNextTransaction,
  reset,
  refreshView,
}: UseTransactionSidebarParams) => {
  const secondaryButton = useMemo((): SidebarButton | undefined => {
    if (txStatus === 'txSuccess' && !nextTransaction && userWalletAddress) {
      return {
        label: 'Go back',
        action: () => {
          reset()
          refreshView()
        },
      }
    }

    return undefined
  }, [nextTransaction, refreshView, reset, txStatus, userWalletAddress])

  const primaryButton = useMemo((): SidebarButton => {
    // Ordered rules — first match wins.
    const rules: (() => SidebarButton | undefined)[] = [
      // missing data
      () =>
        !userWalletAddress
          ? { label: 'Log in', action: login, disabled: isAuthModalOpen, loading: isAuthModalOpen }
          : undefined,
      // only if logged in (check above)
      () => (!ownerView ? { label: 'Preview', action: () => null, disabled: true } : undefined),
      () => {
        if (isProperChainSelected && !isSettingChain) {
          return undefined
        }
        const nextChain = getEarnProtocolChainById(vaultChainId)

        return {
          label: `Change network to ${nextChain.name}`,
          action: () => {
            buttonClickEventHandler(`vault-${flow}-change-network-to-${slugify(nextChain.name)}`)
            setChain({ chain: vaultChainId })
          },
          disabled: isSettingChain,
          loading: isSettingChain,
        }
      },
      // withdraw balance check
      () =>
        isWithdrawAmountOverPosition
          ? {
              label: capitalize(sidebarTransactionType),
              action: () => null,
              disabled: true,
              loading: false,
            }
          : undefined,
      () =>
        !amount || amount.isZero()
          ? { label: capitalize(sidebarTransactionType), action: () => null, disabled: true }
          : undefined,
      // if there are transactions pending
      () =>
        ['loadingTx', 'txInProgress'].includes(txStatus)
          ? { label: 'Loading...', action: () => null, disabled: true, loading: true }
          : undefined,
      // if token is loading
      () =>
        !token
          ? { label: 'Loading...', action: () => null, disabled: true, loading: true }
          : undefined,
      // transactions loaded from the SDK - execute them one by one
      () =>
        nextTransaction?.type
          ? {
              label: {
                [TransactionType.Approve]: `Approve ${approvalTokenSymbol}`,
                [TransactionType.Deposit]: 'Deposit',
                [TransactionType.Withdraw]: 'Withdraw',
                [TransactionType.VaultSwitch]: 'Switch',
                [TransactionType.Permit2Authorization]: `Authorize Permit2`,
              }[
                nextTransaction.type as
                  | TransactionType.Approve
                  | TransactionType.Deposit
                  | TransactionType.Withdraw
                  | TransactionType.VaultSwitch
                  | TransactionType.Permit2Authorization
              ],
              action: executeNextTransaction,
            }
          : undefined,
      // if there are no transactions, and the last one was successful
      () =>
        txStatus === 'txSuccess'
          ? { label: 'Success', action: () => null, disabled: true }
          : undefined,
      () =>
        referralCodeError ? { label: 'Preview', action: () => null, disabled: true } : undefined,
    ]

    for (const rule of rules) {
      const result = rule()

      if (result) {
        return result
      }
    }

    return { label: 'Preview', action: getTransactionsList }
  }, [
    userWalletAddress,
    login,
    isAuthModalOpen,
    ownerView,
    isProperChainSelected,
    isSettingChain,
    vaultChainId,
    buttonClickEventHandler,
    flow,
    setChain,
    isWithdrawAmountOverPosition,
    sidebarTransactionType,
    amount,
    txStatus,
    token,
    nextTransaction,
    approvalTokenSymbol,
    executeNextTransaction,
    referralCodeError,
    getTransactionsList,
  ])

  const title = useMemo(() => {
    if (nextTransaction?.type === TransactionType.Withdraw) {
      return 'Preview withdraw'
    }

    return nextTransaction?.type
      ? capitalize(nextTransaction.type)
      : capitalize(TransactionAction.WITHDRAW)
  }, [nextTransaction])

  return {
    title,
    primaryButton,
    secondaryButton,
  }
}
