import { type RiskResponse, type UseRiskInput } from '@/types'

/**
 * Fetch the risk status for a given wallet address.
 *
 * This function sends a POST request to the specified API endpoint to retrieve the risk status of a wallet address on a particular chain.
 * If the request fails, it logs an error and returns a default error message.
 *
 * @param chainId - The ID of the blockchain network.
 * @param walletAddress - The wallet address to check the risk status for.
 * @param cookiePrefix - The prefix for the cookie.
 * @param host - The API host URL (optional).
 * @returns A promise that resolves to the risk response.
 */
export const fetchRisk = async ({
  chainId,
  walletAddress,
  cookiePrefix,
  host = '',
}: UseRiskInput): Promise<RiskResponse> => {
  try {
    return await fetch(`${host}/api/risk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chainId, walletAddress, cookiePrefix }),
      credentials: 'include',
    }).then((resp) => resp.json())
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Risk request failed. Please reload page or contact with support', error)

    if (error instanceof Error) {
      return { error: `Failed to fetch risk status: ${error.message}. Please try again later.` }
    }

    return { error: 'Failed to fetch risk status. Please try again later.' }
  }
}
