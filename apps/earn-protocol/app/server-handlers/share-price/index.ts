import { FleetCommanderAbi } from '@summerfi/armada-protocol-abis'
import BigNumber from 'bignumber.js'
import { unstable_cache as unstableCache } from 'next/cache'

import { getSSRPublicClient } from '@/helpers/get-ssr-public-client'

const sharePriceConversionPrecision = 6
const sharePricePrecisionValue = 10 ** sharePriceConversionPrecision

export const getFleetTokenSharePrice = async ({
  fleetAddress,
  chainId,
}: {
  fleetAddress: string
  chainId: number
}) => {
  const publicClient = await getSSRPublicClient(chainId)

  if (!publicClient) {
    throw new Error(`No public client available for chainId ${chainId}`)
  }

  const assetsResult = await publicClient.readContract({
    abi: FleetCommanderAbi,
    address: fleetAddress as `0x${string}`,
    functionName: 'convertToAssets',
    args: [BigInt(sharePricePrecisionValue)],
  })

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (assetsResult === undefined) {
    throw new Error(`Failed to fetch share price for fleet ${fleetAddress} on chain ${chainId}`)
  }

  const sharePrice = new BigNumber(assetsResult).dividedBy(sharePricePrecisionValue).toNumber()

  return sharePrice
}

export const getCachedFleetTokenSharePrice = async ({
  fleetAddress,
  chainId,
}: {
  fleetAddress: string
  chainId: number
}) => {
  try {
    return await unstableCache<() => Promise<number>>(
      () =>
        getFleetTokenSharePrice({
          fleetAddress,
          chainId,
        }),
      [`${fleetAddress}-${chainId}-share-price`],
      {
        revalidate: 60, // 1 minutes
      },
    )()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching ${fleetAddress}-${chainId} share price data:`, error)

    return 0
  }
}
