/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Safe from '@safe-global/safe-apps-sdk'
import {
  getEarnProtocolChainById,
  getSafeTxHash,
  SUCCESS_TOAST_CONFIG,
  useEarnProtocolSendUserOperation,
  useEarnProtocolWallet,
  useIsIframe,
} from '@summerfi/app-earn-ui'
import { type EarnTransactionViewStates, SupportedNetworkIds } from '@summerfi/app-types'
import { supportedSDKNetwork, supportedSDKNetworkId } from '@summerfi/app-utils'

import { useTransactionQueue } from '@/contexts/TransactionQueueContext/TransactionQueueContext'
import { type SDKTransactionItem } from '@/contexts/TransactionQueueContext/types'
import { waitForTransaction } from '@/helpers/wait-for-transaction'
import { usePublicClient } from '@/hooks/usePublicClient'

const parseErrorMessage = (error: string) => {
  const cutoff = error.length > 100 ? `${error.slice(0, 100)}...` : error

  return cutoff.replace(/(\r\n|\n|\r)/gmu, ' ')
}

const waitingSecondsTimePerEachChain: { [key in SupportedNetworkIds]: number } = {
  [SupportedNetworkIds.Mainnet]: 15,
  [SupportedNetworkIds.ArbitrumOne]: 5, // setting 5s as minimum seems reasonable
  [SupportedNetworkIds.Base]: 5,
  [SupportedNetworkIds.SonicMainnet]: 5,
  [SupportedNetworkIds.Hyperliquid]: 5,
}

export const useSimpleTransaction = ({
  chainId,
  onTxSuccess,
  txItem,
}: {
  chainId: SupportedNetworkIds
  onTxSuccess?: (txId: string) => void
  txItem: SDKTransactionItem
}) => {
  const { publicClient } = usePublicClient({
    chain: getEarnProtocolChainById(supportedSDKNetworkId(chainId)),
  })
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const { updateTransaction } = useTransactionQueue()
  const [waitingForTx, setWaitingForTx] = useState<`0x${string}`>()
  const [txStatus, setTxStatus] = useState<EarnTransactionViewStates>(
    txItem.txInitialState ?? 'idle',
  )

  const [txError, setTxError] = useState('')
  const isIframe = useIsIframe()

  useEffect(() => {
    if (txItem.txInitialState && txItem.txInitialState !== txStatus) {
      setTxStatus(txItem.txInitialState)
    }
  }, [txItem.txInitialState, txStatus])

  // Configure User Operation (transaction) sender, passing client which can be undefined
  const {
    sendUserOperation,
    error: sendUserOperationError,
    isSendingUserOperation,
  } = useEarnProtocolSendUserOperation({
    waitForTxn: true,
    onSuccess: ({ hash }) => {
      if (isIframe) {
        getSafeTxHash(hash, supportedSDKNetwork(chainId))
          .then((safeTransactionData) => {
            if (!safeTransactionData) {
              // not a safe transaction, proceed with the original hash
              setWaitingForTx(hash)

              return
            }
            if (safeTransactionData.transactionHash) {
              setWaitingForTx(safeTransactionData.transactionHash)
            }
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error('Error getting the safe tx hash:', err)
          })
      } else {
        setWaitingForTx(hash)
      }
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error('Error executing the transaction:', err)
      setTxStatus('txError')
      setTxError(parseErrorMessage(String(err.message)))
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
          getSafeTxHash(safeTxHash, supportedSDKNetwork(chainId))
            .then((safeTransactionData) => {
              if (!safeTransactionData) {
                // not a safe transaction, proceed with the original hash
                setWaitingForTx(safeTxHash as `0x${string}`)

                return
              }
              if (safeTransactionData.transactionHash) {
                setWaitingForTx(safeTransactionData.transactionHash)
              }
            })
            .catch((err) => {
              // eslint-disable-next-line no-console
              console.error('Error getting the safe tx hash:', err)
            })
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error sending transaction (safe wallet)', err)
          setTxStatus('txError')
          setTxError(parseErrorMessage((err as Error).message))
        })
    },
    [chainId],
  )

  const executeTransaction = useCallback(
    (transaction: SDKTransactionItem) => {
      setTxStatus('txInProgress')
      setTxError('')

      if (!transaction.txData?.transaction) {
        throw new Error('No transaction to execute')
      }
      if (!userWalletAddress) {
        throw new Error('User not logged in')
      }
      if (!publicClient) {
        throw new Error('Public client not available')
      }
      const txParams = {
        data: transaction.txData.transaction.calldata,
        target: transaction.txData.transaction.target.value,
        value: BigInt(transaction.txData.transaction.value ?? 0),
      }

      if (isIframe) {
        sendSafeWalletTransaction(txParams)
      } else {
        sendTransaction(txParams)
      }
    },
    [userWalletAddress, publicClient, isIframe, sendSafeWalletTransaction, sendTransaction],
  )

  const backToInit = useCallback(() => {
    setTxStatus('idle')
  }, [])

  // watch for sendUserOperationError
  useEffect(() => {
    if (sendUserOperationError && txStatus === 'txInProgress') {
      setTxStatus('txError')
      setTxError(parseErrorMessage(sendUserOperationError.message))
    }
  }, [sendUserOperationError, setTxStatus, txStatus])

  // custom wait for tx to be processed
  useEffect(() => {
    if (waitingForTx && txStatus !== 'txSuccess' && publicClient) {
      waitForTransaction({ publicClient, hash: waitingForTx })
        .then(() => {
          setTxStatus('txSuccess')
          // Persist the success onto the queue item so it rehydrates as "Done!"
          // after a reload (instead of resetting to an executable "Execute" state).
          updateTransaction(txItem.id, { txInitialState: 'txSuccess' })
          // refresh the view to get the latest data
          const toastId = toast.info(`Transaction successful, refreshing data...`, {
            ...SUCCESS_TOAST_CONFIG,
            autoClose: false,
          })

          setTimeout(() => {
            onTxSuccess?.(txItem.id)
            toast.dismiss(toastId)
          }, waitingSecondsTimePerEachChain[chainId] * 1000)
          setWaitingForTx(undefined) // Clear waitingForTx after successful execution and state update
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error waiting for transaction', err)
          setTxStatus('txError')
          setTxError(parseErrorMessage((err as Error).message))
        })
    }
  }, [
    waitingForTx,
    txStatus,
    publicClient,
    setTxStatus,
    setWaitingForTx,
    chainId,
    onTxSuccess,
    txItem.id,
    updateTransaction,
  ])

  return {
    executeTransaction,
    backToInit,
    txStatus,
    txError,
    isSendingUserOperation,
  }
}
