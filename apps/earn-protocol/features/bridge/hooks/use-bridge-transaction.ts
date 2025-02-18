'use client'
import { useCallback, useState } from 'react'
import {
  type SendUserOperationWithEOA,
  useSendUserOperation,
  useSmartAccountClient,
} from '@account-kit/react'
import { useIsIframe } from '@summerfi/app-earn-ui'
import { type BridgeTransactionInfo, type IAddress, TokenAmount } from '@summerfi/sdk-common'
import { type Chain, formatEther } from 'viem'

import { accountType } from '@/account-kit/config'
import { ETH_DECIMALS } from '@/features/bridge/constants/decimals'
import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { sendSafeTx } from '@/helpers/send-safe-tx'
import { useAppSDK } from '@/hooks/use-app-sdk'

interface BridgeTransactionParams {
  amount: string
  destinationChain: Chain
  recipient: IAddress
  onSafeTxSuccess: (txHash: string) => void
  onSuccess: () => void
  onError: () => void
}

type BridgeTransactionInfoWithLzFeeUsd = BridgeTransactionInfo & {
  metadata: { lzFeeUsd: string }
}

interface BridgeTransactionDetails {
  prepareTransaction: (overrideAmount?: string) => void
  executeBridgeTransaction: () => void | SendUserOperationWithEOA<unknown>
  clearTransaction: () => void
  transaction: BridgeTransactionInfoWithLzFeeUsd | undefined
  isPreparing: boolean
  isLoading: boolean
  error: Error | null
  isReady: boolean
}

export function useBridgeTransaction({
  amount,
  destinationChain,
  recipient,
  onSafeTxSuccess,
  onSuccess,
  onError,
}: BridgeTransactionParams): BridgeTransactionDetails {
  const { getSwapQuote, getTokenBySymbol } = useAppSDK()
  const [isLoading, setIsLoading] = useState(false)
  const [isEstimating, setIsEstimating] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [transaction, setTransaction] = useState<BridgeTransactionInfoWithLzFeeUsd | undefined>()

  const isIframe = useIsIframe()
  const { getBridgeTx, getCurrentUser, getChainInfo, getTargetChainInfo, getSummerToken } =
    useAppSDK()
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
        const sourceChainInfo = getChainInfo()
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
            symbol: 'USDC',
          }),
        ])

        const fetchedTransactionFee = await getSwapQuote({
          fromAmount: formatEther(
            bridgeTx.metadata.lzFee.toSolidityValue({ decimals: ETH_DECIMALS }),
          ),
          fromToken: ethToken,
          toToken: usdcToken,
          slippage: 1,
        })

        setTransaction({
          ...bridgeTx,
          metadata: {
            ...bridgeTx.metadata,
            lzFeeUsd: fetchedTransactionFee.toTokenAmount.amount,
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
      getChainInfo,
      getTargetChainInfo,
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
    if (!transaction) {
      throw new Error('Transaction must be prepared before executing')
    }

    try {
      setIsLoading(true)

      if (isIframe) {
        return await sendSafeTx({
          txs: [
            {
              to: transaction.transaction.target.value,
              data: transaction.transaction.calldata,
              value: transaction.transaction.value,
            },
          ],
          onSuccess: onSafeTxSuccess,
          onError,
        })
      }

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

      throw err
    } finally {
      setIsLoading(false)
    }
  }, [transaction, smartAccountClient, sendUserOperationAsync, isIframe, onSuccess, onError])

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
