import { type MerklReward } from '@summerfi/armada-protocol-common'
import { type ChainId } from '@summerfi/sdk-common'

import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import {
  type BeachClubRecruitedUsersPagination,
  type BeachClubRewardBalance,
} from '@/features/beach-club/types'

export interface BeachClubData {
  referral_code: string | null
  active_users_count: number | null
  custom_code: string | null
  total_deposits_referred_usd: string | null
  rewards: BeachClubRewardBalance[]
  recruitedUsersWithRewards: BeachClubRecruitedUsersPagination
  recruitedUsersLatestActivity: LatestActivityPagination
  claimableRewardsPerChain: {
    perChain: Partial<{ [key in ChainId]: MerklReward[] }>
  }
}
