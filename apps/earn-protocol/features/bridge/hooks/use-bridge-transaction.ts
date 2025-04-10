'use client'
import { useCallback, useState } from 'react'
import {
  type SendUserOperationWithEOA,
  useSendUserOperation,
  useSmartAccountClient,
} from '@account-kit/react'
import { SDKChainId } from '@summerfi/app-types'
import {
  type BridgeTransactionInfo,
  type IAddress,
  type IToken,
  type ITokenAmount,
  type QuoteData,
  TokenAmount,
} from '@summerfi/sdk-common'
import { type Chain, formatEther } from 'viem'

import { accountType } from '@/account-kit/config'
import { ETH_DECIMALS } from '@/features/bridge/constants/decimals'
import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { useAppSDK } from '@/hooks/use-app-sdk'

// Mapping for USDC token symbols by chain ID
const USDC_SYMBOL_BY_CHAIN_ID: { [key: number]: string } = {
  [SDKChainId.SONIC]: 'USDC.e',
  [SDKChainId.MAINNET]: 'USDC',
  [SDKChainId.ARBITRUM]: 'USDC',
  [SDKChainId.BASE]: 'USDC',
}

/**
 * Helper function to get the USD value of a LayerZero fee
 * @param chainId The chain ID
 * @param lzFee The LayerZero fee in ETH
 * @param ethToken The ETH token
 * @param usdcToken The USDC token
 * @param getSwapQuote Function to get swap quote
 * @returns The USD value of the LayerZero fee
 */
const getLzFeeUsdValue = async (
  chainId: number,
  lzFee: ITokenAmount,
  ethToken: IToken,
  usdcToken: IToken,
  getSwapQuote: (params: {
    fromAmount: string
    fromToken: IToken
    toToken: IToken
    slippage: number
  }) => Promise<QuoteData>,
): Promise<string> => {
  // Sonic chain doesn't have 1inch deployed yet, so we return 0
  if (chainId === SDKChainId.SONIC) {
    return '0'
  }

  // For other chains, we get the swap quote
  const quote = await getSwapQuote({
    fromAmount: formatEther(lzFee.toSolidityValue({ decimals: ETH_DECIMALS })),
    fromToken: ethToken,
    toToken: usdcToken,
    // FIXME: Use actual slippage value from slippage config
    slippage: 0.1,
  })

  return quote.toTokenAmount.amount
}

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
            symbol: USDC_SYMBOL_BY_CHAIN_ID[sourceChainInfo.chainId] || 'USDC',
          }),
        ])

        const lzFeeUsd = await getLzFeeUsdValue(
          sourceChainInfo.chainId,
          bridgeTx.metadata.lzFee,
          ethToken,
          usdcToken,
          getSwapQuote,
        )

        setTransaction({
          ...bridgeTx,
          metadata: {
            ...bridgeTx.metadata,
            lzFeeUsd,
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
