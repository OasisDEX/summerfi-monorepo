'use client'
import { useCallback, useEffect, useState } from 'react'
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'
import Safe from '@safe-global/safe-apps-sdk'
import { useIsIframe } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'
import { type PublicClient } from 'viem'

import { accountType } from '@/account-kit/config'
import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { getSafeTxHash } from '@/helpers/get-safe-tx-hash'
import { waitForTransaction } from '@/helpers/wait-for-transaction'
import { useAppSDK } from '@/hooks/use-app-sdk'

/**
 * Hook to handle claiming SUMR tokens through a user operation transaction
 * @param {Object} params - Hook parameters
 * @param {() => void} params.onSuccess - Callback function called when the transaction succeeds
 * @param {() => void} params.onError - Callback function called when the transaction fails
 * @returns {Object} Object containing the claim transaction function, loading state, and error state
 * @returns {() => Promise<unknown>} returns.claimSumrTransaction - Function to execute the claim transaction
 * @returns {boolean} returns.isLoading - Whether the transaction is currently being processed
 * @returns {Error | null} returns.error - Error object if the transaction failed, null otherwise
 */
export const useClaimSumrTransaction = ({
  onSuccess,
  onError,
  network,
  publicClient,
}: {
  onSuccess: () => void
  onError: () => void
  network: SDKNetwork
  publicClient?: PublicClient
}): {
  claimSumrTransaction: () => Promise<unknown>
  isLoading: boolean
  error: Error | null
} => {
  const [waitingForTx, setWaitingForTx] = useState<`0x${string}` | undefined>(undefined)
  const { getAggregatedClaimsForChainTx, getCurrentUser, getChainInfo } = useAppSDK()

  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })

  const isIframe = useIsIframe()

  const {
    sendUserOperationAsync,
    error: sendUserOperationError,
    isSendingUserOperation,
  } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess,
    onError,
  })

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
          getSafeTxHash(safeTxHash, network)
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
          onError()
        })
    },
    [network, onError],
  )

  const claimSumrTransaction = async () => {
    const user = getCurrentUser()
    const chainInfo = getChainInfo()

    const tx = await getAggregatedClaimsForChainTx({ user, chainInfo })

    if (tx === undefined) {
      throw new Error('aggregated claims tx is undefined')
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

    if (isIframe) {
      return sendSafeWalletTransaction(txParams)
    }

    return await sendUserOperationAsync({
      uo: txParams,
      overrides: resolvedOverrides,
    })
  }

  useEffect(() => {
    if (waitingForTx && publicClient) {
      waitForTransaction({ publicClient, hash: waitingForTx })
        .then((receipt) => {
          if (receipt.status === 'success') {
            onSuccess()
          } else {
            onError()
          }
        })
        .finally(() => {
          setWaitingForTx(undefined)
        })
    }
  }, [waitingForTx, publicClient, onSuccess, onError])

  return {
    claimSumrTransaction,
    isLoading: isSendingUserOperation || !!waitingForTx,
    error: sendUserOperationError,
  }
}
