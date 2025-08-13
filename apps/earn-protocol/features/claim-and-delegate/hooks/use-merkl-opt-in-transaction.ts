'use client'
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'
import { accountType, useIsIframe } from '@summerfi/app-earn-ui'
import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { type PublicClient } from 'viem'

import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useSafeTransaction } from '@/hooks/use-safe-transaction'

/**
 * Hook to handle opt-in to merkl distribution through a user operation transaction
 * @param {Object} params - Hook parameters
 * @param {() => void} params.onSuccess - Callback function called when the transaction succeeds
 * @param {() => void} params.onError - Callback function called when the transaction fails
 * @returns {Object} Object containing the claim transaction function, loading state, and error state
 * @returns {() => Promise<unknown>} returns.merklOptInTransaction - Function to execute the claim transaction
 * @returns {boolean} returns.isLoading - Whether the transaction is currently being processed
 * @returns {Error | null} returns.error - Error object if the transaction failed, null otherwise
 */
export const useMerklOptInTransaction = ({
  onSuccess,
  onError,
  network,
  publicClient,
}: {
  onSuccess: () => void
  onError: () => void
  network: SupportedSDKNetworks
  publicClient?: PublicClient
}): {
  merklOptInTransaction: () => Promise<unknown>
  isLoading: boolean
  error: Error | null
} => {
  const { getAuthorizeAsMerklRewardsOperatorTx, getCurrentUser, getChainInfo } = useAppSDK()

  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })

  const { sendSafeWalletTransaction, waitingForTx } = useSafeTransaction({
    network,
    onSuccess,
    onError,
    publicClient,
  })

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

  const merklOptInTransaction = async () => {
    const user = getCurrentUser()
    const chainInfo = getChainInfo()

    const tx = await getAuthorizeAsMerklRewardsOperatorTx({ user, chainInfo })

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

  return {
    merklOptInTransaction,
    isLoading: isSendingUserOperation || !!waitingForTx,
    error: sendUserOperationError,
  }
}
