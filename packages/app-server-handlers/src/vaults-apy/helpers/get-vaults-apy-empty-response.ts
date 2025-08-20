import { type GetVaultsApyResponse } from '@summerfi/app-types'

import { type GetVaultsApyParams } from '@/vaults-apy/types'

/**
 * Creates an empty APY response structure for the provided fleets.
 *
 * @param {GetVaultsApyParams['fleets']} fleets - Array of fleet objects with addresses and chain IDs
 * @returns {GetVaultsApyResponse} Object with empty APY data for each fleet-chain combination
 *
 * @example
 * ```typescript
 * const emptyResponse = getVaultsApyEmptyResponse([
 *   { fleetAddress: '0x123...', chainId: 1 }
 * ]);
 * // Returns: { '0x123...-1': { apy: 0, apyTimestamp: null, sma24h: null, ... } }
 * ```
 */
export const getVaultsApyEmptyResponse = (
  fleets: GetVaultsApyParams['fleets'],
): GetVaultsApyResponse => {
  const emptyResponse: GetVaultsApyResponse = {}

  for (const { fleetAddress, chainId } of fleets) {
    emptyResponse[`${fleetAddress}-${chainId}`] = {
      apy: 0,
      apyTimestamp: null,
      sma24h: null,
      sma7d: null,
      sma30d: null,
    }
  }

  return emptyResponse
}
