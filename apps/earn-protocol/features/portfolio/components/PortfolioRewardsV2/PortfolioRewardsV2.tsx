import { type Dispatch, type FC, useCallback, useMemo } from 'react'
import { useUserWallet } from '@summerfi/app-earn-ui'
import { type AddressValue } from '@summerfi/sdk-common'

import { type PortfolioSumrStakingV2Data } from '@/app/server-handlers/raw-calls/sumr-staking-v2/types'
import { LockedSumrInfoTabBarV2 } from '@/components/molecules/LockedSumrInfoTabBarV2/LockedSumrInfoTabBarV2'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
} from '@/features/claim-and-delegate/types'
import { PortfolioRewardsCardsV2 } from '@/features/portfolio/components/PortfolioRewardsCardsV2/PortfolioRewardsCardsV2'
import { PortfolioStakingInfoCardV2 } from '@/features/portfolio/components/PortfolioStakingInfoCardV2/PortfolioStakingInfoCardV2'
import { useRevalidateUser } from '@/hooks/use-revalidate'

import classNames from './PortfolioRewardsV2.module.css'

interface PortfolioRewardsV2Props {
  rewardsData: ClaimDelegateExternalData
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  portfolioSumrStakingV2Data: PortfolioSumrStakingV2Data
  viewWalletAddress: string
  sumrPriceUsd: number
  claimableRewards: {
    usdcClaimableNow: number
    lvUsdcClaimableNow: number
  }
}

export const PortfolioRewardsV2: FC<PortfolioRewardsV2Props> = ({
  rewardsData,
  state,
  dispatch,
  portfolioSumrStakingV2Data,
  viewWalletAddress,
  sumrPriceUsd,
  claimableRewards,
}) => {
  const { userWalletAddress } = useUserWallet()
  const portfolioWalletAddress = state.walletAddress

  const {
    sumrAvailableToStake,
    sumrStakedV2,
    maxApy,
    stakedSumrRewardApy,
    maxSumrRewardApy,
    totalSumrStaked,
    circulatingSupply,
    averageLockDuration,
    userStakes,
    allStakes,
    bucketInfo,
    penaltyPercentages,
    penaltyAmounts,
    yourEarningsEstimation,
    userBlendedYieldBoost,
    userUsdcRealYield,
    usdcEarnedOnSumrAmount,
  } = portfolioSumrStakingV2Data

  const revalidateUser = useRevalidateUser()

  // Calculate percentage staked
  const percentStaked = useMemo(() => {
    if (circulatingSupply === 0) return 0

    return totalSumrStaked / circulatingSupply
  }, [totalSumrStaked, circulatingSupply])

  const sumrRewardAmount = useMemo(() => {
    return yourEarningsEstimation
      ? yourEarningsEstimation.stakes.reduce(
          (acc, stake) => acc + parseFloat(stake.sumrRewardsAmount.toString()),
          0,
        )
      : 0
  }, [yourEarningsEstimation])

  const refetchStakingData = useCallback(async () => {
    if (!portfolioWalletAddress) return
    await revalidateUser(portfolioWalletAddress)
  }, [portfolioWalletAddress, revalidateUser])

  return (
    <div className={classNames.wrapper}>
      <PortfolioRewardsCardsV2
        rewardsData={rewardsData}
        state={state}
        dispatch={dispatch}
        sumrStakedV2={sumrStakedV2}
        sumrPriceUsd={sumrPriceUsd}
        claimableRewards={claimableRewards}
        viewWalletAddress={viewWalletAddress}
      />
      <PortfolioStakingInfoCardV2
        usdcEarnedOnSumr={maxApy}
        usdcEarnedOnSumrAmount={usdcEarnedOnSumrAmount}
        sumrPrice={sumrPriceUsd}
        sumrRewardApy={stakedSumrRewardApy}
        maxSumrRewardApy={maxSumrRewardApy}
        sumrRewardAmount={sumrRewardAmount}
        stats={{
          totalSumrStaked,
          circulatingSupply,
          percentStaked,
          averageLockDuration,
        }}
        sumrUserData={{
          sumrAvailableToStake,
          sumrStaked: sumrStakedV2,
        }}
        sumrPriceUsd={sumrPriceUsd}
        userUsdcRealYield={userUsdcRealYield}
      />
      <LockedSumrInfoTabBarV2
        stakes={userStakes}
        userWalletAddress={userWalletAddress as AddressValue}
        viewWalletAddress={viewWalletAddress}
        refetchStakingData={refetchStakingData}
        penaltyPercentages={penaltyPercentages}
        penaltyAmounts={penaltyAmounts}
        yourEarningsEstimation={yourEarningsEstimation}
        userBlendedYieldBoost={userBlendedYieldBoost}
        userSumrStaked={sumrStakedV2}
        totalSumrStaked={totalSumrStaked}
        allStakes={allStakes}
        averageLockDuration={averageLockDuration}
        circulatingSupply={circulatingSupply}
        bucketInfo={bucketInfo}
      />
    </div>
  )
}
