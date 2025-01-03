'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useAuthModal,
  useChain,
  useSendUserOperation,
  useSmartAccountClient,
  useUser,
} from '@account-kit/react'
import {
  type EarnAllowanceTypes,
  type EarnTransactionViewStates,
  type SDKVaultishType,
  TransactionAction,
} from '@summerfi/app-types'
import { ten, zero } from '@summerfi/app-utils'
import {
  Address,
  type ExtendedTransactionInfo,
  getChainInfoByChainId,
  type IToken,
  TokenAmount,
  TransactionType,
} from '@summerfi/sdk-client-react'
import type { ChainId } from '@summerfi/serverless-shared'
import type BigNumber from 'bignumber.js'
import { capitalize } from 'lodash-es'
import { useRouter } from 'next/navigation'

import { accountType, SDKChainIdToAAChainMap } from '@/account-kit/config'
import { useSlippageConfig } from '@/features/nav-config/hooks/useSlippageConfig'
import { getApprovalTx } from '@/helpers/get-approval-tx'
import { waitForTransaction } from '@/helpers/wait-for-transaction'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { type useClient } from '@/hooks/use-client'
import { useClientChainId } from '@/hooks/use-client-chain-id'

type UseTransactionParams = {
  vault: SDKVaultishType
  vaultChainId: ChainId.BASE | ChainId.ARBITRUM
  amount: BigNumber | undefined
  manualSetAmount: (amount: string | undefined) => void
  vaultToken: IToken | undefined
  token: IToken | undefined
  tokenBalance: BigNumber | undefined
  tokenBalanceLoading: boolean
  publicClient?: ReturnType<typeof useClient>['publicClient']
  flow: 'open' | 'manage'
}

export const useTransaction = ({
  vault,
  vaultChainId,
  manualSetAmount,
  amount,
  publicClient,
  vaultToken,
  token,
  tokenBalance,
  tokenBalanceLoading,
  flow,
}: UseTransactionParams) => {
  const [slippageConfig] = useSlippageConfig()
  const { refresh: refreshView } = useRouter()
  const user = useUser()
  const { getDepositTX, getWithdrawTX } = useAppSDK()
  const { openAuthModal, isOpen: isAuthModalOpen } = useAuthModal()
  const [isTransakOpen, setIsTransakOpen] = useState(false)
  const { setChain, isSettingChain } = useChain()
  const { clientChainId } = useClientChainId()
  const [transactionType, setTransactionType] = useState<TransactionAction>(
    TransactionAction.DEPOSIT,
  )
  const [waitingForTx, setWaitingForTx] = useState<`0x${string}`>()
  const [approvalType, setApprovalType] = useState<EarnAllowanceTypes>('deposit')
  const [approvalCustomValue, setApprovalCustomValue] = useState<BigNumber>(zero)
  const [txHashes, setTxHashes] = useState<{ type: TransactionType; hash: string }[]>([])
  const [txStatus, setTxStatus] = useState<EarnTransactionViewStates>('idle')
  const [transactions, setTransactions] = useState<ExtendedTransactionInfo[]>()
  const [sidebarError, setSidebarError] = useState<string>()

  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })

  const isProperChainSelected = clientChainId === vaultChainId

  const nextTransaction = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return undefined
    }

    return transactions[0]
  }, [transactions])

  // Configure User Operation (transaction) sender, passing client which can be undefined
  const {
    sendUserOperation,
    error: sendUserOperationError,
    isSendingUserOperation,
  } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess: ({ hash }) => {
      setWaitingForTx(hash)
      if (nextTransaction) {
        setTxHashes((prev) => [
          ...prev,
          {
            type: nextTransaction.type,
            hash,
          },
        ])
      }
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error('Error executing the transaction:', err)

      if (err instanceof Error) {
        setSidebarError(err.message)
      } else {
        setSidebarError('Error executing the transaction')
      }
    },
  })

  const sendTransaction = useCallback(
    ({
      target,
      data,
      value = 0n,
    }: {
      target: `0x${string}`
      data: `0x${string}`
      value?: bigint
    }) => {
      return sendUserOperation({
        uo: {
          target,
          data,
          value,
        },
      })
    },
    [sendUserOperation],
  )

  const executeNextTransaction = useCallback(() => {
    setTxStatus('txInProgress')

    if (!nextTransaction) {
      throw new Error('No transaction to execute')
    }
    if (!user) {
      throw new Error('User not logged in')
    }
    if (!publicClient) {
      throw new Error('Public client not available')
    }
    if (!token) {
      throw new Error('Token not loaded')
    }

    const txParams =
      nextTransaction.type === TransactionType.Approve && approvalType !== 'deposit'
        ? {
            target: nextTransaction.transaction.target.value,
            data: getApprovalTx(
              user.address,
              BigInt(approvalCustomValue.times(ten.pow(token.decimals)).toString()),
            ),
          }
        : {
            target: nextTransaction.transaction.target.value,
            data: nextTransaction.transaction.calldata,
          }

    sendTransaction(txParams)
  }, [
    token,
    approvalCustomValue,
    approvalType,
    nextTransaction,
    publicClient,
    sendTransaction,
    setTxStatus,
    user,
  ])

  const backToInit = useCallback(() => {
    // just goes to the first view, without any transactions loaded
    setTransactions(undefined)
    setTxStatus('idle')
    setApprovalType('deposit')
  }, [setApprovalType, setTransactions, setTxStatus])

  const reset = useCallback(() => {
    // resets everything
    backToInit()
    manualSetAmount(undefined)
    setSidebarError(undefined)
    setTxHashes([])
  }, [backToInit, manualSetAmount, setSidebarError, setTxHashes])

  const removeTxHash = useCallback(
    (txHash: string) => {
      setTxHashes((prev) => prev.filter((tx) => tx.hash !== txHash))
    },
    [setTxHashes],
  )

  const getTransactionsList = useCallback(async () => {
    if (token && vaultToken && amount && user) {
      const fromToken = {
        [TransactionAction.DEPOSIT]: token,
        [TransactionAction.WITHDRAW]: vaultToken,
      }[transactionType]
      const toToken = {
        [TransactionAction.DEPOSIT]: vaultToken,
        [TransactionAction.WITHDRAW]: token,
      }[transactionType]

      setTxStatus('loadingTx')
      try {
        const transactionsList = await {
          [TransactionAction.DEPOSIT]: getDepositTX,
          [TransactionAction.WITHDRAW]: getWithdrawTX,
        }[transactionType]({
          walletAddress: Address.createFromEthereum({
            value: user.address,
          }),
          amount: TokenAmount.createFrom({
            token: fromToken,
            amount: amount.toString(),
          }),
          toToken,
          fleetAddress: vault.id,
          chainInfo: getChainInfoByChainId(vaultChainId),
          slippage: Number(slippageConfig.slippage),
        })

        if (transactionsList.length === 0) {
          throw new Error('Error getting the transactions list')
        }
        setTransactions(transactionsList)
        setTxStatus('txPrepared')
      } catch (err) {
        if (err instanceof Error) {
          setSidebarError(err.message)
        } else {
          setSidebarError('Error getting the transaction')
        }
      }
    }
  }, [
    token,
    vaultToken,
    amount,
    user,
    setTxStatus,
    transactionType,
    setTransactions,
    getDepositTX,
    vault.id,
    vaultChainId,
    getWithdrawTX,
    setSidebarError,
    slippageConfig.slippage,
  ])

  const sidebarPrimaryButton = useMemo(() => {
    // missing data
    if (!user) {
      return {
        label: 'Log in',
        action: openAuthModal,
        disabled: isAuthModalOpen,
        loading: isAuthModalOpen,
      }
    }
    if (!isProperChainSelected || isSettingChain) {
      return {
        label: `Change network to ${vaultChainId}`,
        action: () => {
          setChain({
            chain: SDKChainIdToAAChainMap[vaultChainId],
          })
        },
        disabled: isSettingChain,
        loading: isSettingChain,
      }
    }

    if (!tokenBalanceLoading && tokenBalance && tokenBalance.isZero() && flow === 'open') {
      return {
        label: 'Add funds',
        action: () => setIsTransakOpen(true),
        disabled: false,
      }
    }

    if (!amount || amount.isZero()) {
      return {
        label: capitalize(transactionType),
        action: () => null,
        disabled: true,
      }
    }

    // if there are transactions pending
    if (['loadingTx', 'txInProgress'].includes(txStatus)) {
      return {
        label: 'Loading...',
        action: () => null,
        disabled: true,
        loading: true,
      }
    }

    // if token is loading
    if (!token) {
      return {
        label: 'Loading...',
        action: () => null,
        disabled: true,
        loading: true,
      }
    }

    // transactions loaded from the SDK
    // execute them one by one
    if (nextTransaction?.type) {
      return {
        label: {
          [TransactionType.Approve]: `Approve ${token.symbol}`,
          [TransactionType.Deposit]: 'Deposit',
          [TransactionType.Withdraw]: 'Withdraw',
        }[nextTransaction.type],
        action: executeNextTransaction,
      }
    }

    // if there are no transactions, and the last one was successful
    // if this is what you're seeing it means it should automatically refresh the view
    // if it didnt, it's a bug
    if (txStatus === 'txSuccess') {
      return {
        label: 'Success',
        action: () => null,
        disabled: true,
      }
    }

    return {
      label: 'Preview',
      action: getTransactionsList,
    }
  }, [
    token,
    flow,
    tokenBalanceLoading,
    tokenBalance,
    user,
    isProperChainSelected,
    isSettingChain,
    amount,
    txStatus,
    nextTransaction?.type,
    transactionType,
    getTransactionsList,
    openAuthModal,
    isAuthModalOpen,
    vaultChainId,
    setChain,
    executeNextTransaction,
  ])

  const sidebarTitle = useMemo(() => {
    if (nextTransaction?.type === TransactionType.Deposit) {
      return 'Preview deposit'
    }

    return nextTransaction?.type
      ? capitalize(nextTransaction.type)
      : capitalize(TransactionAction.DEPOSIT)
  }, [nextTransaction?.type])

  // refresh data when all transactions are executed and are successful
  useEffect(() => {
    if (
      txStatus === 'txSuccess' &&
      !isSendingUserOperation &&
      transactions?.length === 0 &&
      !waitingForTx
    ) {
      refreshView()
      reset()
    }
  }, [refreshView, reset, waitingForTx, transactions?.length, txStatus, isSendingUserOperation])

  // watch for sendUserOperationError
  useEffect(() => {
    if (sendUserOperationError && txStatus === 'txInProgress') {
      setTxStatus('txError')
    }
  }, [sendUserOperationError, setTxStatus, txStatus])

  // custom wait for tx to be processed
  useEffect(() => {
    if (waitingForTx && txStatus !== 'txSuccess' && publicClient) {
      waitForTransaction({ publicClient, hash: waitingForTx })
        .then(() => {
          setTxStatus('txSuccess')
          setWaitingForTx(undefined)
          setTransactions(transactions?.slice(1))
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error waiting for transaction', err)
          setTxStatus('txError')
        })
    }
  }, [
    waitingForTx,
    txStatus,
    publicClient,
    transactions,
    setTxStatus,
    setWaitingForTx,
    setTransactions,
  ])

  return {
    manualSetAmount,
    sidebar: {
      title: sidebarTitle,
      primaryButton: sidebarPrimaryButton,
      error: sidebarError,
    },
    nextTransaction,
    txHashes,
    removeTxHash,
    vaultChainId,
    reset,
    backToInit,
    user,
    setTransactionType,
    transactionType,
    approvalType,
    setApprovalType,
    setApprovalCustomValue,
    approvalCustomValue,
    isTransakOpen,
    setIsTransakOpen,
  }
}
