import { useCallback, useState } from 'react'
import { useChain, useSendUserOperation, useSmartAccountClient } from '@account-kit/react'
import { getAccountType } from '@summerfi/app-earn-ui'

import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { useAppSDK } from '@/hooks/use-app-sdk'

/**
 * Hook to handle staking SUMR tokens V2 (with lockup period) through user operation transactions
 * @param {Object} params - Hook parameters
 * @param {() => void} params.onStakeSuccess - Callback function called when the stake transaction succeeds
 * @param {() => void} params.onApproveSuccess - Callback function called when the approve transaction succeeds
 * @param {() => void} params.onStakeError - Callback function called when the stake transaction fails
 * @param {() => void} params.onApproveError - Callback function called when the approve transaction fails
 * @returns {Object} Object containing transaction functions, loading state, and error state
 * @returns {() => Promise<unknown>} returns.stakeSumrTransaction - Function to execute the stake transaction
 * @returns {() => Promise<unknown>} returns.approveSumrTransaction - Function to execute the approve transaction (if needed)
 * @returns {(amount: bigint, lockupPeriod: bigint) => Promise<{approve?: () => Promise<unknown>, stake: () => Promise<unknown>} | null>} returns.prepareTxs - Function to prepare the stake transactions and return the prepared callbacks
 * @returns {boolean} returns.isFetchingTx - Whether the transactions are being prepared
 * @returns {boolean} returns.isLoading - Whether any transaction is currently being processed
 * @returns {Error | null} returns.error - Error object if any transaction failed, null otherwise
 */
export const useStakeSumrTransactionV2 = ({
  onStakeSuccess,
  onApproveSuccess,
  onStakeError,
  onApproveError,
}: {
  onStakeSuccess: () => void
  onApproveSuccess: () => void
  onStakeError: () => void
  onApproveError: () => void
}): {
  stakeSumrTransaction: (() => Promise<unknown>) | undefined
  approveSumrTransaction: (() => Promise<unknown>) | undefined
  prepareTxs: (
    amount: bigint,
    lockupPeriod: bigint,
  ) => Promise<{ approve?: () => Promise<unknown>; stake: () => Promise<unknown> } | null>
  isFetchingTx: boolean
  isLoading: boolean
  error: Error | null
} => {
  const { getStakeTxV2, getCurrentUser } = useAppSDK()
  const { chain } = useChain()
  const { client: smartAccountClient } = useSmartAccountClient({ type: getAccountType(chain.id) })

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
  } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess: onStakeSuccess,
    onError: onStakeError,
  })

  const {
    sendUserOperationAsync: sendApproveSumrTransaction,
    error: sendApproveSumrTransactionError,
    isSendingUserOperation: isSendingApproveSumrTransaction,
  } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess: onApproveSuccess,
    onError: onApproveError,
  })

  const prepareTxs = useCallback(
    async (amount: bigint, lockupPeriod: bigint) => {
      if (amount === 0n) {
        return null
      }

      setIsFetchingTx(true)

      try {
        const user = getCurrentUser()
        const tx = await getStakeTxV2({ user, amount, lockupPeriod })

        if (tx.length === 2) {
          const _approveSumrTransaction = async () => {
            const txParams = {
              target: tx[0].transaction.target.value,
              data: tx[0].transaction.calldata,
              value: BigInt(tx[0].transaction.value),
            }

            const resolvedOverrides = await getGasSponsorshipOverride({
              smartAccountClient,
              txParams,
            })

            return await sendApproveSumrTransaction({
              uo: txParams,
              overrides: resolvedOverrides,
            })
          }

          const _stakeSumrTransaction = async () => {
            const txParams = {
              target: tx[1].transaction.target.value,
              data: tx[1].transaction.calldata,
              value: BigInt(tx[1].transaction.value),
            }

            const resolvedOverrides = await getGasSponsorshipOverride({
              smartAccountClient,
              txParams,
            })

            return await sendStakeSumrTransaction({
              uo: txParams,
              overrides: resolvedOverrides,
            })
          }

          setApproveSumrTransaction(() => _approveSumrTransaction)
          setStakeSumrTransaction(() => _stakeSumrTransaction)

          return { approve: _approveSumrTransaction, stake: _stakeSumrTransaction }
        } else {
          const _stakeSumrTransaction = async () => {
            const txParams = {
              target: tx[0].transaction.target.value,
              data: tx[0].transaction.calldata,
              value: BigInt(tx[0].transaction.value),
            }

            const resolvedOverrides = await getGasSponsorshipOverride({
              smartAccountClient,
              txParams,
            })

            return await sendStakeSumrTransaction({
              uo: txParams,
              overrides: resolvedOverrides,
            })
          }

          setStakeSumrTransaction(() => _stakeSumrTransaction)
          setApproveSumrTransaction(undefined)

          return { stake: _stakeSumrTransaction }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching stake transaction:', error)
        setIsFetchingTx(false)

        return null
      } finally {
        setIsFetchingTx(false)
      }
    },
    [
      getCurrentUser,
      getStakeTxV2,
      sendApproveSumrTransaction,
      sendStakeSumrTransaction,
      smartAccountClient,
    ],
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
