'use client'
import { useEffect, useState } from 'react'

import { type RiskResponse, type UseRiskInput } from '@/types'

export interface RiskState extends RiskResponse {
  isLoading?: boolean
}

/**
 * Custom hook to determine the risk status of a wallet address.
 *
 * @remarks
 * This hook sends a request to a specified API endpoint to fetch the risk status of a given wallet address on a specific blockchain network.
 * It manages the loading state and handles errors during the request.
 *
 * @param chainId - The chain ID of the blockchain network.
 * @param walletAddress - The wallet address to be checked for risk status (optional).
 * @param cookiePrefix - The prefix for the cookie.
 * @param host - Optional, to be used when API is not available under the same host (for example localhost development on different ports).
 * @returns An object representing the risk state which includes:
 * - `isRisky` - A boolean indicating if the wallet is considered risky.
 * - `error` - An error message if the request fails.
 * - `isLoading` - A boolean indicating if the request is in progress.
 *
 * @example
 * const { isRisky, isLoading, error } = useRisk({ chainId: 1, walletAddress: '0x123...', host: 'https://api.example.com' });
 */

export const useRisk = ({
  chainId,
  walletAddress,
  cookiePrefix,
  host = '',
}: UseRiskInput): RiskState => {
  const [risk, setRisk] = useState<RiskState>({ isLoading: false })

  useEffect(() => {
    const request = async (
      _chainId: number,
      _walletAddress: string,
      _cookiePrefix: string,
      _host?: string,
    ) => {
      try {
        const riskResponse: RiskResponse = await fetch(`${host}/api/risk`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chainId: _chainId,
            walletAddress: _walletAddress,
            cookiePrefix: _cookiePrefix,
          }),
          credentials: 'include',
        }).then((resp) => resp.json())

        setRisk({ ...riskResponse, isLoading: false })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Risk request failed. Please reload page or contact with support', error)
        setRisk({ error: 'Failed to fetch risk status. Please try again later.', isLoading: false })
      }
    }

    if (walletAddress) {
      setRisk({ isLoading: true })
      void request(chainId, walletAddress, cookiePrefix, host)
    }
  }, [chainId, walletAddress, cookiePrefix, host])

  return risk
}
