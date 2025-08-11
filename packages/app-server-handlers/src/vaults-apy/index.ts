import { type GetVaultsApyResponse } from '@summerfi/app-types'

import { getVaultsApyEmptyResponse } from '@/vaults-apy/helpers/get-vaults-apy-empty-response'

import { type GetVaultsApyParams, type GetVaultsApyRAWResponse } from './types'

/**
 * Fetches APY (Annual Percentage Yield) data for multiple vault fleets across different chains.
 *
 * This function retrieves current APY rates and Simple Moving Averages (SMA) for vault fleets
 * by making a POST request to the vault rates API. It processes the response to convert
 * percentage values (dividing by 100) and provides fallback empty responses if the API
 * fails or returns invalid data.
 *
 * @param {Object} params - The parameters for fetching vault APY data
 * @param {Array} params.fleets - Array of fleet objects containing fleet addresses and chain IDs
 * @param {string} params.fleets[].fleetAddress - The contract address of the fleet
 * @param {number} params.fleets[].chainId - The blockchain chain ID where the fleet operates
 *
 * @returns {Promise<GetVaultsApyResponse>} A promise that resolves to an object mapping fleet-chain combinations to their APY data
 *
 * @throws {Error} When FUNCTIONS_API_URL environment variable is not set
 * @throws {Error} When the API request fails or response parsing encounters an error
 *
 * @example
 * ```typescript
 * const apyData = await getVaultsApy({
 *   fleets: [
 *     { fleetAddress: '0x123...', chainId: 1 },
 *     { fleetAddress: '0x456...', chainId: 8453 }
 *   ]
 * });
 * // Returns: {
 * //   '0x123...-1': { apy: 0.085, apyTimestamp: 1234567890, sma24h: 0.082, ... },
 * //   '0x456...-8453': { apy: 0.092, apyTimestamp: 1234567890, sma24h: 0.089, ... }
 * // }
 * ```
 */
export const getVaultsApy: ({
  fleets,
}: GetVaultsApyParams) => Promise<GetVaultsApyResponse> = async ({ fleets }) => {
  const functionsApiUrl = process.env.FUNCTIONS_API_URL

  const emptyResponse = getVaultsApyEmptyResponse(fleets)

  if (!functionsApiUrl) {
    throw new Error('FUNCTIONS_API_URL is not set')
  }

  try {
    const apiResponse = await fetch(`${functionsApiUrl}/api/vault/rates`, {
      method: 'POST',
      body: JSON.stringify({ fleets }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const rawResponse: GetVaultsApyRAWResponse | null =
      (await apiResponse.json()) as GetVaultsApyRAWResponse

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!rawResponse.rates) {
      return emptyResponse
    }

    const response: GetVaultsApyResponse = { ...emptyResponse }

    for (const { rates, chainId, sma } of rawResponse.rates) {
      for (const { rate, fleetAddress, timestamp } of rates) {
        response[`${fleetAddress}-${chainId}`] = {
          apy: Number(rate) / 100,
          apyTimestamp: timestamp,
          sma24h: sma.sma24h ? Number(sma.sma24h) / 100 : null,
          sma7d: sma.sma7d ? Number(sma.sma7d) / 100 : null,
          sma30d: sma.sma30d ? Number(sma.sma30d) / 100 : null,
        }
      }
    }

    return response
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getVaultsApy: Error parsing vaults apy', error)

    throw error
  }
}
