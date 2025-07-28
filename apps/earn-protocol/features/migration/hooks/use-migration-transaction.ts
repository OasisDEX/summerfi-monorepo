import { useCallback, useEffect, useState } from 'react'
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'
import { accountType, SDKChainIdToAAChainMap, useIsIframe } from '@summerfi/app-earn-ui'
import { type Address, type SupportedNetworkIds, type TransactionHash } from '@summerfi/app-types'
import { chainIdToSDKNetwork, supportedNetworkId } from '@summerfi/app-utils'
import {
  type ApproveTransactionInfo,
  getChainInfoByChainId,
  type MigrationTransactionInfo,
  TransactionType,
} from '@summerfi/sdk-common'

import { MigrationSteps } from '@/features/migration/types'
import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { getSafeTxHash } from '@/helpers/get-safe-tx-hash'
import { waitForTransaction } from '@/helpers/wait-for-transaction'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { usePublicClient } from '@/hooks/use-public-client'

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
 * @param {MigrationSteps} params.step - The current step of the migration
 * @returns {Object} Object containing transaction functions, loading state, and error state
 * @returns {Object} returns.migrateTransaction - Object containing the migrate transaction function and data
 * @returns {Object} returns.approveTransaction - Object containing the approve transaction function and data (if needed)
 * @returns {boolean} returns.isLoading - Whether any transaction is currently being processed
 * @returns {Error | null} returns.error - Error object if any transaction failed, null otherwise
 * @returns {TransactionHash[]} returns.txHashes - Array of transaction hashes
 * @returns {(txHash: string) => void} returns.removeTxHash - Function to remove a transaction hash from the array
 */
export const useMigrationTransaction = ({
  onMigrationSuccess,
  onMigrationError,
  onApproveSuccess,
  onApproveError,
  handleInitialStep,
  walletAddress,
  fleetAddress,
  positionId,
  slippage,
  step,
  vaultChainId,
}: {
  onMigrationSuccess: () => void
  onMigrationError: () => void
  onApproveSuccess: () => void
  onApproveError: () => void
  handleInitialStep: (initialStep: MigrationSteps) => void
  walletAddress: string
  fleetAddress: string
  positionId: Address
  slippage: number
  step: MigrationSteps
  vaultChainId: SupportedNetworkIds
}) => {
  const { publicClient } = usePublicClient({
    chain: SDKChainIdToAAChainMap[supportedNetworkId(vaultChainId)],
  })
  const isIframe = useIsIframe()
  const { getMigrateTx } = useAppSDK()
  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })
  const [waitingForTx, setWaitingForTx] = useState<TransactionHash>()
  const [txHashes, setTxHashes] = useState<
    { type: TransactionType; hash?: string; custom?: string }[]
  >([])

  const [migrationTransaction, setMigrationTransaction] = useState<{
    tx: () => Promise<unknown>
    txData: MigrationTransactionInfo
  }>()
  const [approveTransaction, setApproveTransaction] = useState<{
    tx: () => Promise<unknown>
    txData: ApproveTransactionInfo
  }>()

  const removeTxHash = useCallback(
    (txHash: string) => {
      setTxHashes((prev) => prev.filter((tx) => tx.hash !== txHash))
    },
    [setTxHashes],
  )

  const onSuccessHandler = useCallback(
    ({
      hash,
      type,
      message,
    }: {
      hash: TransactionHash
      type: TransactionType
      message: string
    }) => {
      if (isIframe) {
        getSafeTxHash(hash, chainIdToSDKNetwork(vaultChainId))
          .then((safeTransactionData) => {
            if (safeTransactionData.transactionHash) {
              setWaitingForTx(safeTransactionData.transactionHash)
            }

            setTxHashes((prev) => [
              ...prev,
              {
                type,
                hash: safeTransactionData.transactionHash,
              },
            ])

            if (
              safeTransactionData.confirmations.length > safeTransactionData.confirmationsRequired
            ) {
              setTxHashes((prev) => [
                ...prev,
                {
                  type,
                  custom: message,
                },
              ])
            }
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error('Error getting the safe tx hash:', err)
          })
      } else {
        setWaitingForTx(hash)
        setTxHashes((prev) => [
          ...prev,
          {
            type,
            hash,
          },
        ])
      }
    },
    [isIframe, vaultChainId],
  )

  const {
    sendUserOperationAsync: sendApproveTransaction,
    error: sendApproveTransactionError,
    isSendingUserOperation: isSendingApproveTransaction,
  } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess: ({ hash }) => {
      onSuccessHandler({
        hash,
        type: TransactionType.Approve,
        message:
          'Multisig transaction detected. After all approval confirmations are done, the position will be ready for migration.',
      })
    },
    onError: onApproveError,
  })

  const {
    sendUserOperationAsync: sendMigrateTransaction,
    error: sendMigrationTransactionError,
    isSendingUserOperation: isSendingMigrationTransaction,
  } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess: ({ hash }) => {
      onSuccessHandler({
        hash,
        type: TransactionType.Migration,
        message:
          'Multisig transaction detected. After all confirmations are done, the position will be ready.',
      })
    },
    onError: onMigrationError,
  })

  useEffect(() => {
    const fetchMigrateTx = async () => {
      const chainInfo = getChainInfoByChainId(vaultChainId)

      const tx = await getMigrateTx({
        walletAddress,
        chainInfo,
        fleetAddress,
        positionIds: [positionId],
        slippage,
      })

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
        setMigrationTransaction({ tx: _migrateTransaction, txData: tx[1] })
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

        setMigrationTransaction({ tx: _migrateTransaction, txData: tx[0] })
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
    vaultChainId,
  ])

  useEffect(() => {
    if (waitingForTx) {
      waitForTransaction({ publicClient, hash: waitingForTx })
        .then(() => {
          if (step === MigrationSteps.MIGRATE) {
            setMigrationTransaction(undefined)
            onMigrationSuccess()
          } else {
            setApproveTransaction(undefined)
            onApproveSuccess()
          }

          setWaitingForTx(undefined)
        })
        .catch((err) => {
          if (step === MigrationSteps.MIGRATE) {
            onMigrationError()
          } else {
            onApproveError()
          }

          // eslint-disable-next-line no-console
          console.error('Error waiting for transaction:', err)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitingForTx, publicClient, step])

  return {
    migrationTransaction,
    approveTransaction,
    isLoading: isSendingMigrationTransaction || isSendingApproveTransaction,
    error: sendMigrationTransactionError ?? sendApproveTransactionError,
    txHashes,
    removeTxHash,
  }
}
