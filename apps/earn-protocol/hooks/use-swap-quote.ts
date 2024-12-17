import { useEffect, useState } from 'react'
import { type QuoteData } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'

import { useAppSDK } from './use-app-sdk'

export const useSwapQuote = ({
  chainId,
  fromAmount,
  fromTokenSymbol,
  toTokenSymbol,
  slippage,
}: {
  chainId: number
  fromAmount: string
  fromTokenSymbol: string
  toTokenSymbol: string
  slippage: number
}) => {
  const [quote, setQuote] = useState<QuoteData>()
  const [quoteLoading, setQuoteLoading] = useState(false)

  const sdk = useAppSDK()

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
    }
  }, [fromAmount, fromTokenSymbol, toTokenSymbol, slippage, chainId, sdk])

  return {
    quote,
    quoteLoading,
  }
}
