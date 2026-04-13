'use client'
import { useEffect, useState } from 'react'
import { type SdkClient } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'

type SpotPriceQuote = {
  fromTokenAmount: {
    amount: string
    token: { symbol: string }
    toBigNumber(): BigNumber
  }
  toTokenAmount: {
    amount: string
    token: { symbol: string }
    toBigNumber(): BigNumber
  }
}

/**
 * Hook that fetches token spot prices and calculates equivalent token amounts.
 *
 * @param chainId - Network chain ID where the tokens exist
 * @param fromAmount - Amount of source token to convert
 * @param fromTokenSymbol - Symbol of the source token
 * @param toTokenSymbol - Symbol of the destination token
 * @param sdk - SDK client instance for fetching prices
 *
 * @returns {Object} Quote information:
 *   - quote: Simplified quote with fromTokenAmount and toTokenAmount based on USD spot prices
 *   - quoteLoading: Boolean indicating if a quote is being fetched
 *
 * @remarks
 * - Quote updates are debounced by 500ms to prevent excessive API calls
 * - Returns undefined quote if fromAmount is 0 or tokens are the same
 * - Automatically cleans up pending requests on unmount
 */
export const useSwapQuote = ({
  chainId,
  fromAmount,
  fromTokenSymbol,
  toTokenSymbol,
  slippage,
  sdk,
  defaultQuoteLoading = false,
}: {
  chainId: number
  fromAmount: string
  fromTokenSymbol: string
  toTokenSymbol: string
  slippage: number
  sdk: SdkClient
  defaultQuoteLoading?: boolean
}): {
  quote: SpotPriceQuote | undefined
  quoteLoading: boolean
} => {
  const [quote, setQuote] = useState<SpotPriceQuote>()
  const [quoteLoading, setQuoteLoading] = useState(defaultQuoteLoading)

  useEffect(() => {
    const fetchQuote = async () => {
      const [fromToken, toToken] = await Promise.all([
        sdk.getTokenBySymbol({
          chainId,
          symbol: fromTokenSymbol,
        }),
        sdk.getTokenBySymbol({
          chainId,
          symbol: toTokenSymbol,
        }),
      ])

      const chainInfo = sdk.getTargetChainInfo(chainId)
      const spotPrices = await sdk.getSpotPrices({
        chainInfo,
        baseTokens: [fromToken, toToken],
      })

      const fromPrice = spotPrices.priceByAddress[fromToken.address.value.toLowerCase()]
      const toPrice = spotPrices.priceByAddress[toToken.address.value.toLowerCase()]
      const toAmount = new BigNumber(fromAmount)
        .multipliedBy(fromPrice.value)
        .dividedBy(toPrice.value)
        .multipliedBy(new BigNumber(1).minus(new BigNumber(slippage).dividedBy(100)))
        .toFixed()

      setQuote({
        fromTokenAmount: {
          amount: fromAmount,
          token: fromToken,
          toBigNumber: () => new BigNumber(fromAmount),
        },
        toTokenAmount: {
          amount: toAmount,
          token: toToken,
          toBigNumber: () => new BigNumber(toAmount),
        },
      })
    }

    if (new BigNumber(fromAmount).isGreaterThan(0) && fromTokenSymbol !== toTokenSymbol) {
      setQuoteLoading(true)
      const timeout = setTimeout(
        () =>
          fetchQuote()
            .catch((err) => {
              // eslint-disable-next-line no-console
              console.error('Error fetching spot price quote', err)
              setQuote(undefined)
            })
            .finally(() => {
              setQuoteLoading(false)
            }),
        500,
      )

      return () => clearTimeout(timeout)
    } else {
      setQuote(undefined)
      setQuoteLoading(false)

      return () => null
    }
  }, [fromAmount, fromTokenSymbol, toTokenSymbol, slippage, chainId, sdk])

  return {
    quote,
    quoteLoading,
  }
}
