import { useEffect, useState } from 'react'
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'

import { accountType } from '@/account-kit/config'
import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { useAppSDK } from '@/hooks/use-app-sdk'

/**
 * Hook to handle migrating a vault through user operation transactions
 * @param {Object} params - Hook parameters
 * @param {number} params.amount - Amount of SUMR tokens to migrate
 * @param {() => void} params.onMigrateSuccess - Callback function called when the migrate transaction succeeds
 * @param {() => void} params.onApproveSuccess - Callback function called when the approve transaction succeeds
 * @param {() => void} params.onMigrateError - Callback function called when the migrate transaction fails
 * @param {() => void} params.onApproveError - Callback function called when the approve transaction fails
 * @returns {Object} Object containing transaction functions, loading state, and error state
 * @returns {() => Promise<unknown>} returns.migrateTransaction - Function to execute the migrate transaction
 * @returns {() => Promise<unknown>} returns.approveTransaction - Function to execute the approve transaction (if needed)
 * @returns {boolean} returns.isLoading - Whether any transaction is currently being processed
 * @returns {Error | null} returns.error - Error object if any transaction failed, null otherwise
 */
export const useMigrateTransaction = ({
  amount,
  onMigrateSuccess,
  onMigrateError,
  onApproveSuccess,
  onApproveError,
}: {
  amount: bigint
  onMigrateSuccess: () => void
  onMigrateError: () => void
  onApproveSuccess: () => void
  onApproveError: () => void
}) => {
  const { getMigrateTx, getCurrentUser } = useAppSDK()
  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })

  const [migrateTransaction, setMigrateTransaction] = useState<() => Promise<unknown>>()
  const [approveTransaction, setApproveTransaction] = useState<() => Promise<unknown>>()
  const {
    sendUserOperationAsync: sendMigrateTransaction,
    error: sendMigrateTransactionError,
    isSendingUserOperation: isSendingMigrateTransaction,
  } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess: onMigrateSuccess,
    onError: onMigrateError,
  })

  const {
    sendUserOperationAsync: sendApproveTransaction,
    error: sendApproveTransactionError,
    isSendingUserOperation: isSendingApproveTransaction,
  } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess: onApproveSuccess,
    onError: onApproveError,
  })

  useEffect(() => {
    const fetchMigrateTx = async () => {
      const user = getCurrentUser()
      // eslint-disable-next-line no-mixed-operators

      if (amount === 0n) {
        return
      }

      const tx = await getMigrateTx({ user, amount })

      if (tx === undefined) {
        throw new Error('migrate tx is undefined')
      }

      if (tx.length === 2) {
        const _approveTransaction = async () => {
          const txParams = {
            target: tx[0].transaction.target.value,
            data: tx[0].transaction.calldata,
            value: BigInt(tx[0].transaction.value),
          }

          const resolvedOverrides = await getGasSponsorshipOverride({
            smartAccountClient,
            txParams,
          })

          return await sendApproveTransaction({
            uo: txParams,
            overrides: resolvedOverrides,
          })
        }

        const _migrateTransaction = async () => {
          const txParams = {
            target: tx[1].transaction.target.value,
            data: tx[1].transaction.calldata,
            value: BigInt(tx[1].transaction.value),
          }

          const resolvedOverrides = await getGasSponsorshipOverride({
            smartAccountClient,
            txParams,
          })

          return await sendMigrateTransaction({
            uo: txParams,
            overrides: resolvedOverrides,
          })
        }

        setApproveTransaction(() => _approveTransaction)
        setMigrateTransaction(() => _migrateTransaction)
      } else {
        const _migrateTransaction = async () => {
          const txParams = {
            target: tx[0].transaction.target.value,
            data: tx[0].transaction.calldata,
            value: BigInt(tx[0].transaction.value),
          }

          const resolvedOverrides = await getGasSponsorshipOverride({
            smartAccountClient,
            txParams,
          })

          return await sendMigrateTransaction({
            uo: txParams,
            overrides: resolvedOverrides,
          })
        }

        setMigrateTransaction(() => _migrateTransaction)
      }
    }

    void fetchMigrateTx()
  }, [
    amount,
    getCurrentUser,
    getMigrateTx,
    sendApproveTransaction,
    sendMigrateTransaction,
    smartAccountClient,
  ])

  return {
    migrateTransaction,
    approveTransaction,
    isLoading: isSendingMigrateTransaction || isSendingApproveTransaction,
    error: sendMigrateTransactionError ?? sendApproveTransactionError,
  }
}
