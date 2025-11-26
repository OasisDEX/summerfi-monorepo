'use client'
import { type FC, useEffect, useMemo, useState } from 'react'
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
  YieldSourceLabel,
} from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { SDKContextProvider } from '@summerfi/sdk-client-react'
import { type AddressValue, ChainIds, getChainInfoByChainId } from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'
import Link from 'next/link'

import { SumrV2PageHeader } from '@/components/layout/SumrV2PageHeader/SumrV2PageHeader'
import { LockedSumrInfoTabBarV2 } from '@/components/molecules/LockedSumrInfoTabBarV2/LockedSumrInfoTabBarV2'
import { SumrPriceBar } from '@/components/molecules/SumrPriceBar/SumrPriceBar'
import { sdkApiUrl } from '@/constants/sdk'
import { SUMR_DECIMALS } from '@/features/bridge/constants/decimals'
import { useSumrNetApyConfig } from '@/features/nav-config/hooks/useSumrNetApyConfig'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useHandleTooltipOpenEvent } from '@/hooks/use-mixpanel-event'

import sumrV2PageStyles from './SumrV2StakingLandingPageView.module.css'

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
  const [summerRewardApy, setSummerRewardApy] = useState<string>('0')
  const [earnableSumr, setEarnableSumr] = useState<string>('0')
  const [earnableSumrUsd, setEarnableSumrUsd] = useState<string>('0')
  const [protocolRevenue, setProtocolRevenue] = useState<string>('0')
  const [protocolTvl, setProtocolTvl] = useState<string>('0')
  const [revenueSharePercentage, setRevenueSharePercentage] = useState<string>('0')
  const [revenueShareAmount, setRevenueShareAmount] = useState<string>('0')

  const {
    getUserBalance,
    getAggregatedRewardsIncludingMerkl,
    getStakingRewardRatesV2,
    getProtocolRevenue,
    getProtocolTvl,
    getStakingRevenueShareV2,
    getSummerToken,
  } = useAppSDK()
  const [sumrNetApyConfig] = useSumrNetApyConfig()
  const sumrPriceUsd = useMemo(
    () => new BigNumber(sumrNetApyConfig.dilutedValuation, 10).dividedBy(1_000_000_000).toNumber(),
    [sumrNetApyConfig.dilutedValuation],
  )

  // Fetch all staking data on mount
  useEffect(() => {
    const fetchStakingData = async () => {
      try {
        setIsLoading(true)

        // Fetch summer token for reward rates
        const summerToken = await getSummerToken({
          chainInfo: getChainInfoByChainId(ChainIds.Base),
        })

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
              rewardTokenAddress: summerToken.address,
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
        const maxApyValue = new BigNumber(rewardRates.maxApy.value).toFixed(2, BigNumber.ROUND_DOWN)

        setMaxApy(maxApyValue)

        // Calculate max APY USD per year
        const maxApyUsdPerYearValue = new BigNumber(availableSumrUsdValue)
          .times(maxApyValue)
          .dividedBy(100)
          .toFixed(2, BigNumber.ROUND_DOWN)

        setMaxApyUsdPerYear(maxApyUsdPerYearValue)

        // Process SUMR reward APY
        const summerRewardApyValue = new BigNumber(rewardRates.summerRewardApy.value).toFixed(
          2,
          BigNumber.ROUND_DOWN,
        )

        setSummerRewardApy(summerRewardApyValue)

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

        // Process protocol revenue
        const revenueFormatted = new BigNumber(revenue)
          .dividedBy(1000000)
          .toFixed(2, BigNumber.ROUND_DOWN)

        setProtocolRevenue(revenueFormatted)

        // Process protocol TVL
        const tvlFormatted = new BigNumber(tvl).dividedBy(1000000).toFixed(0, BigNumber.ROUND_DOWN)

        setProtocolTvl(tvlFormatted)

        // Process revenue share
        setRevenueSharePercentage(revenueShare.percentage.value.toFixed(0))
        const revenueShareAmountFormatted = new BigNumber(revenueShare.amount)
          .dividedBy(1000000)
          .toFixed(2, BigNumber.ROUND_DOWN)

        setRevenueShareAmount(revenueShareAmountFormatted)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch staking data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchStakingData()
  }, [
    userWalletAddress,
    getUserBalance,
    getAggregatedRewardsIncludingMerkl,
    getStakingRewardRatesV2,
    getProtocolRevenue,
    getProtocolTvl,
    getStakingRevenueShareV2,
    getSummerToken,
    sumrPriceUsd,
  ])

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
                  <SkeletonLine width={150} height={32} />
                ) : (
                  <>
                    {formatCryptoBalance(new BigNumber(availableSumr).toNumber())} SUMR
                    <Text as="span" variant="p4semi">
                      ${formatCryptoBalance(new BigNumber(availableSumrUsd).toNumber())}
                    </Text>
                  </>
                )}
              </Text>
              <Button variant="primarySmall">Stake your SUMR</Button>
            </Card>
          </GradientBox>
          <GradientBox style={{ cursor: 'auto' }}>
            <Card className={sumrV2PageStyles.cardCentered} variant="cardSecondary">
              <Text as="p" variant="p3semi">
                SUMR available to claim
              </Text>
              <Text as="h4" variant="h4">
                {isLoading ? (
                  <SkeletonLine width={150} height={32} />
                ) : (
                  <>
                    {formatCryptoBalance(new BigNumber(claimableSumr).toNumber())} SUMR
                    <Text as="span" variant="p4semi">
                      ${formatCryptoBalance(new BigNumber(claimableSumrUsd).toNumber())}
                    </Text>
                  </>
                )}
              </Text>
              <Button variant="secondarySmall">Claim your SUMR</Button>
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
                    SUMR Staking USD Yield
                  </Text>
                  <Tooltip
                    tooltip={
                      <Text as="p" variant="p4semi">
                        $SUMR available to claim across all networks. Mainet, Base, and Arbitrum
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
                  <SkeletonLine width={120} height={32} />
                ) : (
                  <div className={sumrV2PageStyles.cardDataBlockValue}>
                    <Text variant="h5">up to</Text>&nbsp;
                    <Text variant="h4">{maxApy}%</Text>
                  </div>
                )
              }
              valueStyle={{
                color: 'white',
              }}
              subValue={
                isLoading ? (
                  <SkeletonLine width={150} height={16} />
                ) : (
                  `Up to $${formatCryptoBalance(new BigNumber(maxApyUsdPerYear).toNumber())} /Year`
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
                        Huh?
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
                  <SkeletonLine width={120} height={32} />
                ) : (
                  <div className={sumrV2PageStyles.cardDataBlockValue}>
                    <Text variant="h5">up to</Text>&nbsp;
                    <Text variant="h4">{summerRewardApy}%</Text>
                  </div>
                )
              }
              valueStyle={{
                color: 'white',
              }}
              subValue={
                isLoading ? (
                  <SkeletonLine width={200} height={16} />
                ) : (
                  `Up to ${formatCryptoBalance(new BigNumber(earnableSumr).toNumber())} $SUMR /Year ($${formatCryptoBalance(new BigNumber(earnableSumrUsd).toNumber())})`
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
                    Lazy Summer Annulized Revenue
                  </Text>
                  <Tooltip
                    tooltip={
                      <Text as="p" variant="p4semi">
                        Huh?
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
                  <SkeletonLine width={180} height={32} />
                ) : (
                  <div className={sumrV2PageStyles.cardDataBlockValue}>
                    <Text variant="h4">${protocolRevenue}m</Text>
                  </div>
                )
              }
              valueStyle={{
                color: 'white',
              }}
              subValue={
                isLoading ? (
                  <SkeletonLine width={120} height={16} />
                ) : (
                  `${protocolTvl}m Lazy Summer TVL`
                )
              }
            />
            <Link href="Huh?">
              <Button variant="textPrimaryMedium" style={{ paddingTop: '2px' }}>
                Simulate USD yield payoff
              </Button>
            </Link>
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
                  <SkeletonLine width={80} height={32} />
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
                  <SkeletonLine width={100} height={16} />
                ) : (
                  `$${revenueShareAmount}m a year`
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
              content: 'Huh?',
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
              content: 'Huh? Huuuh? Huuuuuh? What? Huh?',
            },
          ]}
        />
        <SumrPriceBar />
        <div className={sumrV2PageStyles.stakingTabBarWrapper}>
          <LockedSumrInfoTabBarV2 />
        </div>
        <FaqSection
          data={[
            {
              title: 'What is the $SUMR token airdrop?',
              content: 'Huh??',
            },
            {
              title: 'Who qualifies for the $SUMR token airdrop? ',
              content: 'Huh?? Huuh??',
            },
            {
              title: 'When will the $SUMR tokens start trading?',
              content: 'Huh?? Huuh?? Huuuh??',
            },
            {
              title: 'Will the conversion rate for $RAYS in Season 2 be the same as Season 1?',
              content: 'Huh?? Huuh?? Huuuh?? What? Huh? Huuh??',
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
