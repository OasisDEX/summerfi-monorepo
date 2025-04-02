'use client'
import { useEffect, useState } from 'react'
import { type QuoteData, type SdkClient } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'

/**
 * Hook that fetches and manages swap quotes between tokens with debounced updates.
 *
 * @param chainId - Network chain ID where the swap will occur
 * @param fromAmount - Amount of source token to swap
 * @param fromTokenSymbol - Symbol of the source token
 * @param toTokenSymbol - Symbol of the destination token
 * @param slippage - Allowed slippage percentage for the swap
 * @param sdk - SDK client instance for fetching quotes
 *
 * @returns {Object} Quote information:
 *   - quote: Current quote data containing swap details and prices
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
  quote: QuoteData | undefined
  quoteLoading: boolean
} => {
  const [quote, setQuote] = useState<QuoteData>()
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
      const swapQuote = await sdk.getSwapQuote({
        fromAmount: fromAmount.toString(),
        fromToken,
        toToken,
        slippage,
      })

      setQuote(swapQuote)
    }

    if (new BigNumber(fromAmount).isGreaterThan(0) && fromTokenSymbol !== toTokenSymbol) {
      setQuoteLoading(true)
      const timeout = setTimeout(
        () =>
          fetchQuote()
            .catch((err) => {
              // eslint-disable-next-line no-console
              console.error('Error fetching swap quote', err)
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
