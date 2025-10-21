/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'
import Safe from '@safe-global/safe-apps-sdk'
import {
  accountType,
  SDKChainIdToAAChainMap,
  useIsIframe,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import { type EarnTransactionViewStates, type SupportedNetworkIds } from '@summerfi/app-types'
import { supportedSDKNetwork } from '@summerfi/app-utils'
import { useRouter } from 'next/navigation'

import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { getSafeTxHash } from '@/helpers/get-safe-tx-hash'
import { waitForTransaction } from '@/helpers/wait-for-transaction'
import { usePublicClient } from '@/hooks/usePublicClient'
import { type SDKTransactionItem } from '@/hooks/useSDKTransactionQueue'

const parseErrorMessage = (error: string) => {
  const cutoff = error.length > 100 ? `${error.slice(0, 100)}...` : error

  return cutoff.replace(/(\r\n|\n|\r)/gmu, ' ')
}

export const useSimpleTransaction = ({ chainId }: { chainId: SupportedNetworkIds }) => {
  const { refresh: refreshView } = useRouter()
  const { publicClient } = usePublicClient({
    chain: SDKChainIdToAAChainMap[chainId],
  })
  const { userWalletAddress } = useUserWallet()
  const [waitingForTx, setWaitingForTx] = useState<`0x${string}`>()
  const [txStatus, setTxStatus] = useState<EarnTransactionViewStates>('idle')
  const [txError, setTxError] = useState('')
  const isIframe = useIsIframe()
  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })

  // Configure User Operation (transaction) sender, passing client which can be undefined
  const {
    sendUserOperation,
    error: sendUserOperationError,
    isSendingUserOperation,
  } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess: ({ hash }) => {
      if (isIframe) {
        getSafeTxHash(hash, supportedSDKNetwork(chainId))
          .then((safeTransactionData) => {
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
    (
      {
        target,
        data,
        value = 0n,
      }: {
        target: `0x${string}`
        data: `0x${string}`
        value?: bigint
      },
      overrides?: { paymasterAndData: `0x${string}` },
    ) => {
      return sendUserOperation({
        uo: {
          target,
          data,
          value,
        },
        overrides,
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
    async (transaction: SDKTransactionItem) => {
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
        value: BigInt(transaction.txData.transaction.value) ?? 0n,
      }

      const resolvedOverrides = await getGasSponsorshipOverride({
        smartAccountClient,
        txParams,
      })

      if (isIframe) {
        sendSafeWalletTransaction(txParams)
      } else {
        sendTransaction(txParams, resolvedOverrides)
      }
    },
    [
      userWalletAddress,
      publicClient,
      smartAccountClient,
      isIframe,
      sendSafeWalletTransaction,
      sendTransaction,
    ],
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
          // refresh the view to get the latest data
          refreshView()
          setWaitingForTx(undefined) // Clear waitingForTx after successful execution and state update
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error waiting for transaction', err)
          setTxStatus('txError')
          setTxError(parseErrorMessage((err as Error).message))
        })
    }
  }, [waitingForTx, txStatus, publicClient, setTxStatus, setWaitingForTx, refreshView])

  return {
    executeTransaction,
    backToInit,
    txStatus,
    txError,
    isSendingUserOperation,
  }
}
