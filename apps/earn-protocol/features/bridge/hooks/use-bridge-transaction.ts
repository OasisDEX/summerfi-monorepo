'use client'
import { useCallback, useState } from 'react'
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'
import { useIsIframe } from '@summerfi/app-earn-ui'
import { type Address, type Chain } from 'viem'

import { accountType } from '@/account-kit/config'
import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { sendSafeTx } from '@/helpers/send-safe-tx'
import { useAppSDK } from '@/hooks/use-app-sdk'

interface BridgeTransactionParams {
  amount: string
  sourceChain: Chain
  destinationChain: Chain
  recipient: Address
  onSuccess: () => void
  onError: () => void
}

export function useBridgeTransaction({
  amount,
  sourceChain,
  destinationChain,
  recipient,
  onSuccess,
  onError,
}: BridgeTransactionParams) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const isIframe = useIsIframe()
  const { getBridgeTx, getCurrentUser, getChainInfo } = useAppSDK()
  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })

  const { sendUserOperationAsync, isSendingUserOperation } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess,
    onError,
  })

  const executeBridgeTransaction = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const user = getCurrentUser()
      const chainInfo = getChainInfo()

      const tx = await getBridgeTx({
        user,
        recipient,
        sourceChain: chainInfo,
        targetChain: destinationChain,
        amount: {
          value: amount,
          // Note: You'll need to add token info here based on your requirements
          token: {
            /* token details */
          },
        },
      })

      if (!tx) {
        throw new Error('Bridge transaction is undefined')
      }

      if (isIframe) {
        return await sendSafeTx({
          txs: [
            {
              to: tx.transaction.target.value,
              data: tx.transaction.calldata,
              value: tx.transaction.value,
            },
          ],
          onSuccess,
          onError,
        })
      }

      const txParams = {
        target: tx.transaction.target.value,
        data: tx.transaction.calldata,
        value: BigInt(tx.transaction.value),
      }

      const resolvedOverrides = await getGasSponsorshipOverride({
        smartAccountClient,
        txParams,
      })

      return await sendUserOperationAsync({
        uo: txParams,
        overrides: resolvedOverrides,
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      onError()

      throw err
    } finally {
      setIsLoading(false)
    }
  }, [
    amount,
    recipient,
    destinationChain,
    getBridgeTx,
    getCurrentUser,
    getChainInfo,
    smartAccountClient,
    sendUserOperationAsync,
    isIframe,
    onSuccess,
    onError,
  ])

  return {
    executeBridgeTransaction,
    isLoading: isLoading || isSendingUserOperation,
    error,
  }
}
