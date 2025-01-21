'use client'
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'

import { accountType } from '@/account-kit/config'

import { useAppSDK } from './use-app-sdk'

export const useClaimSumrTransaction = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void
  onError: () => void
}): {
  claimSumrTransaction: () => Promise<unknown>
  isLoading: boolean
  error: Error | null
} => {
  const { getAggregatedClaimsForChainTX, getCurrentUser, getChainInfo } = useAppSDK()

  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })

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

  const claimSumrTransaction = async () => {
    const user = getCurrentUser()
    const chainInfo = getChainInfo()

    const tx = await getAggregatedClaimsForChainTX({ user, chainInfo })

    return await sendUserOperationAsync({
      uo: {
        target: tx.transaction.target.value,
        data: tx.transaction.calldata,
        value: BigInt(tx.transaction.value),
      },
    })
  }

  return {
    claimSumrTransaction,
    isLoading: isSendingUserOperation,
    error: sendUserOperationError,
  }
}
