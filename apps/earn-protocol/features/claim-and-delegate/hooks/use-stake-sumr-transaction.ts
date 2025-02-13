import { useEffect, useState } from 'react'
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'
import { useIsIframe } from '@summerfi/app-earn-ui'

import { accountType } from '@/account-kit/config'
import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { sendSafeTx } from '@/helpers/send-safe-tx'
import { useAppSDK } from '@/hooks/use-app-sdk'

/**
 * Hook to handle staking SUMR tokens through user operation transactions
 * @param {Object} params - Hook parameters
 * @param {number} params.amount - Amount of SUMR tokens to stake
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
  amount,
  onStakeSuccess,
  onApproveSuccess,
  onStakeError,
  onApproveError,
}: {
  amount: bigint
  onStakeSuccess: () => void
  onApproveSuccess: () => void
  onStakeError: () => void
  onApproveError: () => void
}) => {
  const { getStakeTx, getCurrentUser } = useAppSDK()
  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })

  const [stakeSumrTransaction, setStakeSumrTransaction] = useState<() => Promise<unknown>>()
  const [approveSumrTransaction, setApproveSumrTransaction] = useState<() => Promise<unknown>>()
  const isIframe = useIsIframe()
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

  useEffect(() => {
    const fetchStakeTx = async () => {
      const user = getCurrentUser()
      // eslint-disable-next-line no-mixed-operators

      if (amount === 0n) {
        return
      }

      const tx = await getStakeTx({ user, amount })

      if (tx === undefined) {
        throw new Error('stake tx is undefined')
      }

      if (tx.length === 2) {
        const _approveSumrTransaction = async () => {
          if (isIframe) {
            return await sendSafeTx({
              txs: [
                {
                  to: tx[0].transaction.target.value,
                  data: tx[0].transaction.calldata,
                  value: tx[0].transaction.value,
                },
              ],
              onSuccess: onApproveSuccess,
              onError: onApproveError,
            })
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

          return await sendApproveSumrTransaction({
            uo: txParams,
            overrides: resolvedOverrides,
          })
        }

        const _stakeSumrTransaction = async () => {
          if (isIframe) {
            return await sendSafeTx({
              txs: [
                {
                  to: tx[1].transaction.target.value,
                  data: tx[1].transaction.calldata,
                  value: tx[1].transaction.value,
                },
              ],
              onSuccess: onStakeSuccess,
              onError: onStakeError,
            })
          }

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
      } else {
        const _stakeSumrTransaction = async () => {
          if (isIframe) {
            return await sendSafeTx({
              txs: [
                {
                  to: tx[0].transaction.target.value,
                  data: tx[0].transaction.calldata,
                  value: tx[0].transaction.value,
                },
              ],
              onSuccess: onStakeSuccess,
              onError: onStakeError,
            })
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

          return await sendStakeSumrTransaction({
            uo: txParams,
            overrides: resolvedOverrides,
          })
        }

        setStakeSumrTransaction(() => _stakeSumrTransaction)
      }
    }

    void fetchStakeTx()
  }, [amount, isIframe, smartAccountClient])

  return {
    stakeSumrTransaction,
    approveSumrTransaction,
    isLoading: isSendingStakeSumrTransaction || isSendingApproveSumrTransaction,
    error: sendStakeSumrTransactionError ?? sendApproveSumrTransactionError,
  }
}
