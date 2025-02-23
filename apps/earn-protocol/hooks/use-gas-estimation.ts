import { useEffect, useState } from 'react'
import {
  type BridgeTransactionInfo,
  type ExtendedTransactionInfo,
  type HexData,
  TransactionType,
} from '@summerfi/sdk-common'
import { formatEther } from 'viem'

import { useAppSDK } from './use-app-sdk'
import { useNetworkAlignedClient } from './use-network-aligned-client'

type UseGasEstimationProps = {
  chainId: number
  transaction: ExtendedTransactionInfo | BridgeTransactionInfo | undefined
  walletAddress: HexData | undefined
  overrideNetwork?: string
}

export const useGasEstimation = ({
  chainId,
  transaction,
  walletAddress,
  overrideNetwork,
}: UseGasEstimationProps) => {
  const { publicClient } = useNetworkAlignedClient({ chainId, overrideNetwork })
  const { getSwapQuote, getTokenBySymbol } = useAppSDK()

  const [loading, setLoading] = useState<boolean>(false)
  const [transactionFee, setTransactionFee] = useState<string | undefined>(undefined)
  const [rawTransactionFee, setRawTransactionFee] = useState<string | undefined>(undefined)

  useEffect(() => {
    const fetchGasEstimation = async (
      _transaction: ExtendedTransactionInfo | BridgeTransactionInfo,
      _walletAddress: HexData,
    ) => {
      setLoading(true)
      try {
        const [fetchedGas, gasPrice] = await Promise.all([
          publicClient.estimateGas({
            account: _walletAddress,
            to: _transaction.transaction.target.value,
            data: _transaction.transaction.calldata,
            value: _transaction.transaction.value
              ? BigInt(_transaction.transaction.value)
              : undefined,
          }),
          publicClient.estimateFeesPerGas(),
        ])
        // fee calculation with 20% buffer and including priority fee
        const txFee =
          // eslint-disable-next-line no-mixed-operators
          (fetchedGas * gasPrice.maxFeePerGas * 120n) / 100n

        const [ethToken, usdcToken] = await Promise.all([
          getTokenBySymbol({
            chainId,
            symbol: 'WETH',
          }),
          getTokenBySymbol({
            chainId,
            symbol: 'USDC',
          }),
        ])

        // TODO: should change this to use the spot price
        // there is no such public api in the sdk yet need to implement it and replace this
        const fetchedTransactionFee = await getSwapQuote({
          fromAmount: formatEther(txFee),
          fromToken: ethToken,
          toToken: usdcToken,
          slippage: 1,
        })

        setTransactionFee(fetchedTransactionFee.toTokenAmount.amount)
        setRawTransactionFee(fetchedTransactionFee.fromTokenAmount.amount)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Gas Estimation failed', e)
      }
      setLoading(false)
    }

    if (
      transaction !== undefined &&
      walletAddress !== undefined &&
      transaction.type !== TransactionType.Approve
    ) {
      fetchGasEstimation(transaction, walletAddress)
    }
  }, [publicClient, getTokenBySymbol, chainId, getSwapQuote, transaction, walletAddress])

  return {
    loading,
    transactionFee,
    rawTransactionFee,
  }
}
