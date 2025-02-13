import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'
import { useIsIframe } from '@summerfi/app-earn-ui'

import { accountType } from '@/account-kit/config'
import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { sendSafeTx } from '@/helpers/send-safe-tx'
import { useAppSDK } from '@/hooks/use-app-sdk'

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
  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })
  const isIframe = useIsIframe()

  const { sendUserOperationAsync, error, isSendingUserOperation } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess,
    onError,
  })

  const unstakeSumrTransaction = async () => {
    const tx = await getUnstakeTx({ amount })

    if (tx === undefined) {
      throw new Error('unstake tx is undefined')
    }

    if (isIframe) {
      return await sendSafeTx({
        txs: [
          {
            to: tx[0].transaction.target.value,
            data: tx[0].transaction.calldata,
            value: tx[0].transaction.value,
          },
        ],
        onSuccess,
        onError,
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

    return await sendUserOperationAsync({
      uo: txParams,
      overrides: resolvedOverrides,
    })
  }

  return {
    unstakeSumrTransaction,
    isLoading: isSendingUserOperation,
    error,
  }
}
