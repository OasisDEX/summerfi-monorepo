/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client'

import { type Dispatch, type SetStateAction, useCallback, useEffect } from 'react'
import {
  getVaultUrl,
  useEarnProtocolChain,
  useEarnProtocolLogin,
  useEarnProtocolWallet,
} from '@summerfi/app-earn-ui'
import {
  type SDKVaultishType,
  type SupportedNetworkIds,
  TransactionAction,
  type TransactionWithStatus,
} from '@summerfi/app-types'
import { sdkNetworkToHumanNetwork, slugifyVault, supportedSDKNetwork } from '@summerfi/app-utils'
import {
  Address,
  getChainInfoByChainId,
  type IToken,
  TokenAmount,
  type TransactionInfo,
} from '@summerfi/sdk-common'
import type BigNumber from 'bignumber.js'
import { useRouter } from 'next/navigation'
import { type PublicClient } from 'viem'

import { formatTxAmount } from '@/helpers/transaction-analytics'
import { transactionErrorsMap as errorsMap } from '@/helpers/transaction-errors'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useHandleButtonClickEvent, useHandleTransactionEvent } from '@/hooks/use-mixpanel-event'
import { useRevalidatePositionData } from '@/hooks/use-revalidate'
import { useTransactionCore } from '@/hooks/use-transaction-core'
import { useTransactionSidebar } from '@/hooks/use-transaction-sidebar'
import { useTransactionValidation } from '@/hooks/use-transaction-validation'

type UseTransactionParams = {
  vault: SDKVaultishType
  vaultChainId: SupportedNetworkIds
  amount: BigNumber | undefined
  manualSetAmount: (amount: string | undefined) => void
  vaultToken: IToken | undefined
  token: IToken | undefined
  publicClient?: PublicClient
  flow: 'open' | 'manage'
  ownerView?: boolean
  positionAmount?: BigNumber
  approvalCustomValue?: BigNumber
  approvalTokenSymbol?: string
  sidebarTransactionType: TransactionAction
  setSidebarTransactionType?: Dispatch<SetStateAction<TransactionAction>>
  referralCode?: string
  referralCodeError?: string | null
  // Called once a withdraw completes successfully.
  onTransactionSuccess?: () => void
}

export const useTransaction = ({
  vault,
  vaultChainId,
  manualSetAmount,
  amount,
  publicClient,
  vaultToken,
  token,
  flow,
  ownerView,
  positionAmount,
  approvalCustomValue,
  sidebarTransactionType,
  setSidebarTransactionType,
  referralCode,
  referralCodeError,
  onTransactionSuccess,
}: UseTransactionParams) => {
  const { refresh: refreshView, push } = useRouter()
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const transactionEventHandler = useHandleTransactionEvent()
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const { getWithdrawTx: getWithdrawTX } = useAppSDK()
  const { login, isOpen: isAuthModalOpen } = useEarnProtocolLogin()
  const { setChain, isSettingChain, chain } = useEarnProtocolChain()
  const revalidatePositionData = useRevalidatePositionData()

  const isProperChainSelected = chain.id === vaultChainId
  const isWithdraw = sidebarTransactionType === TransactionAction.WITHDRAW

  const { validationError, clearValidationError, isWithdrawAmountOverPosition } =
    useTransactionValidation({
      amount,
      positionAmount,
      isWithdraw,
      sidebarTransactionType,
    })

  const {
    transactions,
    setTransactions,
    txStatus,
    setTxStatus,
    waitingForTx,
    nextTransaction,
    approvalTokenSymbol,
    approvalType,
    setApprovalType,
    executeNextTransaction,
    backToInit: coreBackToInit,
    sidebarTransactionError,
    setSidebarTransactionError,
    isSendingUserOperation,
  } = useTransactionCore({
    vault,
    amount,
    token,
    isWithdraw,
    sidebarTransactionType,
    publicClient,
    flow,
    approvalCustomValue,
    userWalletAddress,
  })

  const getTransactionsList = useCallback(async () => {
    if (isWithdraw && ownerView && token && vaultToken && amount && userWalletAddress) {
      try {
        setTxStatus('loadingTx')
        const transactionsList: TransactionInfo[] = await getWithdrawTX({
          walletAddress: Address.createFromEthereum({
            value: userWalletAddress,
          }),
          amount: TokenAmount.createFrom({
            token: vaultToken,
            amount: amount.toString(),
          }),
          toToken: token,
          fleetAddress: vault.id,
          chainInfo: getChainInfoByChainId(vaultChainId),
          slippage: 0,
          ...(referralCode ? { referralCode } : {}),
        })

        transactionEventHandler({
          transactionType: 'withdraw',
          txAmount: formatTxAmount(amount, token),
          txEvent: 'transactionSimulated',
          vaultSlug: slugifyVault(vault),
          result: 'success',
        })

        if (transactionsList.length <= 0) {
          throw new Error('Error getting the transactions list')
        }
        setTransactions(
          transactionsList.map((tx) => ({ ...tx, executed: false }) as TransactionWithStatus),
        )
        setTxStatus('txPrepared')
      } catch (err) {
        transactionEventHandler({
          transactionType: 'withdraw',
          txEvent: 'transactionSimulated',
          txAmount: formatTxAmount(amount, token),
          vaultSlug: slugifyVault(vault),
          result: 'failure',
        })
        setSidebarTransactionError(
          err instanceof Error ? err.message : errorsMap.transactionRetrievalError,
        )
      }
    }
  }, [
    isWithdraw,
    ownerView,
    token,
    vaultToken,
    amount,
    userWalletAddress,
    setTxStatus,
    getWithdrawTX,
    vaultChainId,
    referralCode,
    transactionEventHandler,
    vault,
    setTransactions,
    setSidebarTransactionError,
  ])

  const backToInit = useCallback(() => {
    coreBackToInit()
  }, [coreBackToInit])

  const reset = useCallback(() => {
    backToInit()
    manualSetAmount(undefined)
    setSidebarTransactionError(undefined)
    clearValidationError()
    setSidebarTransactionType?.(TransactionAction.WITHDRAW)
    buttonClickEventHandler(`vault-${flow}-sidebar-reset`)
  }, [
    backToInit,
    buttonClickEventHandler,
    clearValidationError,
    flow,
    manualSetAmount,
    setSidebarTransactionError,
    setSidebarTransactionType,
  ])

  const {
    title: sidebarTitle,
    primaryButton: sidebarPrimaryButton,
    secondaryButton: sidebarSecondaryButton,
  } = useTransactionSidebar({
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
  })

  // refresh data when all transactions are executed and are successful
  useEffect(() => {
    if (
      txStatus === 'txSuccess' &&
      !isSendingUserOperation &&
      transactions?.every((tx) => tx.executed) &&
      !waitingForTx
    ) {
      reset()
      if (userWalletAddress) {
        refreshView()
        revalidatePositionData({
          chainName: sdkNetworkToHumanNetwork(supportedSDKNetwork(vault.protocol.network)),
          vaultId: vault.id,
          walletAddress: userWalletAddress,
        })

        onTransactionSuccess?.()

        const isClosing =
          isWithdraw && positionAmount && flow === 'manage' && amount?.eq(positionAmount)

        if (isClosing) {
          push(getVaultUrl(vault))
        }
      }
    }
  }, [
    refreshView,
    amount,
    flow,
    isSendingUserOperation,
    positionAmount,
    push,
    reset,
    sidebarTransactionType,
    revalidatePositionData,
    txStatus,
    vault,
    waitingForTx,
    userWalletAddress,
    isWithdraw,
    transactions,
    onTransactionSuccess,
  ])

  return {
    manualSetAmount,
    sidebar: {
      title: sidebarTitle,
      primaryButton: sidebarPrimaryButton,
      secondaryButton: sidebarSecondaryButton,
      error: sidebarTransactionError ?? validationError,
    },
    nextTransaction,
    vaultChainId,
    reset,
    backToInit,
    userWalletAddress,
    approvalTokenSymbol,
    approvalType,
    setApprovalType,
    transactions,
    txStatus,
    setSidebarTransactionError,
  }
}
