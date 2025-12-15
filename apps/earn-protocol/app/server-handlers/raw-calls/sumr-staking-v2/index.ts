import { parseServerResponseToClientWithBigint } from '@summerfi/app-utils'
import { type AddressValue, ChainIds, User } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'

import { type PortfolioSumrStakingV2Data } from '@/app/server-handlers/raw-calls/sumr-staking-v2/types'
import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { SUMR_DECIMALS } from '@/features/bridge/constants/decimals'

type GetPortfolioSumrStakingV2DataFuncType = (args: {
  walletAddress: string
  sumrPriceUsd?: number
}) => Promise<PortfolioSumrStakingV2Data>

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
      allStakes: allStakesData,
      bucketInfo: bucketsInfo,
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
    userStakes: parseServerResponseToClientWithBigint(userStakesData),
    allStakes: parseServerResponseToClientWithBigint(allStakesData),
    bucketInfo: parseServerResponseToClientWithBigint(bucketsInfo),
    penaltyPercentages: penaltyCalculationPercentage.map((percentage, idx) => ({
      value: percentage.value,
      index: userStakesData[idx].index,
    })),
    penaltyAmounts: penaltyCalculationAmount.map((amount, idx) => ({
      value: Number(amount),
      index: userStakesData[idx].index,
    })),
    yourEarningsEstimation: parseServerResponseToClientWithBigint(yourEarningsEstimation),
    userBlendedYieldBoost,
    userUsdcRealYield,
    usdcEarnedOnSumrAmount,
  }
}
