import { useEffect, useState } from 'react'
import { type ExtendedTransactionInfo, type HexData, TransactionType } from '@summerfi/sdk-common'
import { formatEther } from 'viem'

import { useAppSDK } from './use-app-sdk'
import { useClient } from './use-client'

type UseGasEstimationProps = {
  chainId: number
  transaction: ExtendedTransactionInfo | undefined
  walletAddress: HexData | undefined
}

export const useGasEstimation = ({
  chainId,
  transaction,
  walletAddress,
}: UseGasEstimationProps) => {
  const { publicClient } = useClient()
  const { getSwapQuote, getTokenBySymbol } = useAppSDK()

  const [loading, setLoading] = useState<boolean>(false)
  const [transactionFee, setTransactionFee] = useState<string | undefined>(undefined)

  useEffect(() => {
    const fetchGasEstimation = async (
      _transaction: ExtendedTransactionInfo,
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
          publicClient.getGasPrice(),
        ])

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

        const fetchedTransactionFee = await getSwapQuote({
          fromAmount: formatEther(fetchedGas * gasPrice),
          fromToken: ethToken,
          slippage: 1,
          toToken: usdcToken,
        })

        setTransactionFee(fetchedTransactionFee.toTokenAmount.amount)
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
  }
}