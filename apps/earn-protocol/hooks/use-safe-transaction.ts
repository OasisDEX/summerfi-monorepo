import { useCallback, useEffect, useState } from 'react'
import Safe from '@safe-global/safe-apps-sdk'
import { type Address, type SDKNetwork, type TxData } from '@summerfi/app-types'
import { type PublicClient } from 'viem'

import { getSafeTxHash } from '@/helpers/get-safe-tx-hash'
import { waitForTransaction } from '@/helpers/wait-for-transaction'

/**
 * Hook for managing Safe wallet transactions
 * To be used in standalone transactions (without tx queue)
 *
 * @param network - The sdk network to use
 * @param onSuccess - Callback when transaction succeeds
 * @param onError - Callback when transaction fails
 * @param publicClient - Optional Viem client for transaction monitoring
 * @returns Object with sendSafeWalletTransaction function and waitingForTx state
 */
export const useSafeTransaction = ({
  network,
  onSuccess,
  onError,
  publicClient,
}: {
  network: SDKNetwork
  onSuccess: () => void
  onError: () => void
  publicClient?: PublicClient
}) => {
  const [waitingForTx, setWaitingForTx] = useState<Address | undefined>(undefined)

  const sendSafeWalletTransaction = useCallback(
    ({ target, data, value = 0n }: { target: Address; data: TxData; value?: bigint }) => {
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
    sendSafeWalletTransaction,
    waitingForTx,
  }
}
