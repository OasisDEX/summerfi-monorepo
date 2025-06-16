export type BeachClubReferralList = {
  address: string
  tvl: string
  earnedToDate: string
  forecastAnnualisedEarnings: string
  id: string
}[]

export interface BeachClubRewardBalance {
  currency: string
  balance: string
  balance_usd: string | null
  amount_per_day: string
  amount_per_day_usd: string | null
  total_earned: string
  total_claimed: string
}

export type BeachClubRecruitedUsersRewards = {
  [key: string]: {
    id: string
    referral_code: string | null
    tvl: string
    rewards: BeachClubRewardBalance[]
  }
}

export type BeachClubRecruitedUsersPagination = {
  data: BeachClubReferralList
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}
