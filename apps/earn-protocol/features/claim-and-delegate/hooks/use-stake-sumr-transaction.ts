import { useCallback, useState } from 'react'
import { useEarnProtocolSendUserOperation } from '@summerfi/app-earn-ui'

import { useAppSDK } from '@/hooks/use-app-sdk'

/**
 * Hook to handle staking SUMR tokens through user operation transactions
 * @param {Object} params - Hook parameters
 * @param {() => void} params.onStakeSuccess - Callback function called when the stake transaction succeeds
 * @param {() => void} params.onApproveSuccess - Callback function called when the approve transaction succeeds
 * @param {() => void} params.onStakeError - Callback function called when the stake transaction fails
 * @param {() => void} params.onApproveError - Callback function called when the approve transaction fails
 * @returns {Object} Object containing transaction functions, loading state, and error state
 * @returns {() => Promise<unknown>} returns.stakeSumrTransaction - Function to execute the stake transaction
 * @returns {() => Promise<unknown>} returns.approveSumrTransaction - Function to execute the approve transaction (if needed)
 * @returns {boolean} returns.isLoading - Whether any transaction is currently being processed
 * @returns {Error | null} returns.error - Error object if any transaction failed, null otherwise
 */
export const useStakeSumrTransaction = ({
  onStakeSuccess,
  onApproveSuccess,
  onStakeError,
  onApproveError,
}: {
  onStakeSuccess: () => void
  onApproveSuccess: () => void
  onStakeError: () => void
  onApproveError: () => void
}) => {
  const { getStakeTx, getCurrentUser } = useAppSDK()
  const [stakeSumrTransaction, setStakeSumrTransaction] = useState<
    (() => Promise<unknown>) | undefined
  >(undefined)
  const [approveSumrTransaction, setApproveSumrTransaction] = useState<
    (() => Promise<unknown>) | undefined
  >(undefined)
  const [isFetchingTx, setIsFetchingTx] = useState(false)

  const {
    sendUserOperationAsync: sendStakeSumrTransaction,
    error: sendStakeSumrTransactionError,
    isSendingUserOperation: isSendingStakeSumrTransaction,
  } = useEarnProtocolSendUserOperation({
    waitForTxn: true,
    onSuccess: onStakeSuccess,
    onError: onStakeError,
  })

  const {
    sendUserOperationAsync: sendApproveSumrTransaction,
    error: sendApproveSumrTransactionError,
    isSendingUserOperation: isSendingApproveSumrTransaction,
  } = useEarnProtocolSendUserOperation({
    waitForTxn: true,
    onSuccess: onApproveSuccess,
    onError: onApproveError,
  })

  const prepareTxs = useCallback(
    async (amount: bigint) => {
      if (amount === 0n) {
        return false
      }

      setIsFetchingTx(true)

      try {
        const user = getCurrentUser()
        const tx = await getStakeTx({ user, amount })

        if (tx.length === 2) {
          const _approveSumrTransaction = async () => {
            const txParams = {
              target: tx[0].transaction.target.value,
              data: tx[0].transaction.calldata,
              value: BigInt(tx[0].transaction.value),
            }

            return await sendApproveSumrTransaction(txParams)
          }

          const _stakeSumrTransaction = async () => {
            const txParams = {
              target: tx[1].transaction.target.value,
              data: tx[1].transaction.calldata,
              value: BigInt(tx[1].transaction.value),
            }

            return await sendStakeSumrTransaction(txParams)
          }

          setApproveSumrTransaction(() => _approveSumrTransaction)
          setStakeSumrTransaction(() => _stakeSumrTransaction)

          return true
        } else {
          const _stakeSumrTransaction = async () => {
            const txParams = {
              target: tx[0].transaction.target.value,
              data: tx[0].transaction.calldata,
              value: BigInt(tx[0].transaction.value),
            }

            return await sendStakeSumrTransaction(txParams)
          }

          setStakeSumrTransaction(() => _stakeSumrTransaction)
          setApproveSumrTransaction(undefined)

          return true
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching stake transaction:', error)
        setIsFetchingTx(false)

        return false
      } finally {
        setIsFetchingTx(false)
      }
    },
    [getCurrentUser, getStakeTx, sendApproveSumrTransaction, sendStakeSumrTransaction],
  )

  return {
    stakeSumrTransaction,
    approveSumrTransaction,
    prepareTxs,
    isFetchingTx,
    isLoading: isSendingStakeSumrTransaction || isSendingApproveSumrTransaction || isFetchingTx,
    error: sendStakeSumrTransactionError ?? sendApproveSumrTransactionError,
  }
}
