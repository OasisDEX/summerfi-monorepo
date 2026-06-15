import { useCallback, useState } from 'react'
import { useEarnProtocolSendUserOperation } from '@summerfi/app-earn-ui'
import { type SdkClient } from '@summerfi/sdk-client-react'
import { type ChainId, type IPrice, type RoundState, RoundsVaultType } from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'

import { waitForTransaction } from '@/helpers/wait-for-transaction'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'

export type RwaReceiptStatus = 'claimable' | 'cancellable' | 'pending'

/**
 * A single ERC-1155 receipt the user holds for a given rounds-vault round, enriched
 * with the round's state and (when settled) its exchange rate, plus a derived status:
 *  - `claimable`   round is Settled  → claim shares (Input) / assets (Output)
 *  - `cancellable` round is Opened   → cancel the pending deposit/withdraw
 *  - `pending`     round is settling (or not yet open) → no action available
 */
export type RwaReceipt = {
  vaultType: RoundsVaultType
  roundId: bigint
  balance: bigint
  roundState: RoundState
  exchangeRate?: IPrice
  status: RwaReceiptStatus
}

type UseRwaClaimProps = {
  sdk: SdkClient
  fleetAddress: string
  chainId: number
  // Receipt balances are denominated in the vault's underlying-token base units; the SDK handlers
  // expect a human-readable amount, so we shift by these decimals.
  tokenDecimals: number
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
  tokenDecimals,
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
          // Convert the raw receipt balance to the human-readable amount the SDK expects.
          amount: new BigNumber(receipt.balance.toString()).shiftedBy(-tokenDecimals).toString(),
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
    [
      sdk,
      fleetAddress,
      chainId,
      tokenDecimals,
      walletAddress,
      sendUserOperationAsync,
      publicClient,
      onSuccess,
    ],
  )

  return {
    executeAction,
    actionInProgressKey,
    error,
  }
}
