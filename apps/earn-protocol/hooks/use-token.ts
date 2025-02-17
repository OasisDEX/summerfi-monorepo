import { useCallback, useEffect, useState } from 'react'
import { getChainInfoByChainId, type IToken } from '@summerfi/sdk-common'

import { useAppSDK } from './use-app-sdk'

export interface TokenData {
  token: IToken | undefined
  tokenLoading: boolean
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

  useEffect(() => {
    if (skip) {
      setTokenLoading(false)
      return
    }
    setTokenLoading(true)
    getTokenRequest()
      .then((fetchedToken) => {
        setToken(fetchedToken)
      })
      .catch((err) => {
        console.error('Error fetching token', err)
      })
      .finally(() => {
        setTokenLoading(false)
      })
  }, [getTokenRequest, skip])

  return {
    token,
    tokenLoading,
  }
}
