import { unstable_cache as unstableCache } from 'next/cache'

import { getClaimableMerkleRewards } from '@/app/server-handlers/raw-calls/claimable-merkle-rewards'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getMerkleRewardsTag } from '@/helpers/get-cache-handler-name'

export const getCachedClaimableMerkleRewards = async (walletAddress: string) => {
  try {
    return await unstableCache<
      (
        walletAddress: string,
      ) => Promise<
        ReturnType<typeof getClaimableMerkleRewards> extends Promise<infer R> ? R : never
      >
    >(getClaimableMerkleRewards, ['sharePrice'], {
      revalidate: CACHE_TIMES.CLAIMABLE_MERKLE_REWARDS,
      tags: [getMerkleRewardsTag(walletAddress)],
    })(walletAddress)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching ${walletAddress} claimable merkle rewards data:`, error)

    return {
      perChain: {},
    }
  }
}
