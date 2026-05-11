import { sumrNetApyConfigCookieName } from '@summerfi/app-earn-ui'
import { SupportedNetworkIds } from '@summerfi/app-types'
import { getServerSideCookies, safeParseJson } from '@summerfi/app-utils'
import { addressSchema } from '@summerfi/serverless-shared'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getCachedClaimableSUMRLVUSDCMerkleRewards } from '@/app/server-handlers/cached/claimable-merkle-rewards'
import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedPortfolioSumrStakingV2Data } from '@/app/server-handlers/cached/get-portfolio-sumr-staking-v2-data'
import { getCachedFleetTokenSharePrice } from '@/app/server-handlers/cached/get-share-price'
import { getCachedSumrBalances } from '@/app/server-handlers/cached/get-sumr-balances'
import { getCachedSumrDelegateStake } from '@/app/server-handlers/cached/get-sumr-delegate-stake'
import { getCachedSumrStakingInfo } from '@/app/server-handlers/cached/get-sumr-staking-info'
import { getCachedSumrStakingRewards } from '@/app/server-handlers/cached/get-sumr-staking-rewards'
import { getCachedSumrToClaim } from '@/app/server-handlers/cached/get-sumr-to-claim'
import { getCachedTokenPrice } from '@/app/server-handlers/cached/get-token-price'
import { getTallyDelegates } from '@/app/server-handlers/raw-calls/tally'
import { getCachedSumrPrice } from '@/app/server-handlers/reward-token-price'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { type ClaimableRewards } from '@/features/portfolio/types'
import { getEstimatedSumrPrice } from '@/helpers/get-estimated-sumr-price'
import { getMerkleNowClaimableTokenAmount } from '@/helpers/merkle'

const rewardsSchema = z.object({
  walletAddress: addressSchema,
})

const emptyRewardsData: ClaimDelegateExternalData = {
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

const emptyPortfolioSumrStakingV2Data = {
  sumrAvailableToStake: 0,
  sumrStakedV2: 0,
  maxApy: 0,
  stakedSumrRewardApy: 0,
  maxSumrRewardApy: 0,
  totalSumrStaked: 0,
  circulatingSupply: 0,
  averageLockDuration: 0,
  userStakes: [],
  allStakes: [],
  bucketInfo: [],
  penaltyPercentages: [],
  penaltyAmounts: [],
  yourEarningsEstimation: undefined,
  userBlendedYieldBoost: 0,
  userUsdcRealYield: 0,
  usdcEarnedOnSumrAmount: 0,
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ walletAddress: string }> },
) {
  const { walletAddress } = await params

  const { success } = rewardsSchema.safeParse({ walletAddress })

  if (!success) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  const [cookieRaw, sumrPrice, config, usdcPrice, lvUsdcSharePriceInUsdc] = await Promise.all([
    cookies(),
    getCachedSumrPrice(),
    getCachedConfig(),
    getCachedTokenPrice('usd-coin'),
    getCachedFleetTokenSharePrice({
      fleetAddress: '0x98C49e13bf99D7CAd8069faa2A370933EC9EcF17',
      chainId: SupportedNetworkIds.Base,
    }),
  ])

  const cookie = cookieRaw.toString()
  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))
  const sumrPriceUsd = getEstimatedSumrPrice({
    config,
    sumrPrice: sumrPrice.usd,
    sumrNetApyConfig: sumrNetApyConfig ?? {},
  })

  const [
    sumrStakeDelegateResult,
    sumrBalancesResult,
    sumrStakingInfoResult,
    sumrToClaimResult,
    sumrStakingRewardsResult,
    portfolioSumrStakingV2DataResult,
    claimableMerklRewardsResult,
  ] = await Promise.allSettled([
    getCachedSumrDelegateStake({ walletAddress }),
    getCachedSumrBalances({ walletAddress }),
    getCachedSumrStakingInfo({ walletAddress }),
    getCachedSumrToClaim(walletAddress),
    getCachedSumrStakingRewards({ walletAddress, sumrPriceUsd }),
    getCachedPortfolioSumrStakingV2Data({ walletAddress, sumrPriceUsd }),
    getCachedClaimableSUMRLVUSDCMerkleRewards(walletAddress),
  ])

  const sumrStakeDelegate =
    sumrStakeDelegateResult.status === 'fulfilled'
      ? sumrStakeDelegateResult.value
      : emptyRewardsData.sumrStakeDelegate
  const sumrBalances =
    sumrBalancesResult.status === 'fulfilled'
      ? sumrBalancesResult.value
      : emptyRewardsData.sumrBalances
  const sumrStakingInfo =
    sumrStakingInfoResult.status === 'fulfilled'
      ? sumrStakingInfoResult.value
      : emptyRewardsData.sumrStakingInfo
  const sumrToClaim =
    sumrToClaimResult.status === 'fulfilled'
      ? sumrToClaimResult.value
      : emptyRewardsData.sumrToClaim
  const sumrStakingRewards =
    sumrStakingRewardsResult.status === 'fulfilled'
      ? sumrStakingRewardsResult.value
      : {
          sumrRewardApy: 0,
          sumrRewardAmount: 0,
        }
  const portfolioSumrStakingV2Data =
    portfolioSumrStakingV2DataResult.status === 'fulfilled'
      ? portfolioSumrStakingV2DataResult.value
      : emptyPortfolioSumrStakingV2Data
  const claimableMerklRewards =
    claimableMerklRewardsResult.status === 'fulfilled'
      ? claimableMerklRewardsResult.value
      : { perChain: {} }

  const tallyDelegates =
    sumrStakeDelegate.delegatedToV2 !== emptyRewardsData.sumrStakeDelegate.delegatedToV2
      ? await getTallyDelegates(sumrStakeDelegate.delegatedToV2).catch(() => [])
      : []

  const rewardsData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrBalances,
    sumrStakeDelegate,
    sumrStakingInfo,
    tallyDelegates,
    sumrRewardApy: sumrStakingRewards.sumrRewardApy,
    sumrRewardAmount: sumrStakingRewards.sumrRewardAmount,
    authorizedStakingRewardsCallerBase: false,
  }

  const claimableMerklRewardsData = claimableMerklRewards.perChain[SupportedNetworkIds.Base]
  const usdcClaimableNow = getMerkleNowClaimableTokenAmount(claimableMerklRewardsData, 'USDC')
  const lvUsdcClaimableNow = getMerkleNowClaimableTokenAmount(claimableMerklRewardsData, 'LVUSDC')

  const rewardsList = [
    {
      symbol: 'USDC',
      amount: usdcClaimableNow,
      amountUSD: usdcClaimableNow * usdcPrice.usd,
      priceUsd: usdcPrice.usd,
    },
    {
      symbol: 'LVUSDC',
      amount: lvUsdcClaimableNow,
      amountUSD: lvUsdcClaimableNow * lvUsdcSharePriceInUsdc * usdcPrice.usd,
      priceUsd: lvUsdcSharePriceInUsdc * usdcPrice.usd,
    },
  ]

  const claimableRewards: ClaimableRewards = {
    rewards: rewardsList,
    usdAmount: rewardsList.reduce((acc, reward) => acc + reward.amountUSD, 0),
  }

  return NextResponse.json({
    rewardsData,
    portfolioSumrStakingV2Data,
    claimableRewards,
    errors: {
      sumrStakeDelegate: sumrStakeDelegateResult.status === 'rejected',
      sumrBalances: sumrBalancesResult.status === 'rejected',
      sumrStakingInfo: sumrStakingInfoResult.status === 'rejected',
      sumrToClaim: sumrToClaimResult.status === 'rejected',
      sumrStakingRewards: sumrStakingRewardsResult.status === 'rejected',
      portfolioSumrStakingV2Data: portfolioSumrStakingV2DataResult.status === 'rejected',
      claimableMerklRewards: claimableMerklRewardsResult.status === 'rejected',
      tallyDelegates:
        sumrStakeDelegate.delegatedToV2 !== emptyRewardsData.sumrStakeDelegate.delegatedToV2 &&
        tallyDelegates.length === 0,
    },
  })
}
