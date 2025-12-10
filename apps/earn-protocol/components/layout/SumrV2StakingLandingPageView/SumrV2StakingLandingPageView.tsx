'use client'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  DataBlock,
  FaqSection,
  GradientBox,
  Icon,
  SkeletonLine,
  Text,
  Tooltip,
  useUserWallet,
  WithArrow,
  YieldSourceLabel,
} from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatPercent } from '@summerfi/app-utils'
import type {
  StakingBucketInfo,
  StakingEarningsEstimationForStakesV2,
  UserStakeV2,
} from '@summerfi/armada-protocol-common'
import { SDKContextProvider } from '@summerfi/sdk-client-react'
import { type AddressValue, ChainIds, type StakingStake, User } from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'
import Image from 'next/image'
import Link from 'next/link'

import { SumrV2PageHeader } from '@/components/layout/SumrV2PageHeader/SumrV2PageHeader'
import { LockedSumrInfoTabBarV2 } from '@/components/molecules/LockedSumrInfoTabBarV2/LockedSumrInfoTabBarV2'
import WalletLabel from '@/components/molecules/WalletLabel/WalletLabel'
import { sdkApiUrl } from '@/constants/sdk'
import { SUMR_DECIMALS } from '@/features/bridge/constants/decimals'
import { useSumrNetApyConfig } from '@/features/nav-config/hooks/useSumrNetApyConfig'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useHandleTooltipOpenEvent } from '@/hooks/use-mixpanel-event'

import sumrV2PageStyles from './SumrV2StakingLandingPageView.module.css'

import lockEarningDiagram from '@/public/img/sumr/lock_earn_diagram.png'

interface SumrV2StakingPageViewProps {}

const SumrV2StakingLandingPageContent: FC<SumrV2StakingPageViewProps> = () => {
  const tooltipEventHandler = useHandleTooltipOpenEvent()
  const { userWalletAddress } = useUserWallet()

  // State for fetched data
  const [isLoading, setIsLoading] = useState(true)
  const [availableSumr, setAvailableSumr] = useState<string>('0')
  const [availableSumrUsd, setAvailableSumrUsd] = useState<string>('0')
  const [claimableSumr, setClaimableSumr] = useState<string>('0')
  const [claimableSumrUsd, setClaimableSumrUsd] = useState<string>('0')
  const [maxApy, setMaxApy] = useState<string>('0')
  const [maxApyUsdPerYear, setMaxApyUsdPerYear] = useState<string>('0')
  const [sumrRewardApy, setSumrRewardApy] = useState<string>('0')
  const [earnableSumr, setEarnableSumr] = useState<string>('0')
  const [earnableSumrUsd, setEarnableSumrUsd] = useState<string>('0')
  const [protocolRevenue, setProtocolRevenue] = useState<string>('0')
  const [protocolTvl, setProtocolTvl] = useState<string>('0')
  const [revenueSharePercentage, setRevenueSharePercentage] = useState<string>('0')
  const [revenueShareAmount, setRevenueShareAmount] = useState<string>('0')

  // State for LockedSumrInfoTabBarV2
  const [isLoadingStakes, setIsLoadingStakes] = useState<boolean>(false)
  const [isLoadingAllStakes, setIsLoadingAllStakes] = useState<boolean>(false)
  const [totalSumrStaked, setTotalSumrStaked] = useState<number>(0)
  const [circulatingSupply, setCirculatingSupply] = useState<number>(0)
  const [averageLockDuration, setAverageLockDuration] = useState<number>(0)
  const [sumrStaked, setSumrStaked] = useState<number>(0)
  const [userStakes, setUserStakes] = useState<UserStakeV2[]>([])
  const [allStakes, setAllStakes] = useState<StakingStake[]>([])
  const [earningsEstimation, setEarningsEstimation] =
    useState<StakingEarningsEstimationForStakesV2 | null>(null)
  // const [allEarningsEstimation, setAllEarningsEstimation] =
  //   useState<StakingEarningsEstimationForStakesV2 | null>(null)
  const [penaltyPercentages, setPenaltyPercentages] = useState<{ value: number; index: number }[]>(
    [],
  )
  const [penaltyAmounts, setPenaltyAmounts] = useState<{ value: bigint; index: number }[]>([])
  const [userBlendedYieldBoost, setUserBlendedYieldBoost] = useState<number>(0)
  const [bucketInfo, setBucketInfo] = useState<StakingBucketInfo[]>([])
  const [isLoadingBucketInfo, setIsLoadingBucketInfo] = useState<boolean>(false)

  const {
    getUserBalance,
    getAggregatedRewardsIncludingMerkl,
    getStakingRewardRatesV2,
    getProtocolRevenue,
    getProtocolTvl,
    getStakingRevenueShareV2,
    getStakingStatsV2,
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
    try {
      setIsLoading(true)

      // Fetch all data in parallel
      const [userBalance, aggregatedRewards, rewardRates, revenue, tvl, revenueShare] =
        await Promise.all([
          userWalletAddress
            ? getUserBalance({
                userAddress: userWalletAddress as AddressValue,
                chainId: ChainIds.Base,
              })
            : Promise.resolve(0n),
          userWalletAddress
            ? getAggregatedRewardsIncludingMerkl({
                userAddress: userWalletAddress as AddressValue,
                chainId: ChainIds.Base,
              })
            : Promise.resolve({
                total: 0n,
              }),
          getStakingRewardRatesV2({
            sumrPriceUsd,
          }),
          getProtocolRevenue(),
          getProtocolTvl(),
          getStakingRevenueShareV2(),
        ])

      // Process user balance
      const availableSumrValue = new BigNumber(userBalance)
        .shiftedBy(-SUMR_DECIMALS)
        .toFixed(2, BigNumber.ROUND_DOWN)
      const availableSumrUsdValue = new BigNumber(availableSumrValue)
        .times(sumrPriceUsd)
        .toFixed(2, BigNumber.ROUND_DOWN)

      setAvailableSumr(availableSumrValue)
      setAvailableSumrUsd(availableSumrUsdValue)

      // Process claimable rewards
      const claimableSumrValue = new BigNumber(aggregatedRewards.total)
        .shiftedBy(-SUMR_DECIMALS)
        .toFixed(2, BigNumber.ROUND_DOWN)
      const claimableSumrUsdValue = new BigNumber(claimableSumrValue)
        .times(sumrPriceUsd)
        .toFixed(2, BigNumber.ROUND_DOWN)

      setClaimableSumr(claimableSumrValue)
      setClaimableSumrUsd(claimableSumrUsdValue)

      // Process reward rates
      const maxApyValue = formatPercent(new BigNumber(rewardRates.maxApy.value), { precision: 2 })

      setMaxApy(maxApyValue)

      // Calculate max APY USD per year
      const maxApyUsdPerYearValue = new BigNumber(availableSumrUsdValue)
        .times(maxApyValue)
        .dividedBy(100)
        .toFixed(2, BigNumber.ROUND_DOWN)

      setMaxApyUsdPerYear(maxApyUsdPerYearValue)

      // Process SUMR reward APY
      const summerRewardApyValue = formatPercent(
        new BigNumber(rewardRates.summerRewardYield.value),
        {
          precision: 2,
        },
      )

      setSumrRewardApy(summerRewardApyValue)

      // Calculate earnable SUMR per year
      const earnableSumrValue = new BigNumber(availableSumrValue)
        .times(summerRewardApyValue)
        .dividedBy(100)
        .toFixed(2, BigNumber.ROUND_DOWN)

      setEarnableSumr(earnableSumrValue)

      const earnableSumrUsdValue = new BigNumber(earnableSumrValue)
        .times(sumrPriceUsd)
        .toFixed(2, BigNumber.ROUND_DOWN)

      setEarnableSumrUsd(earnableSumrUsdValue)

      setProtocolRevenue(formatCryptoBalance(revenue))

      setProtocolTvl(formatCryptoBalance(tvl))

      // Process revenue share
      setRevenueSharePercentage(revenueShare.percentage.value.toFixed(0))

      setRevenueShareAmount(formatCryptoBalance(new BigNumber(revenueShare.amount)))

      // Fetch public staking data (available to all users)
      setIsLoadingAllStakes(true)
      setIsLoadingBucketInfo(true)

      const [stakingStats, allStakesData, bucketsInfo] = await Promise.all([
        getStakingStatsV2(),
        getStakingStakesV2({}),
        getStakingBucketsInfoV2(),
      ])

      // Process staking stats
      setTotalSumrStaked(new BigNumber(stakingStats.summerStakedNormalized).toNumber())
      setCirculatingSupply(new BigNumber(stakingStats.circulatingSupply).toNumber())

      // Format average lock duration from seconds to seconds (as expected by the component)
      if (stakingStats.averageLockupPeriod) {
        setAverageLockDuration(Number(stakingStats.averageLockupPeriod))
      }

      // Set all stakes
      // const _allEarningsEstimation = await getStakingEarningsEstimationV2({
      // filter first
      // stakes: allStakesData.filter((_, idx) => idx < 10),
      // })

      // setAllEarningsEstimation(_allEarningsEstimation)

      setAllStakes(allStakesData)
      setIsLoadingAllStakes(false)

      // Set bucket info
      setBucketInfo(bucketsInfo)
      setIsLoadingBucketInfo(false)

      // Fetch user-specific staking data if user is connected
      if (userWalletAddress) {
        setIsLoadingStakes(true)

        const user = User.createFromEthereum(ChainIds.Base, userWalletAddress as AddressValue)

        const [userStaked, userStakesData, _userBlendedYieldBoost] = await Promise.all([
          getUserStakingSumrStaked({
            user,
          }),
          getUserStakesV2({
            user,
          }),
          getUserBlendedYieldBoost({
            user,
          }),
        ])

        const [_earningsEstimation, _penaltyCalculationPercentage, _penaltyCalculationAmount] =
          await Promise.all([
            getStakingEarningsEstimationV2({
              stakes: userStakesData.filter((_, idx) => idx < 12),
            }),
            getCalculatePenaltyPercentage({
              userStakes: userStakesData,
            }),
            getCalculatePenaltyAmount({
              userStakes: userStakesData,
            }),
          ])

        setEarningsEstimation(_earningsEstimation)
        setUserBlendedYieldBoost(_userBlendedYieldBoost)

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

        // Process user staked amount
        const stakedSumrValue = new BigNumber(userStaked).shiftedBy(-SUMR_DECIMALS).toNumber()

        setSumrStaked(stakedSumrValue)

        // Set user stakes
        setUserStakes(userStakesData)

        setIsLoadingStakes(false)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch staking data:', error)
      setIsLoadingStakes(false)
      setIsLoadingAllStakes(false)
      setIsLoadingBucketInfo(false)
    } finally {
      setIsLoading(false)
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
    getUserBlendedYieldBoost,
    getStakingStakesV2,
    getStakingBucketsInfoV2,
    getAggregatedRewardsIncludingMerkl,
    getProtocolRevenue,
    getProtocolTvl,
    getStakingRevenueShareV2,
    sumrPriceUsd,
    userWalletAddress,
  ])

  // Fetch all staking data on mount
  useEffect(() => {
    void fetchStakingData()
  }, [fetchStakingData])

  return (
    <>
      <SumrV2PageHeader />
      <div className={sumrV2PageStyles.sumrPageV2Wrapper}>
        <div className={sumrV2PageStyles.twoCardsWrapper}>
          <GradientBox selected style={{ cursor: 'auto' }}>
            <Card className={sumrV2PageStyles.cardCentered} variant="cardSecondary">
              <Text as="p" variant="p3semi">
                SUMR in your wallet and available to stake
              </Text>
              <Text as="h4" variant="h4">
                {isLoading ? (
                  <div className={sumrV2PageStyles.verticalSkeletonLines}>
                    <SkeletonLine width={150} height={32} style={{ marginBottom: '0' }} />
                    <SkeletonLine width={70} height={20} />
                  </div>
                ) : !userWalletAddress ? (
                  '-'
                ) : (
                  <>
                    {formatCryptoBalance(new BigNumber(availableSumr).toNumber())} SUMR
                    <Text as="span" variant="p4semi">
                      ${formatCryptoBalance(new BigNumber(availableSumrUsd).toNumber())}
                    </Text>
                  </>
                )}
              </Text>
              <Link href="/staking/manage" prefetch>
                <Button variant="primarySmall" disabled={isLoading}>
                  Stake your SUMR
                </Button>
              </Link>
            </Card>
          </GradientBox>
          <GradientBox style={{ cursor: 'auto' }}>
            <Card className={sumrV2PageStyles.cardCentered} variant="cardSecondary">
              <Text as="p" variant="p3semi">
                SUMR available to claim
              </Text>
              <Text as="h4" variant="h4">
                {isLoading ? (
                  <div className={sumrV2PageStyles.verticalSkeletonLines}>
                    <SkeletonLine width={150} height={32} style={{ marginBottom: '0' }} />
                    <SkeletonLine width={70} height={20} />
                  </div>
                ) : !userWalletAddress ? (
                  '-'
                ) : (
                  <>
                    {formatCryptoBalance(new BigNumber(claimableSumr).toNumber())} SUMR
                    <Text as="span" variant="p4semi">
                      ${formatCryptoBalance(new BigNumber(claimableSumrUsd).toNumber())}
                    </Text>
                  </>
                )}
              </Text>
              <Link href={`/claim/${userWalletAddress}`} prefetch>
                <Button variant="secondarySmall" disabled={isLoading}>
                  Claim your SUMR
                </Button>
              </Link>
            </Card>
          </GradientBox>
        </div>
        <div className={sumrV2PageStyles.twoCardsWrapper}>
          <Card className={sumrV2PageStyles.cardDataBlock} variant="cardSecondary">
            <DataBlock
              title={
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}
                >
                  <Icon iconName="usdc_circle_color" variant="s" />
                  <Text as="p" variant="p2semi">
                    USDC real yield
                  </Text>
                  <Tooltip
                    tooltip={
                      <Text as="p" variant="p4semi">
                        USDC yield is derived from Lazy Summer Protocol revenues and distributes
                        weekly directly to your wallet
                      </Text>
                    }
                    tooltipWrapperStyles={{ minWidth: '240px' }}
                    tooltipName="sumr-staking-usd-yield-info"
                    onTooltipOpen={tooltipEventHandler}
                  >
                    <Icon iconName="info" variant="s" />
                  </Tooltip>
                </div>
              }
              value={
                isLoading ? (
                  <SkeletonLine
                    width={150}
                    height={28}
                    style={{ marginBottom: '8px', marginTop: '12px' }}
                  />
                ) : (
                  <div className={sumrV2PageStyles.cardDataBlockValue}>
                    <Text variant="h5">up to</Text>&nbsp;
                    <Text variant="h4">{maxApy}</Text>
                  </div>
                )
              }
              valueStyle={{
                color: 'white',
              }}
              subValue={
                isLoading ? (
                  <SkeletonLine width={110} height={20} />
                ) : (
                  `Up to $${formatCryptoBalance(new BigNumber(maxApyUsdPerYear).toNumber())} / Year`
                )
              }
              subValueType="positive"
            />
            <YieldSourceLabel label="Yield source 1" />
          </Card>
          <Card className={sumrV2PageStyles.cardDataBlock} variant="cardSecondary">
            <DataBlock
              title={
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}
                >
                  <Icon iconName="sumr" variant="s" />
                  <Text as="p" variant="p2semi">
                    SUMR Staking APY
                  </Text>
                  <Tooltip
                    tooltip={
                      <Text as="p" variant="p4semi">
                        The % yield you are earning on your SUMR based on your lock duration
                        multiple and SUMR market cap.
                      </Text>
                    }
                    tooltipWrapperStyles={{ minWidth: '240px' }}
                    tooltipName="sumr-staking-apy-info"
                    onTooltipOpen={tooltipEventHandler}
                  >
                    <Icon iconName="info" variant="s" />
                  </Tooltip>
                </div>
              }
              value={
                isLoading ? (
                  <SkeletonLine
                    width={150}
                    height={28}
                    style={{ marginBottom: '8px', marginTop: '12px' }}
                  />
                ) : (
                  <div className={sumrV2PageStyles.cardDataBlockValue}>
                    <Text variant="h5">up to</Text>&nbsp;
                    <Text variant="h4">{sumrRewardApy}</Text>
                  </div>
                )
              }
              valueStyle={{
                color: 'white',
              }}
              subValue={
                isLoading ? (
                  <SkeletonLine width={110} height={20} />
                ) : (
                  `Up to ${formatCryptoBalance(new BigNumber(earnableSumr).toNumber())} SUMR / Year ($${formatCryptoBalance(new BigNumber(earnableSumrUsd).toNumber())})`
                )
              }
              subValueType="positive"
            />
            <YieldSourceLabel label="Yield source 2" />
          </Card>
        </div>
        <div className={sumrV2PageStyles.twoCardsWrapper}>
          <Card className={sumrV2PageStyles.cardDataBlock} variant="cardSecondary">
            <DataBlock
              title={
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}
                >
                  <Text as="p" variant="p2semi">
                    Lazy Summer Annualized Revenue
                  </Text>
                  <Tooltip
                    tooltip={
                      <Text as="p" variant="p4semi">
                        Annualized revenue derived from fees charged to all depositors in the Lazy
                        Summer Protocol
                      </Text>
                    }
                    tooltipWrapperStyles={{ minWidth: '240px' }}
                    tooltipName="sumr-annulized-revenue-info"
                    onTooltipOpen={tooltipEventHandler}
                  >
                    <Icon iconName="info" variant="s" />
                  </Tooltip>
                </div>
              }
              value={
                isLoading ? (
                  <SkeletonLine
                    width={100}
                    height={28}
                    style={{ marginBottom: '8px', marginTop: '12px' }}
                  />
                ) : (
                  <div className={sumrV2PageStyles.cardDataBlockValue}>
                    <Text variant="h4">${protocolRevenue}</Text>
                  </div>
                )
              }
              valueStyle={{
                color: 'white',
              }}
              subValue={
                isLoading ? (
                  <SkeletonLine width={160} height={20} />
                ) : (
                  `$${protocolTvl} Lazy Summer TVL`
                )
              }
            />
          </Card>
          <Card className={sumrV2PageStyles.cardDataBlock} variant="cardSecondary">
            <DataBlock
              title={
                <Text as="p" variant="p2semi">
                  Revenue share paid to Stakers
                </Text>
              }
              value={
                isLoading ? (
                  <SkeletonLine
                    width={60}
                    height={28}
                    style={{ marginBottom: '8px', marginTop: '12px' }}
                  />
                ) : (
                  <div className={sumrV2PageStyles.cardDataBlockValue}>
                    <Text variant="h4">{revenueSharePercentage}%</Text>
                  </div>
                )
              }
              valueStyle={{
                color: 'white',
              }}
              subValue={
                isLoading ? (
                  <SkeletonLine width={90} height={20} />
                ) : (
                  `$${revenueShareAmount} a year`
                )
              }
            />
          </Card>
        </div>
        <FaqSection
          customTitle=""
          wrapperClassName={sumrV2PageStyles.middleFaqSectionWrapper}
          data={[
            {
              title: (
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}
                >
                  <div className={sumrV2PageStyles.tokenPairIcon}>
                    <Icon iconName="sumr" size={20} />
                    <Icon iconName="usdc_circle_color" size={25} />
                  </div>
                  <Text variant="p2semi">How you earn 2 sources of yield USDC and SUMR?</Text>
                </div>
              ),
              content: (
                <div className={sumrV2PageStyles.earn2SourcesOfEarningWrapper}>
                  <Text variant="p2">
                    Stake SUMR to earn boosted rewards, share in protocol revenues, and gain real
                    governance power, all while turning your tokens into a yield bearing asset.
                  </Text>
                  <WithArrow>
                    <Link
                      href="https://blog.summer.fi/lazy-summer-and-sumr-a-protocol-with-a-business-model-not-just-a-token/"
                      target="_blank"
                    >
                      Read the details
                    </Link>
                  </WithArrow>
                  <Image
                    src={lockEarningDiagram}
                    alt="Lock and Earn Diagram"
                    width={0}
                    height={0}
                    quality={95}
                    style={{ width: '100%', height: 'auto', marginTop: 'var(--general-space-8)' }}
                  />
                </div>
              ),
            },
            {
              title: (
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}
                >
                  <Icon iconName="sumr" size={20} />
                  <Text variant="p2semi">What is SUMR Staking?</Text>
                </div>
              ),
              content: (
                <div className={sumrV2PageStyles.whatIsSumrStakingWrapper}>
                  <Text variant="p2">
                    SUMR staking is how your share in the success of the Lazy Summer Protocol. Earn
                    real yield in USDC from a share of the revenue that the protocol makes, while
                    getting governance rights and continued SUMR rewards.
                  </Text>
                  <WithArrow>
                    <Link
                      href="https://blog.summer.fi/introducing-sumr-staking-v2-all-you-need-to-know-about-defis-most-productive-asset/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read the details
                    </Link>
                  </WithArrow>
                  <div className={sumrV2PageStyles.whatIsSumrStakingBlocksWrapper}>
                    <div className={sumrV2PageStyles.whatIsSumrStakingBlock}>
                      <Text variant="h5" className={sumrV2PageStyles.whatIsSumrStakingBlockNumber}>
                        1
                      </Text>
                      <Text variant="p1semi">
                        Earn SUMR and real USDC yield from protocol revenue.
                      </Text>
                    </div>
                    <div className={sumrV2PageStyles.whatIsSumrStakingBlock}>
                      <Text variant="h5" className={sumrV2PageStyles.whatIsSumrStakingBlockNumber}>
                        2
                      </Text>
                      <Text variant="p1semi">Boost your rewards with time bound lockups.</Text>
                    </div>
                    <div className={sumrV2PageStyles.whatIsSumrStakingBlock}>
                      <Text variant="h5" className={sumrV2PageStyles.whatIsSumrStakingBlockNumber}>
                        3
                      </Text>
                      <Text variant="p1semi">
                        Take part in governance and help shape the future of the protocol.
                      </Text>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '24px',
                    }}
                  >
                    {userWalletAddress ? (
                      <Link href="/staking/manage" prefetch>
                        <Button variant="primarySmall">Start staking</Button>
                      </Link>
                    ) : (
                      <WalletLabel
                        buttonVariant="primarySmall"
                        customLoginLabel="Connect your wallet"
                      />
                    )}
                  </div>
                </div>
              ),
            },
          ]}
        />
        {/* <SumrPriceBar /> */}
        <div className={sumrV2PageStyles.stakingTabBarWrapper}>
          <LockedSumrInfoTabBarV2
            stakes={userStakes}
            isLoading={isLoadingStakes}
            userWalletAddress={userWalletAddress}
            refetchStakingData={fetchStakingData}
            penaltyPercentages={penaltyPercentages}
            penaltyAmounts={penaltyAmounts}
            yourEarningsEstimation={earningsEstimation}
            // allEarningsEstimation={allEarningsEstimation}
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
        <FaqSection
          data={[
            {
              title: 'What is SUMR?',
              content: (
                <>
                  SUMR is the governance token of Lazy Summer Protocol. SUMR holders steer the
                  protocol (via Governance V2) and can share in protocol growth through staking
                  rewards and revenue distributions.
                </>
              ),
            },
            {
              title: 'How does SUMR capture value from Lazy Summer?',
              content: (
                <>
                  Lazy Summer charges fees on yield generated in its vaults. A portion of this
                  protocol revenue flows to the treasury, and from there to{' '}
                  <strong>SUMR staker’s</strong> (in USDC LV vault tokens) and ecosystem growth, as
                  decided by governance.
                </>
              ),
            },
            {
              title: 'Do I need SUMR to use Lazy Summer?',
              content: (
                <>
                  No. Anyone can deposit into Lazy Summer vaults without holding SUMR. SUMR is for
                  users who want <strong>governance influence</strong> and{' '}
                  <strong>economic exposure</strong> to protocol growth on top of vault
                  yield.Though, all depositors in Lazy Summer do <strong>earn SUMR.</strong>
                </>
              ),
            },
            {
              title: 'What is SUMR Staking V2?',
              content: (
                <>
                  It’s the upgraded SUMR staking & locking system that powers Governance V2. When
                  you lock SUMR, you get governance power, ongoing SUMR emissions, and a share of
                  protocol revenue paid in USDC (via LV vault tokens).
                </>
              ),
            },
            {
              title: 'What’s new vs Staking V1?',
              content: (
                <>
                  V1 only paid SUMR. V2 adds <strong>dual rewards (SUMR + USDC)</strong>,
                  conviction-weighted locking (longer lock → higher multiplier), capacity buckets
                  per duration, and clear early withdrawal rules.
                </>
              ),
            },
            {
              title: 'Why should I stake SUMR?',
              content: (
                <>
                  Three reasons:
                  <br />
                  <br />
                  1. <strong>Govern</strong> Lazy Summer (curate ARKs, allocate capital, hold
                  contributors accountable)
                  <br />
                  2. <strong>Earn more SUMR</strong> via emissions
                  <br />
                  3. <strong>Share protocol revenue</strong> in auto-compounding USDC LV vault
                  tokens.
                  <br />
                </>
              ),
            },
            {
              title: 'How do rewards work?',
              content: (
                <>
                  You earn:
                  <br />
                  <br />- <strong>SUMR emissions</strong> proportional to your stake and lock
                  multiplier
                  <br />- <strong>USDC yield share</strong> currently 20% of protocol yield flows to
                  lockers as LV vault tokens that keep compounding.
                </>
              ),
            },
            {
              title: 'How does locking & penalties work?',
              content: (
                <>
                  You choose a lock duration from <strong>no lock</strong> up to{' '}
                  <strong>~3 years</strong>. Longer lock = more voting power + higher rewards. You
                  can exit early but pay a <strong>penalty</strong> that decreases linearly as you
                  approach the end of your lock.
                </>
              ),
            },
            {
              title: 'How do I migrate from Staking V1 to V2?',
              content: (
                <>
                  1. Go to <strong>Portfolio → SUMR Rewards / Staking</strong>
                  <br />
                  2. <strong>Unstake</strong> from V1 and <strong>claim</strong> any pending SUMR
                  <br />
                  3. Open <strong>Staking V2</strong>, choose amount + lock duration(s), and confirm
                  the new stake.
                </>
              ),
            },
          ]}
        />
      </div>
    </>
  )
}

export const SumrV2StakingLandingPageView: FC<SumrV2StakingPageViewProps> = () => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <SumrV2StakingLandingPageContent />
    </SDKContextProvider>
  )
}
