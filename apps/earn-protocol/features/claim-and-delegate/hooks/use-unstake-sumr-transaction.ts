import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'
import { accountType, ERROR_TOAST_CONFIG, SUCCESS_TOAST_CONFIG } from '@summerfi/app-earn-ui'
import { NetworkIds, type TransactionWithStatus } from '@summerfi/app-types'
import { User } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { debounce } from 'lodash-es'
import { waitForTransactionReceipt } from 'viem/actions'

import { SUMR_DECIMALS } from '@/features/bridge/constants/decimals'
import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { revalidateUser } from '@/helpers/revalidation-handlers'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'

/**
 * Hook to handle unstaking SUMR tokens through a user operation transaction
 * @param {Object} params - Hook parameters
 * @param {number} params.amount - Amount of SUMR tokens to unstake
 * @param {() => void} params.onSuccess - Callback function called when the transaction succeeds
 * @param {() => void} params.onError - Callback function called when the transaction fails
 * @returns {Object} Object containing the unstake transaction function, loading state, and error state
 * @returns {() => Promise<unknown>} returns.unstakeSumrTransaction - Function to execute the unstake transaction
 * @returns {boolean} returns.isLoading - Whether the transaction is currently being processed
 * @returns {Error | null} returns.error - Error object if the transaction failed, null otherwise
 */
export const useUnstakeSumrTransaction = ({
  amount,
  onSuccess,
  onError,
}: {
  amount: bigint
  onSuccess: () => void
  onError: () => void
}): {
  unstakeSumrTransaction: () => Promise<unknown>
  isLoading: boolean
  error: Error | null
} => {
  const { getUnstakeTx } = useAppSDK()
  const [isLocalTxLoading, setIsLocalTxLoading] = useState(false)
  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })
  const { publicClient } = useNetworkAlignedClient({
    overrideNetwork: 'Base',
  })

  const { sendUserOperationAsync, error, isSendingUserOperation } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess,
    onError,
  })

  const unstakeSumrTransaction = async () => {
    const tx = await getUnstakeTx({ amount })

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (tx === undefined) {
      throw new Error('unstake tx is undefined')
    }

    const txParams = {
      target: tx[0].transaction.target.value,
      data: tx[0].transaction.calldata,
      value: BigInt(tx[0].transaction.value),
    }

    const resolvedOverrides = await getGasSponsorshipOverride({
      smartAccountClient,
      txParams,
    })

    return await sendUserOperationAsync({
      uo: txParams,
      overrides: resolvedOverrides,
    }).then(async (result) => {
      setIsLocalTxLoading(true)
      await waitForTransactionReceipt(publicClient, {
        hash: result.hash,
        confirmations: 2,
      }).finally(() => {
        setIsLocalTxLoading(false)
      })
    })
  }

  return {
    unstakeSumrTransaction,
    isLoading: isSendingUserOperation || isLocalTxLoading,
    error,
  }
}

export const useUnstakeV2SumrTransaction = ({
  amount,
  userAddress,
  userStakeIndex,
  refetchStakingData,
  onAllTransactionsComplete,
}: {
  amount: string
  userAddress?: string
  userStakeIndex: bigint
  refetchStakingData: () => Promise<void>
  onAllTransactionsComplete?: () => void
}): {
  triggerNextTransaction: () => Promise<unknown>
  isLoadingTransactions: boolean
  isSendingTransaction: boolean
  error: Error | null
  transactionQueue?: TransactionWithStatus[]
  buttonLabel?: string
  prepareTransactions: () => Promise<void>
} => {
  const amountParsed = BigInt(
    new BigNumber(amount).multipliedBy(new BigNumber(10).pow(SUMR_DECIMALS)).toFixed(0),
  )
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  const [isLocalTxLoading, setIsLocalTxLoading] = useState(false)
  const [transactionQueue, setTransactionQueue] = useState<TransactionWithStatus[]>()
  const { getUnstakeTxV2 } = useAppSDK()
  const { publicClient } = useNetworkAlignedClient({
    overrideNetwork: 'Base',
  })
  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })
  // debounce amount by 500ms to avoid rapid calls to getUnstakeTxV2
  const [debouncedAmount, setDebouncedAmount] = useState<bigint>(amountParsed)
  const debouncedSetAmount = useMemo(
    () =>
      debounce((a: bigint) => {
        setDebouncedAmount(a)
      }, 500),
    [],
  )

  useEffect(() => {
    debouncedSetAmount(amountParsed)

    return () => {
      debouncedSetAmount.cancel()
    }
  }, [amountParsed, debouncedSetAmount])

  const { sendUserOperationAsync, error, isSendingUserOperation } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess: () => {
      toast.success('Transaction successful', SUCCESS_TOAST_CONFIG)
      revalidateUser(userAddress)
    },
    onError: () => {
      toast.error('Failed to unstake $SUMR tokens', ERROR_TOAST_CONFIG)
    },
  })

  useEffect(() => {
    // refetchStakingData after all transactions are executed
    if (transactionQueue && transactionQueue.every((tx) => tx.executed)) {
      onAllTransactionsComplete?.()
      refetchStakingData()
      setTransactionQueue(undefined)
    }
  }, [refetchStakingData, transactionQueue, onAllTransactionsComplete])

  const nextTransaction = useMemo(() => {
    if (!transactionQueue) {
      return undefined
    }

    return transactionQueue.find((tx) => !tx.executed)
  }, [transactionQueue])

  const prepareTransactions = useCallback(async () => {
    setIsLoadingTransactions(true)
    try {
      const txs = await getUnstakeTxV2({
        amount: debouncedAmount,
        user: User.createFromEthereum(NetworkIds.BASEMAINNET, userAddress as `0x${string}`),
        userStakeIndex,
      })

      const mappedTransactions = txs.map((tx) => ({
        ...tx,
        executed: false,
      }))

      setTransactionQueue(mappedTransactions as TransactionWithStatus[])
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error preparing unstake transactions:', e)

      throw e
    } finally {
      setIsLoadingTransactions(false)
    }
  }, [debouncedAmount, getUnstakeTxV2, userAddress, userStakeIndex])

  useEffect(() => {
    if (!userAddress) return

    prepareTransactions()
  }, [debouncedAmount, getUnstakeTxV2, userAddress, userStakeIndex, prepareTransactions])

  const triggerNextTransaction = useCallback(async () => {
    if (!nextTransaction) {
      return Promise.resolve(undefined)
    }

    const txParams = {
      target: nextTransaction.transaction.target.value,
      data: nextTransaction.transaction.calldata,
      value: BigInt(nextTransaction.transaction.value),
    }

    return await getGasSponsorshipOverride({
      smartAccountClient,
      txParams,
    })
      .then((resolvedOverrides) =>
        sendUserOperationAsync({
          uo: txParams,
          overrides: resolvedOverrides,
        }),
      )
      .then(async (result) => {
        setIsLocalTxLoading(true)
        await waitForTransactionReceipt(publicClient, {
          hash: result.hash,
          confirmations: 2,
        }).finally(() => {
          setIsLocalTxLoading(false)
        })
        setTransactionQueue((prevQueue) => {
          if (!prevQueue) return prevQueue

          const updatedQueue = prevQueue.map((tx) => {
            if (tx.type === nextTransaction.type) {
              return { ...tx, executed: true }
            }

            return tx
          })

          return updatedQueue
        })

        return result
      })
  }, [nextTransaction, sendUserOperationAsync, smartAccountClient, publicClient])

  return {
    triggerNextTransaction,
    transactionQueue,
    isLoadingTransactions,
    isSendingTransaction: isSendingUserOperation || isLocalTxLoading,
    error,
    buttonLabel: nextTransaction?.type,
    prepareTransactions,
  }
}
