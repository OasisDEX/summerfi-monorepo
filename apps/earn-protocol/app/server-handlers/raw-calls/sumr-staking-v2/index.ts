import { parseJsonSafelyWithBigInt } from '@summerfi/app-utils'
import { type AddressValue, ChainIds, User } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'

import {
  type LandingPageStakingV2Data,
  type LandingPageStakingV2UserData,
  type PortfolioSumrStakingV2Data,
} from '@/app/server-handlers/raw-calls/sumr-staking-v2/types'
import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { MAX_MULTIPLE } from '@/constants/sumr-staking-v2'
import { SUMR_DECIMALS } from '@/features/bridge/constants/decimals'

type GetPortfolioSumrStakingV2DataFuncType = (args: {
  walletAddress: string
  sumrPriceUsd?: number
}) => Promise<PortfolioSumrStakingV2Data>

type GetLandingPageStakingV2DataFuncType = (args: {
  sumrPriceUsd?: number
}) => Promise<LandingPageStakingV2Data>

type GetLandingPageStakingV2UserDataFuncType = (args: {
  walletAddress: string
  sumrPriceUsd?: number
}) => Promise<LandingPageStakingV2UserData>

export const getPortfolioSumrStakingV2Data: GetPortfolioSumrStakingV2DataFuncType = async ({
  walletAddress,
  sumrPriceUsd,
}) => {
  const user = User.createFromEthereum(ChainIds.Base, walletAddress as AddressValue)

  const [
    userBalance,
    rewardRates,
    stakingStats,
    userStaked,
    userStakesData,
    userBlendedYieldBoost,
    allStakesData,
    bucketsInfo,
  ] = await Promise.all([
    backendSDK.armada.users.getUserBalance({ user }),
    backendSDK.armada.users.getStakingRewardRatesV2({ sumrPriceUsd }),
    backendSDK.armada.users.getStakingStatsV2(),
    backendSDK.armada.users.getUserStakingSumrStaked({ user }),
    backendSDK.armada.users.getUserStakesV2({ user }),
    backendSDK.armada.users.getUserBlendedYieldBoost({ user }),
    backendSDK.armada.users.getStakingStakesV2({}),
    backendSDK.armada.users.getStakingBucketsInfoV2(),
  ])

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!userStakesData || userStakesData.length === 0) {
    return {
      // computed / formatted values matching client state names
      sumrAvailableToStake: new BigNumber(userBalance).shiftedBy(-SUMR_DECIMALS).toNumber(),
      sumrStakedV2: new BigNumber(userStaked).shiftedBy(-SUMR_DECIMALS).toNumber(),
      maxApy: rewardRates.maxApy.value,
      stakedSumrRewardApy: rewardRates.summerRewardYield.value * userBlendedYieldBoost,
      maxSumrRewardApy: rewardRates.maxSummerRewardYield.value,
      totalSumrStaked: new BigNumber(stakingStats.summerStakedNormalized).toNumber(),
      circulatingSupply: new BigNumber(stakingStats.circulatingSupply).toNumber(),
      averageLockDuration: stakingStats.averageLockupPeriod
        ? Number(stakingStats.averageLockupPeriod)
        : 0,
      userStakes: [],
      allStakes: parseJsonSafelyWithBigInt(allStakesData),
      bucketInfo: parseJsonSafelyWithBigInt(bucketsInfo),
      penaltyPercentages: [],
      penaltyAmounts: [],
      yourEarningsEstimation: undefined,
      userBlendedYieldBoost,
      userUsdcRealYield: 0,
      usdcEarnedOnSumrAmount: 0,
    }
  }

  const [yourEarningsEstimation, penaltyCalculationPercentage, penaltyCalculationAmount] =
    await Promise.all([
      backendSDK.armada.users.getStakingEarningsEstimationV2({
        stakes: userStakesData.map((stake) => ({
          id: String(stake.id),
          weightedAmount: String(stake.weightedAmount),
        })),
      }),
      backendSDK.armada.users.getCalculatePenaltyPercentage({
        userStakes: userStakesData.map((stake) => ({
          lockupEndTime: Number(stake.lockupEndTime),
        })),
      }),
      backendSDK.armada.users.getCalculatePenaltyAmount({
        userStakes: userStakesData.map((stake) => ({
          lockupEndTime: Number(stake.lockupEndTime),
        })),
        amounts: userStakesData.map((stake) => stake.amount),
      }),
    ])

  const userTotalWeightedTokens = userStakesData.reduce(
    (acc, stake) => acc + stake.weightedAmount,
    0n,
  )

  const usdcEarnedOnSumrAmount = yourEarningsEstimation.stakes.reduce(
    (acc, stake) => acc + parseFloat(stake.usdEarningsAmount.toString()),
    0,
  )

  const userUsdcRealYield =
    userTotalWeightedTokens > 0
      ? new BigNumber(usdcEarnedOnSumrAmount)
          .dividedBy(
            new BigNumber(userTotalWeightedTokens)
              .shiftedBy(-SUMR_DECIMALS)
              .multipliedBy(sumrPriceUsd ?? 0),
          )
          .multipliedBy(userBlendedYieldBoost)
          .toNumber()
      : 0

  return {
    // computed / formatted values matching client state names
    sumrAvailableToStake: new BigNumber(userBalance).shiftedBy(-SUMR_DECIMALS).toNumber(),
    sumrStakedV2: new BigNumber(userStaked).shiftedBy(-SUMR_DECIMALS).toNumber(),
    maxApy: rewardRates.maxApy.value,
    stakedSumrRewardApy: rewardRates.summerRewardYield.value * userBlendedYieldBoost,
    maxSumrRewardApy: rewardRates.maxSummerRewardYield.value,
    totalSumrStaked: new BigNumber(stakingStats.summerStakedNormalized).toNumber(),
    circulatingSupply: new BigNumber(stakingStats.circulatingSupply).toNumber(),
    averageLockDuration: stakingStats.averageLockupPeriod
      ? Number(stakingStats.averageLockupPeriod)
      : 0,
    userStakes: parseJsonSafelyWithBigInt(userStakesData),
    allStakes: parseJsonSafelyWithBigInt(allStakesData),
    bucketInfo: parseJsonSafelyWithBigInt(bucketsInfo),
    penaltyPercentages: penaltyCalculationPercentage.map((percentage, idx) => ({
      value: percentage.value,
      index: userStakesData[idx].index,
    })),
    penaltyAmounts: penaltyCalculationAmount.map((amount, idx) => ({
      value: Number(amount),
      index: userStakesData[idx].index,
    })),
    yourEarningsEstimation: parseJsonSafelyWithBigInt(yourEarningsEstimation),
    userBlendedYieldBoost,
    userUsdcRealYield,
    usdcEarnedOnSumrAmount,
  }
}

export const getLandingPageSumrStakingV2Data: GetLandingPageStakingV2DataFuncType = async ({
  sumrPriceUsd,
}) => {
  const [
    rewardRates,
    revenue,
    tvl,
    revenueShare,
    totalWeightedSupply,
    stakingStats,
    allStakesData,
    bucketsInfo,
  ] = await Promise.all([
    backendSDK.armada.users.getStakingRewardRatesV2({ sumrPriceUsd }),
    backendSDK.armada.users.getProtocolRevenue(),
    backendSDK.armada.users.getProtocolTvl(),
    backendSDK.armada.users.getStakingRevenueShareV2(),
    backendSDK.armada.users.getStakingTotalWeightedSupplyV2(),
    backendSDK.armada.users.getStakingStatsV2(),
    backendSDK.armada.users.getStakingStakesV2({}),
    backendSDK.armada.users.getStakingBucketsInfoV2(),
  ])

  const totalSumrStaked = new BigNumber(stakingStats.summerStakedNormalized).toNumber()
  const circulatingSupply = new BigNumber(stakingStats.circulatingSupply).toNumber()
  const averageLockDuration = stakingStats.averageLockupPeriod
    ? Number(stakingStats.averageLockupPeriod)
    : 0

  const formatPercentValue = (value: BigNumber.Value) =>
    new BigNumber(value).multipliedBy(100).toFixed(2, BigNumber.ROUND_DOWN)
  const formatCryptoBalance = (value: BigNumber.Value) =>
    new BigNumber(value).toFixed(2, BigNumber.ROUND_DOWN)

  return {
    maxApy: formatPercentValue(new BigNumber(rewardRates.maxApy.value).div(100)),
    sumrRewardApy: formatPercentValue(
      new BigNumber(rewardRates.summerRewardYield.value).div(100).multipliedBy(MAX_MULTIPLE),
    ),
    protocolRevenue: formatCryptoBalance(revenue),
    protocolTvl: formatCryptoBalance(tvl),
    revenueSharePercentage: revenueShare.percentage.value.toFixed(0),
    revenueShareAmount: formatCryptoBalance(new BigNumber(revenueShare.amount)),
    totalSumrStaked,
    circulatingSupply,
    averageLockDuration,
    allStakes: parseJsonSafelyWithBigInt(allStakesData),
    bucketInfo: parseJsonSafelyWithBigInt(bucketsInfo),
    totalWeightedSupply: Number(totalWeightedSupply), // included for any downstream use
  }
}

export const getLandingPageSumrStakingV2UserData: GetLandingPageStakingV2UserDataFuncType = async ({
  walletAddress,
  sumrPriceUsd,
}) => {
  const user = User.createFromEthereum(ChainIds.Base, walletAddress as AddressValue)

  const [userBalance, aggregatedRewards, userStaked, userStakesData, userBlendedYieldBoost] =
    await Promise.all([
      backendSDK.armada.users.getUserBalance({ user }),
      backendSDK.armada.users.getAggregatedRewardsIncludingMerkl({ user }),
      backendSDK.armada.users.getUserStakingSumrStaked({ user }),
      backendSDK.armada.users.getUserStakesV2({ user }),
      backendSDK.armada.users.getUserBlendedYieldBoost({ user }),
    ])

  const availableSumr = new BigNumber(userBalance)
    .shiftedBy(-SUMR_DECIMALS)
    .toFixed(2, BigNumber.ROUND_DOWN)
  const availableSumrUsd = new BigNumber(availableSumr)
    .times(sumrPriceUsd ?? 0)
    .toFixed(2, BigNumber.ROUND_DOWN)

  const claimableSumr = new BigNumber(aggregatedRewards.total)
    .shiftedBy(-SUMR_DECIMALS)
    .toFixed(2, BigNumber.ROUND_DOWN)
  const claimableSumrUsd = new BigNumber(claimableSumr)
    .times(sumrPriceUsd ?? 0)
    .toFixed(2, BigNumber.ROUND_DOWN)

  if (userStakesData.length === 0) {
    return {
      availableSumr,
      availableSumrUsd,
      claimableSumr,
      claimableSumrUsd,
      sumrStaked: 0,
      userStakes: [],
      earningsEstimation: undefined,
      penaltyPercentages: [],
      penaltyAmounts: [],
      userBlendedYieldBoost,
      usdcEarnedOnSumrAmount: '0',
    }
  }

  const [
    earningsEstimation,
    penaltyCalculationPercentage,
    penaltyCalculationAmount,
    revenueShare,
    totalWeightedSupply,
  ] = await Promise.all([
    backendSDK.armada.users.getStakingEarningsEstimationV2({
      stakes: userStakesData.slice(0, 12).map((stake) => ({
        id: String(stake.id),
        weightedAmount: String(stake.weightedAmount),
      })),
    }),
    backendSDK.armada.users.getCalculatePenaltyPercentage({
      userStakes: userStakesData.map((stake) => ({
        lockupEndTime: Number(stake.lockupEndTime),
      })),
    }),
    backendSDK.armada.users.getCalculatePenaltyAmount({
      userStakes: userStakesData.map((stake) => ({
        lockupEndTime: Number(stake.lockupEndTime),
      })),
      amounts: userStakesData.map((stake) => stake.amount),
    }),
    backendSDK.armada.users.getStakingRevenueShareV2(),
    backendSDK.armada.users.getStakingTotalWeightedSupplyV2(),
  ])

  const sumrStaked = new BigNumber(userStaked).shiftedBy(-SUMR_DECIMALS).toNumber()
  const userStakes = parseJsonSafelyWithBigInt(userStakesData)

  const totalSumrBN = new BigNumber(sumrStaked).plus(availableSumr)
  const totalWeightedSupplyBN = new BigNumber(totalWeightedSupply).shiftedBy(-SUMR_DECIMALS)

  const usdcEarnedOnSumrAmount =
    totalWeightedSupplyBN.gt(0) && totalSumrBN.gt(0)
      ? new BigNumber(totalSumrBN.times(userBlendedYieldBoost).dividedBy(totalWeightedSupplyBN))
          .times(revenueShare.amount)
          .toFixed(2, BigNumber.ROUND_DOWN)
      : '0'

  return {
    availableSumr,
    availableSumrUsd,
    claimableSumr,
    claimableSumrUsd,
    sumrStaked,
    userStakes,
    earningsEstimation: parseJsonSafelyWithBigInt(earningsEstimation),
    penaltyPercentages: penaltyCalculationPercentage.map((percentage, idx) => ({
      value: percentage.value,
      index: userStakesData[idx].index,
    })),
    penaltyAmounts: penaltyCalculationAmount.map((amount, idx) => ({
      value: Number(amount),
      index: userStakesData[idx].index,
    })),
    userBlendedYieldBoost,
    usdcEarnedOnSumrAmount,
  }
}
