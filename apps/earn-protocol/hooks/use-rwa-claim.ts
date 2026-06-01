import { useCallback, useState } from 'react'
import { useEarnProtocolSendUserOperation } from '@summerfi/app-earn-ui'
import { type SdkClient } from '@summerfi/sdk-client-react'
import { type ChainId, RoundsVaultType } from '@summerfi/sdk-common'

import { waitForTransaction } from '@/helpers/wait-for-transaction'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'
import { type RwaReceipt } from '@/hooks/use-rwa-receipts'

type UseRwaClaimProps = {
  sdk: SdkClient
  fleetAddress: string
  chainId: number
  walletAddress?: string
  // Called after a claim/cancel transaction confirms (e.g. to reload receipts).
  onSuccess?: () => void
}

/** Stable key identifying a receipt row (vault type + round). */
export const getRwaReceiptKey = (receipt: Pick<RwaReceipt, 'vaultType' | 'roundId'>) =>
  `${receipt.vaultType}-${receipt.roundId.toString()}`

/**
 * Executes the per-receipt RWA actions: claim shares (Input, settled), claim assets
 * (Output, settled) or cancel a pending deposit/withdraw (Opened round). These SDK
 * handlers return a single bare TransactionInfo with no approval step, so they are
 * sent directly through the shared send primitive rather than the deposit executor.
 */
export const useRwaClaim = ({
  sdk,
  fleetAddress,
  chainId,
  walletAddress,
  onSuccess,
}: UseRwaClaimProps) => {
  const { publicClient } = useNetworkAlignedClient()
  const { sendUserOperationAsync } = useEarnProtocolSendUserOperation({
    waitForTxn: true,
    forceChainId: chainId,
  })
  const [actionInProgressKey, setActionInProgressKey] = useState<string | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)

  const executeAction = useCallback(
    async (receipt: RwaReceipt) => {
      if (!walletAddress || receipt.status === 'pending') {
        return
      }

      setError(undefined)
      setActionInProgressKey(getRwaReceiptKey(receipt))

      try {
        const baseParams = {
          fleetAddress: fleetAddress as `0x${string}`,
          chainId: chainId as ChainId,
          userAddress: walletAddress as `0x${string}`,
          roundId: receipt.roundId,
          amount: receipt.balance,
        }

        const txInfo =
          receipt.status === 'claimable'
            ? receipt.vaultType === RoundsVaultType.Input
              ? await sdk.getRwaClaimSharesTx(baseParams)
              : await sdk.getRwaClaimAssetsTx(baseParams)
            : await sdk.getRwaCancelRoundDepositTx({
                ...baseParams,
                vaultType: receipt.vaultType,
              })

        const { hash } = await sendUserOperationAsync({
          target: txInfo.transaction.target.value,
          data: txInfo.transaction.calldata,
          value: BigInt(txInfo.transaction.value),
        })

        await waitForTransaction({ publicClient, hash })

        onSuccess?.()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('RWA claim/cancel transaction failed', err)
        setError(err instanceof Error ? err.message : 'Transaction failed')
      } finally {
        setActionInProgressKey(undefined)
      }
    },
    [sdk, fleetAddress, chainId, walletAddress, sendUserOperationAsync, publicClient, onSuccess],
  )

  return {
    executeAction,
    actionInProgressKey,
    error,
  }
}
