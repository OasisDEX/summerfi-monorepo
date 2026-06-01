import { useMemo } from 'react'
import { getEarnProtocolChainById, getVaultPositionUrl } from '@summerfi/app-earn-ui'
import {
  type EarnTransactionViewStates,
  type SDKVaultishType,
  type SupportedNetworkIds,
  TransactionAction,
  type TransactionWithStatus,
} from '@summerfi/app-types'
import { slugify, supportedSDKNetwork } from '@summerfi/app-utils'
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
  // state / flags
  isEditingSwitchAmount: boolean
  userWalletAddress?: `0x${string}`
  isAuthModalOpen: boolean
  ownerView?: boolean
  isProperChainSelected: boolean
  isSettingChain: boolean
  vaultChainId: SupportedNetworkIds
  flow: 'open' | 'manage'
  tokenBalanceLoading: boolean
  tokenBalance: BigNumber | undefined
  isSwitch: boolean
  // synchronous balance checks from useTransactionValidation, used to disable the button
  isDepositAmountOverBalance: boolean
  isWithdrawAmountOverPosition: boolean
  amount: BigNumber | undefined
  txStatus: EarnTransactionViewStates
  token: IToken | undefined
  nextTransaction?: TransactionWithStatus
  approvalTokenSymbol: string
  sidebarTransactionType: TransactionAction
  selectedSwitchVault?: `${string}-${number}`
  referralCodeError?: string | null
  // CoW (manage-view) deposit-with-swap flow; never set on the open view.
  isDepositWithSwap?: boolean
  vault: SDKVaultishType
  // callbacks
  login: () => void
  setChain: (params: { chain: number }) => void
  buttonClickEventHandler: (event: string) => void
  setIsTransakOpen: (open: boolean) => void
  getTransactionsList: () => void
  executeNextTransaction: () => void
  push: (href: string) => void
  reset: () => void
  refreshView: () => void
}

/**
 * Builds the transaction sidebar view-model (title + primary/secondary buttons) from
 * the current transaction state. Extracted from `useTransaction` so the large button
 * decision tree lives on its own and can be shared with the manage-view (CoW) flow.
 *
 * The primary button is expressed as an ordered list of rules: the first rule that
 * returns a button wins. The order is significant and mirrors the original cascade.
 */
export const useTransactionSidebar = ({
  isEditingSwitchAmount,
  userWalletAddress,
  isAuthModalOpen,
  ownerView,
  isProperChainSelected,
  isSettingChain,
  vaultChainId,
  flow,
  tokenBalanceLoading,
  tokenBalance,
  isSwitch,
  isDepositAmountOverBalance,
  isWithdrawAmountOverPosition,
  amount,
  txStatus,
  token,
  nextTransaction,
  approvalTokenSymbol,
  sidebarTransactionType,
  selectedSwitchVault,
  referralCodeError,
  isDepositWithSwap = false,
  vault,
  login,
  setChain,
  buttonClickEventHandler,
  setIsTransakOpen,
  getTransactionsList,
  executeNextTransaction,
  push,
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
    // Ordered rules — first match wins. Order mirrors the original cascade.
    const rules: (() => SidebarButton | undefined)[] = [
      // special case for editing the switch amount - it has its own button
      () => (isEditingSwitchAmount ? { label: '', hidden: true, loading: false } : undefined),
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
      () =>
        !tokenBalanceLoading && tokenBalance && tokenBalance.isZero() && flow === 'open'
          ? {
              label: 'Buy crypto',
              action: () => {
                buttonClickEventHandler(`vault-${flow}-buy-crypto`)
                setIsTransakOpen(true)
              },
              disabled: false,
            }
          : undefined,
      // deposit balance check
      () =>
        isDepositAmountOverBalance
          ? {
              label: capitalize(sidebarTransactionType),
              action: () => null,
              disabled: true,
              loading: false,
            }
          : undefined,
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
      // we want to check that only on deposit/withdraw
      () =>
        (!amount || amount.isZero()) && !isSwitch
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
      // switch check
      () => {
        if (!isSwitch) {
          return undefined
        }
        if (txStatus === 'txSuccess' && !nextTransaction && userWalletAddress) {
          return {
            label: 'Go to new position',
            action: () => {
              buttonClickEventHandler(`vault-${flow}-go-to-new-position`)
              push(
                getVaultPositionUrl({
                  network: supportedSDKNetwork(vault.protocol.network),
                  vaultId: selectedSwitchVault?.split('-')[0] ?? '',
                  walletAddress: userWalletAddress,
                }),
              )
            },
          }
        }

        return {
          label: `Preview ${capitalize(sidebarTransactionType)}`,
          action: getTransactionsList,
          disabled: !selectedSwitchVault,
        }
      },
      // if there are no transactions, and the last one was successful
      // if this is what you're seeing it means it should automatically refresh the view
      // if it didnt, it's a bug
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
    isEditingSwitchAmount,
    ownerView,
    isProperChainSelected,
    isSettingChain,
    tokenBalanceLoading,
    tokenBalance,
    flow,
    isDepositAmountOverBalance,
    amount,
    isWithdrawAmountOverPosition,
    isSwitch,
    txStatus,
    token,
    nextTransaction,
    referralCodeError,
    getTransactionsList,
    login,
    isAuthModalOpen,
    vaultChainId,
    setChain,
    buttonClickEventHandler,
    sidebarTransactionType,
    approvalTokenSymbol,
    executeNextTransaction,
    userWalletAddress,
    selectedSwitchVault,
    push,
    setIsTransakOpen,
    vault.protocol.network,
  ])

  const title = useMemo(() => {
    // switch has slightly different title
    if (
      sidebarTransactionType === TransactionAction.SWITCH &&
      nextTransaction?.type === TransactionType.Approve
    ) {
      return 'Switch your position'
    }
    if (
      sidebarTransactionType === TransactionAction.SWITCH &&
      !nextTransaction &&
      txStatus === 'txSuccess'
    ) {
      return 'Position switched!'
    }
    if (nextTransaction?.type === TransactionType.Deposit) {
      return 'Preview deposit'
    }

    if (nextTransaction?.type === TransactionType.Withdraw) {
      return 'Preview withdraw'
    }

    if (nextTransaction?.type === TransactionType.VaultSwitch) {
      return 'Preview switch'
    }

    if (nextTransaction?.type === TransactionType.Permit2Authorization) {
      return 'Permit2 authorization'
    }
    if (isDepositWithSwap) {
      return 'Preview deposit with swap'
    }

    return nextTransaction?.type
      ? capitalize(nextTransaction.type)
      : capitalize(TransactionAction.DEPOSIT)
  }, [nextTransaction, sidebarTransactionType, txStatus, isDepositWithSwap])

  return {
    title,
    primaryButton,
    secondaryButton,
  }
}
