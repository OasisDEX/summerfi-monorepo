import { type UiTransactionStatuses } from '@summerfi/app-types'

import { type MerklIsAuthorizedPerChain } from '@/features/claim-and-delegate/types'

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

export type BeachClubRecruitedUsersPagination = {
  data: BeachClubReferralList
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export type BeachClubState = {
  claimStatus: UiTransactionStatuses | undefined
  merklStatus: UiTransactionStatuses | undefined
  walletAddress: string
  merklIsAuthorizedPerChain: MerklIsAuthorizedPerChain
  feesClaimed: boolean
}

export type BeachClubReducerAction =
  | {
      type: 'update-merkl-status'
      payload: UiTransactionStatuses | undefined
    }
  | {
      type: 'update-claim-status'
      payload: UiTransactionStatuses | undefined
    }
  | {
      type: 'update-merkl-is-authorized-per-chain'
      payload: MerklIsAuthorizedPerChain
    }
  | {
      type: 'update-fees-claimed'
      payload: boolean
    }
