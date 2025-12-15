'use client'
import { type FC, useCallback, useEffect, useState } from 'react'
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
import { formatCryptoBalance } from '@summerfi/app-utils'
import { SDKContextProvider } from '@summerfi/sdk-client-react'
import { BigNumber } from 'bignumber.js'
import Image from 'next/image'
import Link from 'next/link'

import {
  type LandingPageStakingV2Data,
  type LandingPageStakingV2UserData,
} from '@/app/server-handlers/raw-calls/sumr-staking-v2/types'
import { SumrV2PageHeader } from '@/components/layout/SumrV2PageHeader/SumrV2PageHeader'
import { LockedSumrInfoTabBarV2 } from '@/components/molecules/LockedSumrInfoTabBarV2/LockedSumrInfoTabBarV2'
import WalletLabel from '@/components/molecules/WalletLabel/WalletLabel'
import { sdkApiUrl } from '@/constants/sdk'
import { useHandleTooltipOpenEvent } from '@/hooks/use-mixpanel-event'

import sumrV2PageStyles from './SumrV2StakingLandingPageView.module.css'

import lockEarningDiagram from '@/public/img/sumr/lock_earn_diagram.png'

interface SumrV2StakingPageViewProps {
  sumrStakingV2LandingPageData: LandingPageStakingV2Data
}

const SumrV2StakingLandingPageContent: FC<SumrV2StakingPageViewProps> = ({
  sumrStakingV2LandingPageData,
}) => {
  const tooltipEventHandler = useHandleTooltipOpenEvent()
  const { userWalletAddress } = useUserWallet()

  const {
    maxApy,
    sumrRewardApy,
    protocolRevenue,
    protocolTvl,
    revenueSharePercentage,
    revenueShareAmount,
    totalSumrStaked,
    circulatingSupply,
    averageLockDuration,
    allStakes,
    bucketInfo,
  } = sumrStakingV2LandingPageData

  // State for fetched data
  const [isLoading, setIsLoading] = useState(true)
  const [userStakingData, setUserStakingData] = useState<LandingPageStakingV2UserData | undefined>()

  const fetchUserStakingData = useCallback(async () => {
    if (!userWalletAddress) {
      setIsLoading(false)

      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(
        `/earn/api/staking-v2/user-info/${encodeURIComponent(userWalletAddress)}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch staking data')
      }

      const { userInfo } = (await response.json()) as {
        userInfo: LandingPageStakingV2UserData
      }

      setUserStakingData(userInfo)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch staking data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [userWalletAddress])

  // Fetch all staking data on mount
  useEffect(() => {
    void fetchUserStakingData()
  }, [fetchUserStakingData])

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
                {isLoading || !userStakingData ? (
                  <div className={sumrV2PageStyles.verticalSkeletonLines}>
                    <SkeletonLine width={150} height={32} style={{ marginBottom: '0' }} />
                    <SkeletonLine width={70} height={20} />
                  </div>
                ) : (
                  <>
                    {formatCryptoBalance(new BigNumber(userStakingData.availableSumr).toNumber())}{' '}
                    SUMR
                    <Text as="span" variant="p4semi">
                      $
                      {formatCryptoBalance(
                        new BigNumber(userStakingData.availableSumrUsd).toNumber(),
                      )}
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
                {isLoading || !userStakingData ? (
                  <div className={sumrV2PageStyles.verticalSkeletonLines}>
                    <SkeletonLine width={150} height={32} style={{ marginBottom: '0' }} />
                    <SkeletonLine width={70} height={20} />
                  </div>
                ) : (
                  <>
                    {formatCryptoBalance(new BigNumber(userStakingData.claimableSumr).toNumber())}{' '}
                    SUMR
                    <Text as="span" variant="p4semi">
                      $
                      {formatCryptoBalance(
                        new BigNumber(userStakingData.claimableSumrUsd).toNumber(),
                      )}
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
                        USDC yield is derived from Lazy Summer Protocol revenues and distrbutes
                        monthly
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
                <div className={sumrV2PageStyles.cardDataBlockValue}>
                  <Text variant="h5">up to</Text>&nbsp;
                  <Text variant="h4">{maxApy}%</Text>
                </div>
              }
              valueStyle={{
                color: 'white',
              }}
              subValue={
                isLoading || !userStakingData ? (
                  <SkeletonLine width={110} height={20} />
                ) : parseFloat(userStakingData.usdcEarnedOnSumrAmount) > 0 ? (
                  `Up to $${formatCryptoBalance(new BigNumber(userStakingData.usdcEarnedOnSumrAmount).toNumber())} / Year`
                ) : null
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
                <div className={sumrV2PageStyles.cardDataBlockValue}>
                  <Text variant="h5">up to</Text>&nbsp;
                  <Text variant="h4">{sumrRewardApy}%</Text>
                </div>
              }
              valueStyle={{
                color: 'white',
              }}
              // subValue={
              //   isLoading ? (
              //     <SkeletonLine width={110} height={20} />
              //   ) : (
              //     `Up to ${formatCryptoBalance(new BigNumber(earnableSumr).toNumber())} SUMR / Year ($${formatCryptoBalance(new BigNumber(earnableSumrUsd).toNumber())})`
              //   )
              // }
              // subValueType="positive"
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
                <div className={sumrV2PageStyles.cardDataBlockValue}>
                  <Text variant="h4">${formatCryptoBalance(protocolRevenue)}</Text>
                </div>
              }
              valueStyle={{
                color: 'white',
              }}
              subValue={`$${formatCryptoBalance(protocolTvl)} Lazy Summer TVL`}
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
                <div className={sumrV2PageStyles.cardDataBlockValue}>
                  <Text variant="h4">{revenueSharePercentage}%</Text>
                </div>
              }
              valueStyle={{
                color: 'white',
              }}
              subValue={`$${formatCryptoBalance(revenueShareAmount)} a year`}
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
          {userStakingData && (
            <LockedSumrInfoTabBarV2
              bucketInfo={bucketInfo}
              allStakes={allStakes}
              isLoading={isLoading}
              userWalletAddress={userWalletAddress}
              refetchStakingData={fetchUserStakingData}
              penaltyPercentages={userStakingData.penaltyPercentages}
              userBlendedYieldBoost={userStakingData.userBlendedYieldBoost}
              userSumrStaked={userStakingData.sumrStaked}
              penaltyAmounts={userStakingData.penaltyAmounts}
              yourEarningsEstimation={userStakingData.earningsEstimation}
              stakes={userStakingData.userStakes}
              totalSumrStaked={totalSumrStaked}
              averageLockDuration={averageLockDuration}
              circulatingSupply={circulatingSupply}
            />
          )}
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

export const SumrV2StakingLandingPageView: FC<SumrV2StakingPageViewProps> = ({
  sumrStakingV2LandingPageData,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <SumrV2StakingLandingPageContent
        sumrStakingV2LandingPageData={sumrStakingV2LandingPageData}
      />
    </SDKContextProvider>
  )
}
