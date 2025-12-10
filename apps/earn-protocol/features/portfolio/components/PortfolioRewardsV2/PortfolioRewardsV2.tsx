import { type Dispatch, type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useUserWallet } from '@summerfi/app-earn-ui'
import type {
  StakingBucketInfo,
  StakingEarningsEstimationForStakesV2,
  UserStakeV2,
} from '@summerfi/armada-protocol-common'
import { type AddressValue, ChainIds, type StakingStake, User } from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'

import { LockedSumrInfoTabBarV2 } from '@/components/molecules/LockedSumrInfoTabBarV2/LockedSumrInfoTabBarV2'
import { SUMR_DECIMALS } from '@/features/bridge/constants/decimals'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
} from '@/features/claim-and-delegate/types'
import { useSumrNetApyConfig } from '@/features/nav-config/hooks/useSumrNetApyConfig'
import { PortfolioRewardsCardsV2 } from '@/features/portfolio/components/PortfolioRewardsCardsV2/PortfolioRewardsCardsV2'
import { PortfolioStakingInfoCardV2 } from '@/features/portfolio/components/PortfolioStakingInfoCardV2/PortfolioStakingInfoCardV2'
import { useAppSDK } from '@/hooks/use-app-sdk'

import classNames from './PortfolioRewardsV2.module.css'

interface PortfolioRewardsV2Props {
  rewardsData: ClaimDelegateExternalData
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
}

export const PortfolioRewardsV2: FC<PortfolioRewardsV2Props> = ({
  rewardsData,
  state,
  dispatch,
}) => {
  const { userWalletAddress } = useUserWallet()
  const portfolioWalletAddress = state.walletAddress

  // State for fetched data
  const [isLoadingStakes, setIsLoadingStakes] = useState<boolean>(true)
  const [isLoadingAllStakes, setIsLoadingAllStakes] = useState<boolean>(true)
  const [maxApy, setMaxApy] = useState<number>(0)
  const [sumrRewardApy, setSumrRewardApy] = useState<number>(0)
  const [totalSumrStaked, setTotalSumrStaked] = useState<number>(0)
  const [circulatingSupply, setCirculatingSupply] = useState<number>(0)
  const [averageLockDuration, setAverageLockDuration] = useState<number>(0)
  const [sumrAvailableToStake, setSumrAvailableToStake] = useState<number>(0)
  const [sumrStaked, setSumrStaked] = useState<number>(0)
  const [userStakes, setUserStakes] = useState<UserStakeV2[]>([])
  const [allStakes, setAllStakes] = useState<StakingStake[]>([])
  const [yourEarningsEstimation, setYourEarningsEstimation] =
    useState<StakingEarningsEstimationForStakesV2 | null>(null)
  const [allEarningsEstimation, setAllEarningsEstimation] =
    useState<StakingEarningsEstimationForStakesV2 | null>(null)
  const [penaltyPercentages, setPenaltyPercentages] = useState<{ value: number; index: number }[]>(
    [],
  )
  const [penaltyAmounts, setPenaltyAmounts] = useState<{ value: bigint; index: number }[]>([])
  const [userBlendedYieldBoost, setUserBlendedYieldBoost] = useState<number>(0)
  const [bucketInfo, setBucketInfo] = useState<StakingBucketInfo[]>([])
  const [isLoadingBucketInfo, setIsLoadingBucketInfo] = useState<boolean>(true)
  const [userUsdcRealYield, setUserUsdcRealYield] = useState<number>(0)

  const {
    getUserBalance,
    getStakingRewardRatesV2,
    getStakingStatsV2,
    getStakingRevenueShareV2,
    getStakingEarningsEstimationV2,
    getUserStakingSumrStaked,
    getUserStakesV2,
    getCalculatePenaltyPercentage,
    getCalculatePenaltyAmount,
    getUserBlendedYieldBoost,
    getStakingStakesV2,
    getStakingBucketsInfoV2,
  } = useAppSDK()

  const [sumrNetApyConfig] = useSumrNetApyConfig()
  const sumrPriceUsd = useMemo(
    () => new BigNumber(sumrNetApyConfig.dilutedValuation, 10).dividedBy(1_000_000_000).toNumber(),
    [sumrNetApyConfig.dilutedValuation],
  )

  const fetchStakingData = useCallback(async () => {
    const user = User.createFromEthereum(ChainIds.Base, portfolioWalletAddress as AddressValue)

    try {
      setIsLoadingStakes(true)
      setIsLoadingAllStakes(true)
      setIsLoadingBucketInfo(true)
      // Fetch all data in parallel
      const [
        userBalance,
        rewardRates,
        stakingStats,
        revenueShare,
        userStaked,
        userStakesData,
        _userBlendedYieldBoost,
        allStakesData,
        bucketsInfo,
      ] = await Promise.all([
        getUserBalance({
          userAddress: portfolioWalletAddress as AddressValue,
          chainId: ChainIds.Base,
        }),
        getStakingRewardRatesV2({
          sumrPriceUsd,
        }),
        getStakingStatsV2(),
        getStakingRevenueShareV2(),
        getUserStakingSumrStaked({
          user,
        }),
        getUserStakesV2({
          user,
        }),
        getUserBlendedYieldBoost({
          user,
        }),
        getStakingStakesV2({
          first: 10,
          skip: 0,
        }),
        getStakingBucketsInfoV2(),
      ])

      const [
        _yourEarningsEstimation,
        _allEarningsEstimation,
        _penaltyCalculationPercentage,
        _penaltyCalculationAmount,
      ] = await Promise.all([
        getStakingEarningsEstimationV2({
          stakes: userStakesData,
        }),
        getStakingEarningsEstimationV2({
          stakes: allStakesData,
        }),
        getCalculatePenaltyPercentage({
          userStakes: userStakesData,
        }),
        getCalculatePenaltyAmount({
          userStakes: userStakesData,
        }),
      ])

      setYourEarningsEstimation(_yourEarningsEstimation)
      setAllEarningsEstimation(_allEarningsEstimation)
      setUserBlendedYieldBoost(_userBlendedYieldBoost)
      const userTotalWeightedTokens = userStakesData.reduce(
        (acc, stake) => acc + stake.weightedAmount,
        0n,
      )
      const totalUsdcRealYield =
        userTotalWeightedTokens > 0
          ? new BigNumber(revenueShare.amount)
              .dividedBy(
                new BigNumber(userTotalWeightedTokens)
                  .shiftedBy(-SUMR_DECIMALS)
                  .multipliedBy(sumrPriceUsd),
              )
              .multipliedBy(_userBlendedYieldBoost)
              .toNumber()
          : 0

      setUserUsdcRealYield(totalUsdcRealYield)

      // Map penalty percentages with stake indices
      setPenaltyPercentages(
        _penaltyCalculationPercentage.map((percentage, idx) => ({
          value: percentage.value,
          index: userStakesData[idx].index,
        })),
      )

      // Map penalty amounts with stake indices
      setPenaltyAmounts(
        _penaltyCalculationAmount.map((amount, idx) => ({
          value: amount,
          index: userStakesData[idx].index,
        })),
      )

      // Process user balance
      const availableSumrValue = new BigNumber(userBalance).shiftedBy(-SUMR_DECIMALS).toNumber()

      setSumrAvailableToStake(availableSumrValue)

      // Process user staked amount
      const stakedSumrValue = new BigNumber(userStaked).shiftedBy(-SUMR_DECIMALS).toNumber()

      setSumrStaked(stakedSumrValue)

      // Process reward rates
      setMaxApy(rewardRates.maxApy.value)
      setSumrRewardApy(rewardRates.summerRewardYield.value)

      // Process staking stats
      setTotalSumrStaked(new BigNumber(stakingStats.summerStakedNormalized).toNumber())
      setCirculatingSupply(new BigNumber(stakingStats.circulatingSupply).toNumber())

      // Format average lock duration from seconds to seconds (as expected by the component)
      if (stakingStats.averageLockupPeriod) {
        setAverageLockDuration(Number(stakingStats.averageLockupPeriod))
      }

      // Set user stakes
      setUserStakes(userStakesData)

      // Set all stakes
      setAllStakes(allStakesData)
      setIsLoadingAllStakes(false)

      // Set bucket info
      setBucketInfo(bucketsInfo)
      setIsLoadingBucketInfo(false)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch staking data:', error)
    } finally {
      setIsLoadingStakes(false)
    }
  }, [
    getStakingEarningsEstimationV2,
    getStakingRewardRatesV2,
    getStakingStatsV2,
    getStakingRevenueShareV2,
    getUserBalance,
    getUserStakesV2,
    getUserStakingSumrStaked,
    getCalculatePenaltyPercentage,
    getCalculatePenaltyAmount,
    getUserBlendedYieldBoost,
    getStakingStakesV2,
    getStakingBucketsInfoV2,
    sumrPriceUsd,
    portfolioWalletAddress,
  ])

  // Fetch all staking data on mount
  useEffect(() => {
    void fetchStakingData()
  }, [fetchStakingData])

  // Calculate percentage staked
  const percentStaked = useMemo(() => {
    if (circulatingSupply === 0) return 0

    return totalSumrStaked / circulatingSupply
  }, [totalSumrStaked, circulatingSupply])

  const usdcEarnedOnSumrAmount = useMemo(() => {
    return yourEarningsEstimation
      ? yourEarningsEstimation.stakes.reduce(
          (acc, stake) => acc + parseFloat(stake.usdEarningsAmount.toString()),
          0,
        )
      : 0
  }, [yourEarningsEstimation])

  const sumrRewardAmount = useMemo(() => {
    return yourEarningsEstimation
      ? yourEarningsEstimation.stakes.reduce(
          (acc, stake) => acc + parseFloat(stake.sumrRewardsAmount.toString()),
          0,
        )
      : 0
  }, [yourEarningsEstimation])

  return (
    <div className={classNames.wrapper}>
      <PortfolioRewardsCardsV2 rewardsData={rewardsData} state={state} dispatch={dispatch} />
      <PortfolioStakingInfoCardV2
        usdcEarnedOnSumr={maxApy}
        usdcEarnedOnSumrAmount={usdcEarnedOnSumrAmount}
        sumrPrice={sumrPriceUsd}
        sumrRewardApy={sumrRewardApy}
        sumrRewardAmount={sumrRewardAmount}
        stats={{
          totalSumrStaked,
          circulatingSupply,
          percentStaked,
          averageLockDuration,
        }}
        sumrUserData={{
          sumrAvailableToStake,
          sumrStaked,
        }}
        sumrPriceUsd={sumrPriceUsd}
        userUsdcRealYield={userUsdcRealYield}
        isLoading={isLoadingStakes}
      />
      <LockedSumrInfoTabBarV2
        stakes={userStakes}
        isLoading={isLoadingStakes}
        userWalletAddress={userWalletAddress as AddressValue}
        refetchStakingData={fetchStakingData}
        penaltyPercentages={penaltyPercentages}
        penaltyAmounts={penaltyAmounts}
        yourEarningsEstimation={yourEarningsEstimation}
        allEarningsEstimation={allEarningsEstimation}
        userBlendedYieldBoost={userBlendedYieldBoost}
        userSumrStaked={sumrStaked}
        totalSumrStaked={totalSumrStaked}
        allStakes={allStakes}
        isLoadingAllStakes={isLoadingAllStakes}
        averageLockDuration={averageLockDuration}
        circulatingSupply={circulatingSupply}
        bucketInfo={bucketInfo}
        isLoadingBucketInfo={isLoadingBucketInfo}
      />
    </div>
  )
}
