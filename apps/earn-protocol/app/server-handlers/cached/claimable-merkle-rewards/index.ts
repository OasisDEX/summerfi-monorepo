import { unstable_cache as unstableCache } from 'next/cache'

import {
  getClaimableSUMRLVUSDCMerkleRewards,
  getClaimableWSTETHMerkleRewards,
} from '@/app/server-handlers/raw-calls/claimable-merkle-rewards'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getMerkleRewardsTag } from '@/helpers/get-cache-handler-name'

export const getCachedClaimableSUMRLVUSDCMerkleRewards = async (walletAddress: string) => {
  try {
    return await unstableCache<
      (
        walletAddress: string,
      ) => Promise<
        ReturnType<typeof getClaimableSUMRLVUSDCMerkleRewards> extends Promise<infer R> ? R : never
      >
    >(getClaimableSUMRLVUSDCMerkleRewards, ['claimable-merkle-rewards-sumr-lvusdc'], {
      revalidate: CACHE_TIMES.CLAIMABLE_MERKLE_REWARDS,
      tags: [getMerkleRewardsTag(walletAddress)],
    })(walletAddress)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      `Error fetching ${walletAddress} claimable SUMR LV USDC merkle rewards data:`,
      error,
    )

    return {
      perChain: {},
    }
  }
}

export const getCachedClaimableWSTETHMerkleRewards = async (walletAddress: string) => {
  try {
    return await unstableCache<
      (
        walletAddress: string,
      ) => Promise<
        ReturnType<typeof getClaimableWSTETHMerkleRewards> extends Promise<infer R> ? R : never
      >
    >(getClaimableWSTETHMerkleRewards, ['claimable-merkle-rewards-wsteth'], {
      revalidate: CACHE_TIMES.CLAIMABLE_MERKLE_REWARDS,
      tags: [getMerkleRewardsTag(walletAddress)],
    })(walletAddress)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching ${walletAddress} claimable wstETH merkle rewards data:`, error)

    return {
      perChain: {},
    }
  }
}
