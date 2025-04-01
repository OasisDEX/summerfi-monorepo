import { useEffect, useState } from 'react'
import {
  type Address,
  type BridgeTransactionInfo,
  ChainIds,
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

const getNativeSymbol = (chainId: number) => {
  const nativeSymbolByChain: { [chainId: number]: string } = {
    [ChainIds.ArbitrumOne]: 'WETH',
    [ChainIds.Base]: 'WETH',
    [ChainIds.Mainnet]: 'WETH',
    [ChainIds.Optimism]: 'WETH',
    [ChainIds.Sonic]: 'WS',
  }
  const symbol = nativeSymbolByChain[chainId]

  if (!symbol) {
    throw new Error(`No native symbol found for chainId ${chainId}`)
  }

  return symbol
}

export const useGasEstimation = ({
  chainId,
  transaction,
  walletAddress,
  publicClient,
}: UseGasEstimationProps) => {
  const { getSpotPrice, getTokenBySymbol } = useAppSDK()

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

      const nativeSymbol = getNativeSymbol(chainId)

      try {
        const [fetchedGas, gasPrice, nativeToken] = await Promise.all([
          publicClient.estimateGas({
            account: _walletAddress,
            to: _transaction.transaction.target.value,
            data: _transaction.transaction.calldata,
            value: _transaction.transaction.value
              ? BigInt(_transaction.transaction.value)
              : undefined,
          }),
          publicClient.estimateFeesPerGas(),
          getTokenBySymbol({
            chainId,
            symbol: nativeSymbol,
          }),
        ])
        // fee calculation with 20% buffer and including priority fee
        const txFee =
          // eslint-disable-next-line no-mixed-operators
          (fetchedGas * gasPrice.maxFeePerGas * 120n) / 100n

        const { price: nativePrice } = await getSpotPrice({
          baseToken: nativeToken,
        })

        const nativeAmount = formatEther(txFee)
        const priceInUsd = nativePrice.multiply(nativeAmount).value.toString()

        setTransactionFee(priceInUsd)
        setRawTransactionFee(nativeAmount)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Gas Estimation failed', e)
      }
      setLoading(false)
    }

    if (transaction !== undefined && walletAddress !== undefined) {
      fetchGasEstimation(transaction, walletAddress)
    }
  }, [publicClient, getTokenBySymbol, chainId, getSpotPrice, transaction, walletAddress])

  return {
    loading,
    transactionFee,
    rawTransactionFee,
  }
}
