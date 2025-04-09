'use client'
import { useCallback, useState } from 'react'
import {
  type SendUserOperationWithEOA,
  useSendUserOperation,
  useSmartAccountClient,
} from '@account-kit/react'
import {
  type BridgeTransactionInfo,
  type IAddress,
  QuoteData,
  TokenAmount,
} from '@summerfi/sdk-common'
import { type Chain, formatEther } from 'viem'

import { accountType } from '@/account-kit/config'
import { ETH_DECIMALS } from '@/features/bridge/constants/decimals'
import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { useAppSDK } from '@/hooks/use-app-sdk'

/**
 * Parameters required for executing a bridge transaction
 */
interface BridgeTransactionParams {
  /** Amount to bridge in string format */
  amount: string
  /** Source blockchain network */
  sourceChain: Chain
  /** Destination blockchain network */
  destinationChain: Chain
  /** Recipient address on the destination chain */
  recipient: IAddress
  /** Callback function called on successful bridge transaction */
  onSuccess: () => void
  /** Callback function called when an error occurs */
  onError: () => void
}

/**
 * Extends BridgeTransactionInfo to include LayerZero fee in USD
 */
type BridgeTransactionInfoWithLzFeeUsd = BridgeTransactionInfo & {
  metadata: { lzFeeUsd: string }
}

/**
 * Return type for the useBridgeTransaction hook
 */
interface BridgeTransactionDetails {
  /** Prepares the bridge transaction with optional override amount */
  prepareTransaction: (overrideAmount?: string) => void
  /** Executes the prepared bridge transaction */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  executeBridgeTransaction: () => Promise<SendUserOperationWithEOA<any> | undefined>
  /** Clears the current transaction state */
  clearTransaction: () => void
  /** Current transaction details */
  transaction: BridgeTransactionInfoWithLzFeeUsd | undefined
  /** Flag indicating if transaction is being prepared */
  isPreparing: boolean
  /** Flag indicating if transaction is being processed */
  isLoading: boolean
  /** Current error state */
  error: Error | null
  /** Flag indicating if transaction is ready to execute */
  isReady: boolean
}

/**
 * Hook for managing cross-chain bridge transactions
 *
 * This hook handles the preparation and execution of bridge transactions between
 * different blockchain networks. It manages the transaction state, fee calculations,
 * and error handling throughout the bridging process.
 *
 * @param params - Bridge transaction parameters
 * @returns Object containing transaction state and control functions
 */
export function useBridgeTransaction({
  amount,
  sourceChain,
  destinationChain,
  recipient,
  onSuccess,
  onError,
}: BridgeTransactionParams): BridgeTransactionDetails {
  const { getSwapQuote, getTokenBySymbol } = useAppSDK()
  const [isLoading, setIsLoading] = useState(false)
  const [isEstimating, setIsEstimating] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [transaction, setTransaction] = useState<BridgeTransactionInfoWithLzFeeUsd | undefined>()

  const { getBridgeTx, getCurrentUser, getTargetChainInfo, getSummerToken } = useAppSDK()
  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })

  const { sendUserOperationAsync, isSendingUserOperation } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess,
    onError,
  })

  const clearTransaction = useCallback(() => {
    setTransaction(undefined)
  }, [])

  // Prepare transaction and get details
  const prepareTransaction = useCallback(
    async (overrideAmount?: string) => {
      try {
        setIsEstimating(true)
        setError(null)

        const user = getCurrentUser()
        const sourceChainInfo = getTargetChainInfo(sourceChain.id)
        const targetChainInfo = getTargetChainInfo(destinationChain.id)
        const summerToken = await getSummerToken({ chainInfo: sourceChainInfo })

        const [bridgeTx] = await getBridgeTx({
          user,
          recipient,
          sourceChain: sourceChainInfo,
          targetChain: targetChainInfo,
          amount: TokenAmount.createFrom({
            token: summerToken,
            amount: overrideAmount ?? amount,
          }),
        })

        if (!bridgeTx) {
          throw new Error('Bridge transaction is undefined')
        }

        const [ethToken, usdcToken] = await Promise.all([
          getTokenBySymbol({
            chainId: sourceChainInfo.chainId,
            symbol: 'WETH',
          }),
          getTokenBySymbol({
            chainId: sourceChainInfo.chainId,
            symbol: sourceChainInfo.chainId === 146 ? 'USDC.e' : 'USDC',
          }),
        ])

        let fetchedTransactionFee: QuoteData | undefined
        if (sourceChainInfo.chainId !== 146) {
          fetchedTransactionFee = await getSwapQuote({
            fromAmount: formatEther(
              bridgeTx.metadata.lzFee.toSolidityValue({ decimals: ETH_DECIMALS }),
            ),
            fromToken: ethToken,
            toToken: usdcToken,
            // FIXME: Use actual slippage value from slippage config
            slippage: 0.1,
          })
        }

        setTransaction({
          ...bridgeTx,
          metadata: {
            ...bridgeTx.metadata,
            lzFeeUsd: fetchedTransactionFee ? fetchedTransactionFee.toTokenAmount.amount : '0',
          },
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'))
        setTransaction(undefined)
      } finally {
        setIsEstimating(false)
      }
    },
    [
      getCurrentUser,
      getTargetChainInfo,
      sourceChain.id,
      destinationChain.id,
      getSummerToken,
      getBridgeTx,
      recipient,
      amount,
      getTokenBySymbol,
      getSwapQuote,
    ],
  )

  // Execute prepared transaction
  const executeBridgeTransaction = useCallback(async () => {
    if (isLoading) {
      throw new Error('Transaction is already in progress')
    }

    if (!transaction) {
      throw new Error('Transaction must be prepared before executing')
    }

    try {
      setIsLoading(true)

      const txParams = {
        target: transaction.transaction.target.value,
        data: transaction.transaction.calldata,
        value: BigInt(transaction.transaction.value),
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
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, transaction, smartAccountClient, sendUserOperationAsync, onError])

  return {
    prepareTransaction,
    executeBridgeTransaction,
    clearTransaction,
    transaction,
    isLoading: isLoading || isSendingUserOperation,
    isPreparing: isEstimating,
    error,
    isReady: !!transaction,
  }
}
