import { useEffect, useState } from 'react'
import {
  type Address,
  type BridgeTransactionInfo,
  type ExtendedTransactionInfo,
  type HexData,
  type MigrationTransactionInfo,
} from '@summerfi/sdk-common'
import { formatEther, type PublicClient } from 'viem'

import { useAppSDK } from './use-app-sdk'

type ClientTransaction = {
  transaction: {
    target: Address
    calldata: HexData
    value: string
  }
  description: string
}

type UseGasEstimationProps = {
  chainId: number
  transaction:
    | ExtendedTransactionInfo
    | BridgeTransactionInfo
    | MigrationTransactionInfo
    | ClientTransaction
    | undefined
  walletAddress: HexData | undefined
  publicClient: PublicClient
}

export const useGasEstimation = ({
  chainId,
  transaction,
  walletAddress,
  publicClient,
}: UseGasEstimationProps) => {
  const { getSwapQuote, getTokenBySymbol } = useAppSDK()

  const [loading, setLoading] = useState<boolean>(false)
  const [transactionFee, setTransactionFee] = useState<string | undefined>(undefined)
  const [rawTransactionFee, setRawTransactionFee] = useState<string | undefined>(undefined)

  useEffect(() => {
    const fetchGasEstimation = async (
      _transaction:
        | ExtendedTransactionInfo
        | BridgeTransactionInfo
        | MigrationTransactionInfo
        | ClientTransaction,
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

    if (transaction !== undefined && walletAddress !== undefined) {
      fetchGasEstimation(transaction, walletAddress)
    }
  }, [publicClient, getTokenBySymbol, chainId, getSwapQuote, transaction, walletAddress])

  return {
    loading,
    transactionFee,
    rawTransactionFee,
  }
}
