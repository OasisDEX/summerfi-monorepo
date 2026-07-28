'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Safe from '@safe-global/safe-apps-sdk'
import { useEarnProtocolSendUserOperation, useIsIframe } from '@summerfi/app-earn-ui'
import type {
  EarnAllowanceTypes,
  EarnTransactionViewStates,
  SDKVaultishType,
  TransactionAction,
  TransactionWithStatus,
} from '@summerfi/app-types'
import { supportedSDKNetwork, ten } from '@summerfi/app-utils'
import { type IToken, TransactionType } from '@summerfi/sdk-common'
import type BigNumber from 'bignumber.js'
import { type PublicClient } from 'viem'

import { getApprovalTx } from '@/helpers/get-approval-tx'
import { resolveSafeTxHashAndStamp } from '@/helpers/resolve-safe-tx-hash'
import {
  getTransactionExecutionErrorMessage,
  transactionErrorsMap as errorsMap,
} from '@/helpers/transaction-errors'
import { waitForTransaction } from '@/helpers/wait-for-transaction'

type UseTransactionCoreParams = {
  vault: SDKVaultishType
  amount: BigNumber | undefined
  token: IToken | undefined
  isWithdraw: boolean
  sidebarTransactionType: TransactionAction
  publicClient?: PublicClient
  approvalCustomValue?: BigNumber
  userWalletAddress?: `0x${string}`
}

/**
 * The shared transaction state machine + sender used by the manage-view hook.
 */
export const useTransactionCore = ({
  vault,
  token,
  sidebarTransactionType,
  publicClient,
  approvalCustomValue,
  userWalletAddress,
}: UseTransactionCoreParams) => {
  const isIframe = useIsIframe()

  const [waitingForTx, setWaitingForTx] = useState<`0x${string}`>()
  const [approvalType, setApprovalType] = useState<EarnAllowanceTypes>('deposit')
  const [txStatus, setTxStatus] = useState<EarnTransactionViewStates>('idle')
  const [transactions, setTransactions] = useState<TransactionWithStatus[] | undefined>()
  const [sidebarTransactionError, setSidebarTransactionError] = useState<string>()

  const nextTransaction = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return undefined
    }

    return transactions.find((tx) => !tx.executed)
  }, [transactions])

  const approvalTokenSymbol = useMemo(() => {
    return nextTransaction?.type === TransactionType.Approve
      ? nextTransaction.metadata.approvalAmount.token.symbol
      : ''
  }, [nextTransaction])

  // Configure User Operation (transaction) sender, passing client which can be undefined
  const {
    sendUserOperation,
    error: sendUserOperationError,
    isSendingUserOperation,
  } = useEarnProtocolSendUserOperation({
    waitForTxn: true,
    onSuccess: ({ hash }) => {
      if (isIframe) {
        resolveSafeTxHashAndStamp({
          hash,
          network: supportedSDKNetwork(vault.protocol.network),
          nextTransaction,
          setWaitingForTx,
          setTransactions,
        })
      } else {
        setWaitingForTx(hash)
        if (nextTransaction) {
          setTransactions((prev) =>
            prev?.map((tx) =>
              !tx.executed && !tx.txHash && tx.type === nextTransaction.type
                ? { ...tx, txHash: hash }
                : tx,
            ),
          )
        }
      }
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error('Error executing the transaction:', err)

      setSidebarTransactionError(getTransactionExecutionErrorMessage(err))
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
        target,
        data,
        value,
      })
    },
    [sendUserOperation],
  )

  const sendSafeWalletTransaction = useCallback(
    ({
      target,
      data,
      value = 0n,
    }: {
      target: `0x${string}`
      data: `0x${string}`
      value?: bigint
    }) => {
      const safeWallet = new Safe()

      safeWallet.txs
        .send({
          txs: [
            {
              to: target,
              data,
              value: value.toString(),
            },
          ],
        })
        .then(({ safeTxHash }) => {
          setTxStatus('txInProgress')
          resolveSafeTxHashAndStamp({
            hash: safeTxHash as `0x${string}`,
            network: supportedSDKNetwork(vault.protocol.network),
            nextTransaction,
            setWaitingForTx,
            setTransactions,
          })
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error sending transaction (safe wallet)', err)
          setTxStatus('txError')
          setSidebarTransactionError(`${errorsMap.transactionExecutionError}`)
        })
    },
    [nextTransaction, vault.protocol.network],
  )

  const executeNextTransaction = useCallback(() => {
    setTxStatus('txInProgress')

    if (!nextTransaction) {
      throw new Error('No transaction to execute')
    }
    if (!userWalletAddress) {
      throw new Error('User not logged in')
    }
    if (!publicClient) {
      throw new Error('Public client not available')
    }
    if (!token) {
      throw new Error('Token not loaded')
    }

    const txParams =
      nextTransaction.type === TransactionType.Approve &&
      approvalType !== 'deposit' &&
      approvalCustomValue
        ? {
            target: nextTransaction.transaction.target.value,
            data: getApprovalTx(
              nextTransaction.metadata.approvalSpender.value,
              BigInt(
                approvalCustomValue
                  .times(ten.pow(nextTransaction.metadata.approvalAmount.token.decimals))
                  .toString(),
              ),
            ),
            value: BigInt(nextTransaction.transaction.value),
          }
        : {
            target: nextTransaction.transaction.target.value,
            data: nextTransaction.transaction.calldata,
            value: BigInt(nextTransaction.transaction.value),
          }

    if (isIframe) {
      sendSafeWalletTransaction(txParams)
    } else {
      sendTransaction(txParams)
    }
  }, [
    nextTransaction,
    publicClient,
    token,
    approvalType,
    approvalCustomValue,
    isIframe,
    sendSafeWalletTransaction,
    sendTransaction,
    setTxStatus,
    userWalletAddress,
  ])

  const backToInit = useCallback(() => {
    // just goes to the first view, without any transactions loaded
    setTransactions(undefined)
    setTxStatus('idle')
    setApprovalType('deposit')
  }, [])

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

          // Mark the completed transaction as executed: true
          setTransactions((prevTransactions) =>
            prevTransactions?.map((tx) => {
              if (
                tx.transaction.calldata === nextTransaction?.transaction.calldata &&
                !tx.executed
              ) {
                return { ...tx, executed: true }
              }

              return tx
            }),
          )
          setWaitingForTx(undefined)
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error waiting for transaction', err)
          setTxStatus('txError')
          setSidebarTransactionError(`${errorsMap.transactionExecutionError}`)
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
    nextTransaction,
    sidebarTransactionType,
  ])

  return {
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
    backToInit,
    sidebarTransactionError,
    setSidebarTransactionError,
    isSendingUserOperation,
  }
}
