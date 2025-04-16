import { useCallback, useEffect, useState } from 'react'
import { getChainInfoByChainId, type IToken } from '@summerfi/sdk-common'

import { useAppSDK } from './use-app-sdk'

interface TokenData {
  token: IToken | undefined
  tokenLoading: boolean
  error: Error | undefined
}

/**
 * Hook to fetch token details for a given token symbol and blockchain chain.
 * This hook ignores any vault token logic and does not fetch a token balance.
 *
 * @param tokenSymbol - Symbol of the token (e.g., "SUMMER", "USDC", "ETH")
 * @param chainId - The chain/network ID
 * @param skip - Optional flag to skip fetching the token details
 * @returns An object containing the fetched token (if any) and a loading state
 */
export const useToken = ({
  tokenSymbol,
  chainId,
  skip = false,
}: {
  tokenSymbol: string
  chainId: number
  skip?: boolean
}): TokenData => {
  const [token, setToken] = useState<IToken | undefined>(undefined)
  const [tokenLoading, setTokenLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>(undefined)
  const sdk = useAppSDK()

  // Determine the token fetching method.
  // This follows a similar logic to useTokenBalance but omits any vault token considerations.
  const getTokenRequest = useCallback(() => {
    if (tokenSymbol === 'SUMMER') {
      return sdk.getSummerToken({
        chainInfo: getChainInfoByChainId(chainId),
      })
    }

    return sdk.getTokenBySymbol({
      chainId,
      symbol: tokenSymbol,
    })
  }, [sdk, tokenSymbol, chainId])

  const tokenCacheKey = `${tokenSymbol}-${chainId}`
  const [cachedToken, setCachedToken] = useState<string | null>(null)

  // Initialize cached token on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCachedToken(sessionStorage.getItem(tokenCacheKey))
    }
  }, [tokenCacheKey])

  useEffect(() => {
    if (skip) {
      setTokenLoading(false)

      return
    }

    if (cachedToken) {
      setToken(JSON.parse(cachedToken))
      setTokenLoading(false)

      return
    }

    setTokenLoading(true)
    getTokenRequest()
      .then((fetchedToken) => {
        setToken(fetchedToken)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(tokenCacheKey, JSON.stringify(fetchedToken))
        }
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setTokenLoading(false)
      })
  }, [getTokenRequest, skip, cachedToken, tokenCacheKey])

  return {
    token,
    tokenLoading,
    error,
  }
}
