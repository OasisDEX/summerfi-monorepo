import { type PortfolioAssetsResponse } from '@/app/server-handlers/cached/get-wallet-assets/types'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { type ClaimableRewards } from '@/features/portfolio/types'

export const emptyRewardsData: ClaimDelegateExternalData = {
  sumrToClaim: {
    aggregatedRewards: {
      total: 0,
      perChain: {},
      stakingV2: 0,
    },
    merklRewards: 0,
    voteRewards: 0,
    merklIsAuthorizedPerChain: {},
  },
  sumrBalances: {
    mainnet: '0',
    arbitrum: '0',
    optimism: '0',
    base: '0',
    sonic: '0',
    hyperliquid: '0',
    total: '0',
    vested: '0',
    raw: {
      mainnet: '0',
      arbitrum: '0',
      optimism: '0',
      base: '0',
      sonic: '0',
      hyperliquid: '0',
      total: '0',
      vested: '0',
    },
  },
  sumrStakeDelegate: {
    delegatedToV1: '0x0000000000000000000000000000000000000000',
    delegatedToV2: '0x0000000000000000000000000000000000000000',
    delegatedToDecayFactor: 0,
    sumrDelegated: '0',
    stakedAmount: '0',
  },
  sumrStakingInfo: {
    sumrTokenWrappedStakedAmount: 0,
    sumrTokenDailyEmissionAmount: 0,
    sumrStakingApy: 0,
  },
  tallyDelegates: [],
  sumrRewardApy: 0,
  sumrRewardAmount: 0,
  authorizedStakingRewardsCallerBase: false,
}

export const emptyPortfolioSumrStakingV2Data = {
  sumrAvailableToStake: 0,
  sumrStakedV2: 0,
  maxApy: 0,
  stakedSumrRewardApy: 0,
  maxSumrRewardApy: 0,
  totalSumrStaked: 0,
  circulatingSupply: 0,
  averageLockDuration: 0,
  userStakes: [],
  bucketInfo: [],
  penaltyPercentages: [],
  penaltyAmounts: [],
  yourEarningsEstimation: undefined,
  userBlendedYieldBoost: 0,
  userUsdcRealYield: 0,
  usdcEarnedOnSumrAmount: 0,
}

export const emptyClaimableRewards: ClaimableRewards = {
  rewards: [
    {
      symbol: 'USDC',
      amount: 0,
      amountUSD: 0,
      priceUsd: 0,
    },
    {
      symbol: 'LVUSDC',
      amount: 0,
      amountUSD: 0,
      priceUsd: 0,
    },
  ],
  usdAmount: 0,
}

export const emptyWalletData: PortfolioAssetsResponse = {
  totalAssetsUsdValue: 0,
  totalAssetsPercentageChange: 0,
  assets: [],
}
