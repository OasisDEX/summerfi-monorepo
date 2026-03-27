import { unstable_cache as unstableCache } from 'next/cache'

import { getFleetTokenSharePrice } from '@/app/server-handlers/share-price'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getSharePriceTag } from '@/helpers/get-cache-handler-name'

export const getCachedFleetTokenSharePrice = async ({
  fleetAddress,
  chainId,
}: {
  fleetAddress: string
  chainId: number
}) => {
  try {
    return await unstableCache<
      ({ fleetAddress, chainId }: { fleetAddress: string; chainId: number }) => Promise<number>
    >(getFleetTokenSharePrice, ['sharePrice'], {
      revalidate: CACHE_TIMES.SHARE_PRICE,
      tags: [getSharePriceTag(fleetAddress, chainId)],
    })({ fleetAddress, chainId })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching ${fleetAddress}-${chainId} share price data:`, error)

    return 0
  }
}
