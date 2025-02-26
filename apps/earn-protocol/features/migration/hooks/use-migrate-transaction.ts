import { useEffect, useState } from 'react'
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'
import {
  type ApproveTransactionInfo,
  getChainInfoByChainId,
  type MigrationTransactionInfo,
} from '@summerfi/sdk-common'

import { accountType } from '@/account-kit/config'
import { MigrationSteps } from '@/features/migration/types'
import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useClientChainId } from '@/hooks/use-client-chain-id'

/**
 * Hook to handle migrating a vault through user operation transactions
 * @param {Object} params - Hook parameters
 * @param {() => void} params.onMigrateSuccess - Callback function called when the migrate transaction succeeds
 * @param {() => void} params.onMigrateError - Callback function called when the migrate transaction fails
 * @param {() => void} params.onApproveSuccess - Callback function called when the approve transaction succeeds
 * @param {() => void} params.onApproveError - Callback function called when the approve transaction fails
 * @param {string} params.walletAddress - The address of the user's wallet
 * @param {string} params.fleetAddress - The address of the fleet contract
 * @param {`0x${string}`} params.positionId - The ID of the position to migrate
 * @param {number} params.slippage - The slippage tolerance for the migration
 * @param {(initialStep: MigrationSteps) => void} params.handleInitialStep - Callback to handle the initial migration step
 * @returns {Object} Object containing transaction functions, loading state, and error state
 * @returns {Object} returns.migrateTransaction - Object containing the migrate transaction function and data
 * @returns {Object} returns.approveTransaction - Object containing the approve transaction function and data (if needed)
 * @returns {boolean} returns.isLoading - Whether any transaction is currently being processed
 * @returns {Error | null} returns.error - Error object if any transaction failed, null otherwise
 */
export const useMigrateTransaction = ({
  onMigrateSuccess,
  onMigrateError,
  onApproveSuccess,
  onApproveError,
  walletAddress,
  fleetAddress,
  positionId,
  slippage,
  handleInitialStep,
}: {
  onMigrateSuccess: () => void
  onMigrateError: () => void
  onApproveSuccess: () => void
  onApproveError: () => void
  walletAddress: string
  fleetAddress: string
  positionId: `0x${string}`
  slippage: number
  handleInitialStep: (initialStep: MigrationSteps) => void
}) => {
  const { clientChainId } = useClientChainId()
  const { getMigrateTx } = useAppSDK()
  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })

  const [migrateTransaction, setMigrateTransaction] = useState<{
    tx: () => Promise<unknown>
    txData: MigrationTransactionInfo
  }>()
  const [approveTransaction, setApproveTransaction] = useState<{
    tx: () => Promise<unknown>
    txData: ApproveTransactionInfo
  }>()

  const {
    sendUserOperationAsync: sendMigrateTransaction,
    error: sendMigrateTransactionError,
    isSendingUserOperation: isSendingMigrateTransaction,
  } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess: () => {
      onMigrateSuccess()
      setMigrateTransaction(undefined)
    },
    onError: onMigrateError,
  })

  const {
    sendUserOperationAsync: sendApproveTransaction,
    error: sendApproveTransactionError,
    isSendingUserOperation: isSendingApproveTransaction,
  } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess: () => {
      onApproveSuccess()
      setApproveTransaction(undefined)
    },
    onError: onApproveError,
  })

  useEffect(() => {
    const fetchMigrateTx = async () => {
      const chainInfo = getChainInfoByChainId(clientChainId)

      const tx = await getMigrateTx({
        walletAddress,
        chainInfo,
        fleetAddress,
        positionIds: [positionId],
        slippage,
      })

      if (tx === undefined) {
        throw new Error('migrate tx is undefined')
      }

      if (tx.length === 2) {
        handleInitialStep(MigrationSteps.APPROVE)

        const _approveTransaction = async () => {
          const txParams = {
            target: tx[0][0].transaction.target.value,
            data: tx[0][0].transaction.calldata,
            value: BigInt(tx[0][0].transaction.value),
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

        setApproveTransaction({ tx: _approveTransaction, txData: tx[0][0] })
        setMigrateTransaction({ tx: _migrateTransaction, txData: tx[1] })
      } else {
        handleInitialStep(MigrationSteps.MIGRATE)

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

        setMigrateTransaction({ tx: _migrateTransaction, txData: tx[0] })
      }
    }

    void fetchMigrateTx()
    // sendApproveTransaction and sendMigrateTransaction were skipped on purpose
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getMigrateTx,
    smartAccountClient,
    walletAddress,
    fleetAddress,
    positionId,
    slippage,
    clientChainId,
  ])

  return {
    migrateTransaction,
    approveTransaction,
    isLoading: isSendingMigrateTransaction || isSendingApproveTransaction,
    error: sendMigrateTransactionError ?? sendApproveTransactionError,
  }
}
