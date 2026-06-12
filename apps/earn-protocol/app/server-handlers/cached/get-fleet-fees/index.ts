import { unstable_cache as unstableCache } from 'next/cache'

import { type FleetCommanderFees, getFleetCommanderFees } from '@/app/server-handlers/fleet-fees'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'
import { getFleetFeesTag } from '@/helpers/get-cache-handler-name'

/**
 * Per-vault cached read of the on-chain fleet fee rates (management + performance).
 *
 * Cached for 3h per (fleetAddress, chainId) so the value is fetched once and reused across every
 * place that displays the management fee. Falls back to `null` fees on error so callers can
 * gracefully degrade.
 */
export const getCachedFleetCommanderFees = async ({
  fleetAddress,
  chainId,
}: {
  fleetAddress: string
  chainId: number
}): Promise<FleetCommanderFees> => {
  try {
    return await unstableCache<
      ({
        fleetAddress,
        chainId,
      }: {
        fleetAddress: string
        chainId: number
      }) => Promise<FleetCommanderFees>
    >(getFleetCommanderFees, ['fleetFees'], {
      revalidate: CACHE_TIMES.FLEET_FEES,
      // Per-vault tag for surgical busting (vault open/manage refresh) + a shared tag so the
      // vaults-list refresh can revalidate every vault's fees at once.
      tags: [getFleetFeesTag(fleetAddress, chainId), CACHE_TAGS.FLEET_FEES],
    })({ fleetAddress, chainId })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching ${fleetAddress}-${chainId} fleet fees:`, error)

    return { managementFee: null, performanceFee: null }
  }
}
