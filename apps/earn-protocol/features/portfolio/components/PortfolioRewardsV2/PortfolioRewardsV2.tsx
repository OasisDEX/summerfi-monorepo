import { type Dispatch, type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useUserWallet } from '@summerfi/app-earn-ui'
import type {
  StakingEarningsEstimationForStakesV2,
  UserStakeV2,
} from '@summerfi/armada-protocol-common'
import { type AddressValue, ChainIds, User } from '@summerfi/sdk-common'
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

  // State for fetched data
  const [isLoadingStakes, setIsLoadingStakes] = useState<boolean>(true)
  const [maxApy, setMaxApy] = useState<number>(0)
  const [sumrRewardApy, setSumrRewardApy] = useState<number>(0)
  const [totalSumrStaked, setTotalSumrStaked] = useState<number>(0)
  const [circulatingSupply, setCirculatingSupply] = useState<number>(0)
  const [averageLockDuration, setAverageLockDuration] = useState<number>(0)
  const [sumrAvailableToStake, setSumrAvailableToStake] = useState<number>(0)
  const [sumrStaked, setSumrStaked] = useState<number>(0)
  const [userStakes, setUserStakes] = useState<UserStakeV2[]>([])
  const [earningsEstimation, setEarningsEstimation] =
    useState<StakingEarningsEstimationForStakesV2 | null>(null)
  const [penaltyPercentages, setPenaltyPercentages] = useState<{ value: number; index: number }[]>(
    [],
  )
  const [penaltyAmounts, setPenaltyAmounts] = useState<{ value: bigint; index: number }[]>([])

  const {
    getUserBalance,
    getStakingRewardRatesV2,
    getStakingStatsV2,
    getUserStakingSumrStaked,
    getUserStakesV2,
    getStakingEarningsEstimationV2,
    getCalculatePenaltyPercentage,
    getCalculatePenaltyAmount,
  } = useAppSDK()

  const [sumrNetApyConfig] = useSumrNetApyConfig()
  const sumrPriceUsd = useMemo(
    () => new BigNumber(sumrNetApyConfig.dilutedValuation, 10).dividedBy(1_000_000_000).toNumber(),
    [sumrNetApyConfig.dilutedValuation],
  )

  const fetchStakingData = useCallback(async () => {
    const user = User.createFromEthereum(ChainIds.Base, userWalletAddress as AddressValue)

    try {
      setIsLoadingStakes(true)
      // Fetch all data in parallel
      const [userBalance, rewardRates, stakingStats, userStaked, userStakesData] =
        await Promise.all([
          getUserBalance({
            userAddress: userWalletAddress as AddressValue,
            chainId: ChainIds.Base,
          }),
          getStakingRewardRatesV2({
            sumrPriceUsd,
          }),
          getStakingStatsV2(),

          getUserStakingSumrStaked({
            user,
          }),
          getUserStakesV2({
            user,
          }),
        ])

      const [_earningsEstimation, _penaltyCalculationPercentage, _penaltyCalculationAmount] =
        await Promise.all([
          getStakingEarningsEstimationV2({
            stakes: userStakesData,
          }),
          getCalculatePenaltyPercentage({
            userStakes: userStakesData,
          }),
          getCalculatePenaltyAmount({
            userStakes: userStakesData,
          }),
        ])

      setEarningsEstimation(_earningsEstimation)

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
    getUserBalance,
    getUserStakesV2,
    getUserStakingSumrStaked,
    getCalculatePenaltyPercentage,
    getCalculatePenaltyAmount,
    sumrPriceUsd,
    userWalletAddress,
  ])

  // Fetch all staking data on mount
  useEffect(() => {
    if (!userWalletAddress) return

    void fetchStakingData()
  }, [fetchStakingData, userWalletAddress])

  // Calculate percentage staked
  const percentStaked = useMemo(() => {
    if (circulatingSupply === 0) return 0

    return totalSumrStaked / circulatingSupply
  }, [totalSumrStaked, circulatingSupply])

  const usdcEarnedOnSumrAmount = useMemo(() => {
    return earningsEstimation
      ? earningsEstimation.stakes.reduce(
          (acc, stake) => acc + parseFloat(stake.usdEarningsAmount.toString()),
          0,
        )
      : 0
  }, [earningsEstimation])

  const sumrRewardAmount = useMemo(() => {
    return earningsEstimation
      ? earningsEstimation.stakes.reduce(
          (acc, stake) => acc + parseFloat(stake.sumrRewardsAmount.toString()),
          0,
        )
      : 0
  }, [earningsEstimation])

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
      />
      <LockedSumrInfoTabBarV2
        stakes={userStakes}
        isLoading={isLoadingStakes}
        userWalletAddress={userWalletAddress}
        refetchStakingData={fetchStakingData}
        penaltyPercentages={penaltyPercentages}
        penaltyAmounts={penaltyAmounts}
      />
    </div>
  )
}
