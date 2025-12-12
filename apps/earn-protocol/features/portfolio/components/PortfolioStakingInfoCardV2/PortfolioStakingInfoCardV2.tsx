import {
  Button,
  Card,
  DataBlock,
  DataModule,
  Icon,
  LoadingSpinner,
  Text,
  Tooltip,
  WithArrow,
  YieldSourceLabel,
} from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'
import clsx from 'clsx'
import dayjs from 'dayjs'
import Link from 'next/link'

import portfolioStakingInfoCardStyles from './PortfolioStakingInfoCardV2.module.css'

const StakingInfoCards = () => {
  return (
    <>
      <div className={portfolioStakingInfoCardStyles.whyStakeSumrBlock}>
        <Icon iconName="earn_user_activities" size={20} />
        <div className={portfolioStakingInfoCardStyles.whyStakeSumrBlockDescription}>
          <Text as="p" variant="p2semi">
            Boosted, multi asset rewards
          </Text>
          <Text as="p" variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
            Maximize your earnings with both USDC yield and SUMR rewards.
          </Text>
        </div>
      </div>
      <div className={portfolioStakingInfoCardStyles.whyStakeSumrBlock}>
        <Icon iconName="earn_user_activities" size={20} />
        <div className={portfolioStakingInfoCardStyles.whyStakeSumrBlockDescription}>
          <Text as="p" variant="p2semi">
            Genuine revenue, real yield.
          </Text>
          <Text as="p" variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
            Protocol revenue flows seamlessly to SUMR stakers.
          </Text>
        </div>
      </div>
      <div className={portfolioStakingInfoCardStyles.whyStakeSumrBlock}>
        <Icon iconName="earn_user_activities" size={20} />
        <div className={portfolioStakingInfoCardStyles.whyStakeSumrBlockDescription}>
          <Text as="p" variant="p2semi">
            Weekly rewards payout
          </Text>
          <Text as="p" variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
            Automated rewards distribution for hassle-free, consistent earning.
          </Text>
        </div>
      </div>
    </>
  )
}

const StartStakingSumrCard = () => {
  return (
    <Card
      className={clsx(
        portfolioStakingInfoCardStyles.titleDataLinkColumn,
        portfolioStakingInfoCardStyles.lighterCardGradient,
      )}
    >
      <div className={portfolioStakingInfoCardStyles.whyStakeSumrDescription}>
        <Text as="p" variant="h5">
          Why stake your SUMR?
        </Text>
        <Text
          as="p"
          variant="p2"
          style={{ color: 'var(--color-text-secondary)', margin: '4px 0 8px 0' }}
        >
          Stake SUMR to earn boosted rewards, share in protocol revenues, and gain real governance
          power, all while turning your tokens into a yield-bearing asset.
        </Text>
        <WithArrow>
          <Link href="/staking" prefetch>
            <Text as="span" variant="p4semi">
              Read more about SUMR staking
            </Text>
          </Link>
        </WithArrow>
      </div>
      <div className={portfolioStakingInfoCardStyles.whyStakeSumrBlocks}>
        <StakingInfoCards />
      </div>
    </Card>
  )
}

const AlreadyStakingSumrCard = ({
  sumrAvailableToStake,
  sumrPrice,
}: {
  sumrAvailableToStake: number
  sumrPrice: number
}) => {
  return (
    <Card
      className={clsx(
        portfolioStakingInfoCardStyles.halfCardsRow,
        portfolioStakingInfoCardStyles.lighterCardGradient,
      )}
    >
      <div className={portfolioStakingInfoCardStyles.sumrAvailableToStakeBigBlock}>
        <Text as="span" variant="p3semi">
          SUMR available to stake
        </Text>
        <Text as="h4" variant="h4">
          {formatCryptoBalance(sumrAvailableToStake)} SUMR
          <Text as="p" variant="p2semi">
            ${formatCryptoBalance(sumrAvailableToStake * sumrPrice)}
          </Text>
        </Text>
        <Link href="/staking/manage" prefetch>
          <Button variant="primarySmall">Stake</Button>
        </Link>
      </div>
      <div className={portfolioStakingInfoCardStyles.whyStakeSumrColumnBlocks}>
        <StakingInfoCards />
      </div>
    </Card>
  )
}

export const PortfolioStakingInfoCardV2 = ({
  sumrUserData,
  sumrPrice,
  sumrRewardApy,
  sumrRewardAmount,
  usdcEarnedOnSumr,
  usdcEarnedOnSumrAmount,
  stats,
  userUsdcRealYield,
  isLoading,
}: {
  sumrUserData: {
    sumrAvailableToStake: number
    sumrStaked: number
  }
  stats: {
    totalSumrStaked: number
    circulatingSupply: number
    percentStaked: number
    averageLockDuration: number // my idea is - this is in seconds so we can format it to days/weeks/months/years
  }
  sumrPrice: number
  sumrRewardApy: number
  sumrRewardAmount: number
  usdcEarnedOnSumr: number
  usdcEarnedOnSumrAmount: number
  sumrPriceUsd: number
  userUsdcRealYield: number
  isLoading?: boolean
}) => {
  return (
    <Card
      variant="cardGradientDark"
      className={portfolioStakingInfoCardStyles.portfolioStakingInfoCardWrapper}
    >
      {isLoading && (
        <div className={portfolioStakingInfoCardStyles.loadingOverlay}>
          <LoadingSpinner size={48} />
        </div>
      )}
      <div className={portfolioStakingInfoCardStyles.header}>
        <Icon iconName="sumr" size={32} />
        <Text variant="h5">
          {formatCryptoBalance(sumrUserData.sumrAvailableToStake)} SUMR available to stake. In
          addition, earn up to {formatDecimalAsPercent(usdcEarnedOnSumr / 100)} USDC yield on your
          SUMR.
        </Text>
      </div>
      <div className={portfolioStakingInfoCardStyles.yieldSourcesWrapper}>
        <div className={portfolioStakingInfoCardStyles.yieldSourceCard}>
          {sumrUserData.sumrStaked > 0 ? (
            <DataModule
              dataBlock={{
                title: 'SUMR staked',
                value: `${formatCryptoBalance(sumrUserData.sumrStaked)} SUMR`,
                subValue: `$${formatCryptoBalance(sumrUserData.sumrStaked * sumrPrice)}`,
              }}
              actionable={
                <Link href="/staking/manage" prefetch>
                  <Button variant="textPrimarySmall">View SUMR staking details</Button>
                </Link>
              }
              cardClassName={portfolioStakingInfoCardStyles.lighterCardGradient}
            />
          ) : (
            <DataModule
              dataBlock={{
                title: 'SUMR to stake',
                value: `${formatCryptoBalance(sumrUserData.sumrAvailableToStake)} SUMR`,
                subValue: `$${formatCryptoBalance(sumrUserData.sumrAvailableToStake * sumrPrice)}`,
              }}
              actionable={
                <Link href="/staking/manage" prefetch>
                  <Button variant="primarySmall">Stake</Button>
                </Link>
              }
              cardClassName={portfolioStakingInfoCardStyles.lighterCardGradient}
            />
          )}
        </div>
        <div className={portfolioStakingInfoCardStyles.yieldSourceCard}>
          <YieldSourceLabel label="Yield source 1" />
          <DataModule
            dataBlock={{
              title: (
                <div className={portfolioStakingInfoCardStyles.yieldSourceTitleWithIcon}>
                  <Icon iconName="usdc_circle_color" size={24} />
                  <span>USDC Real Yield</span>
                  <Tooltip
                    tooltip={
                      <Text as="p" variant="p4semi">
                        USDC yield is derived from Lazy Summer Protocol revenues and distrbutes
                        monthly
                      </Text>
                    }
                    showAbove
                    tooltipWrapperStyles={{
                      minWidth: '240px',
                    }}
                  >
                    <Icon iconName="info" size={18} />
                  </Tooltip>
                </div>
              ),
              value:
                sumrUserData.sumrStaked > 0
                  ? formatDecimalAsPercent(userUsdcRealYield, { precision: 2 })
                  : `Up to ${formatDecimalAsPercent(usdcEarnedOnSumr / 100, { precision: 2 })}`,
              subValue:
                sumrUserData.sumrStaked > 0
                  ? `$${formatCryptoBalance(usdcEarnedOnSumrAmount)} / Year`
                  : usdcEarnedOnSumrAmount === 0
                    ? '-'
                    : `$${formatCryptoBalance(usdcEarnedOnSumrAmount)} / Year`,
              subValueType: 'positive',
            }}
            cardClassName={portfolioStakingInfoCardStyles.lighterCardGradient}
          />
        </div>
        <div className={portfolioStakingInfoCardStyles.yieldSourceCard}>
          <YieldSourceLabel label="Yield source 2" />
          <DataModule
            dataBlock={{
              title: (
                <div className={portfolioStakingInfoCardStyles.yieldSourceTitleWithIcon}>
                  <Icon iconName="sumr" size={20} />
                  <span>SUMR Staking APY</span>
                  <Tooltip
                    tooltip={
                      <Text as="p" variant="p4semi">
                        The % yield you are earning on your SUMR based on your lock duration
                        multiple and SUMR market cap.
                      </Text>
                    }
                    showAbove
                    tooltipWrapperStyles={{
                      minWidth: '240px',
                    }}
                  >
                    <Icon iconName="info" size={18} />
                  </Tooltip>
                </div>
              ),
              value:
                sumrRewardApy === 0 ? '-' : `Up to ${formatDecimalAsPercent(sumrRewardApy / 100)}`,
              subValue:
                sumrRewardAmount === 0
                  ? '-'
                  : `+${formatCryptoBalance(sumrRewardAmount)} SUMR / Year`,
              subValueType: 'positive',
            }}
            cardClassName={portfolioStakingInfoCardStyles.lighterCardGradient}
          />
        </div>
      </div>
      {sumrUserData.sumrStaked === 0 ? (
        <StartStakingSumrCard />
      ) : (
        <AlreadyStakingSumrCard
          sumrAvailableToStake={sumrUserData.sumrAvailableToStake}
          sumrPrice={sumrPrice}
        />
      )}
      <Card
        className={clsx(
          portfolioStakingInfoCardStyles.titleDataLinkColumn,
          portfolioStakingInfoCardStyles.lighterCardGradient,
        )}
      >
        <Text as="p" variant="p2semi">
          Key SUMR Staking stats
        </Text>
        <div className={portfolioStakingInfoCardStyles.stakingStatsWrapper}>
          <DataBlock
            title="Total SUMR staked"
            size="xsmall"
            value={`${formatCryptoBalance(stats.totalSumrStaked)} SUMR`}
            valueSize="medium"
            valueStyle={{
              color: 'var(--color-text-primary)',
            }}
            wrapperClassName={portfolioStakingInfoCardStyles.stakingStatsBlock}
          />
          <DataBlock
            title="Total circulating SUMR supply"
            size="xsmall"
            value={`${formatCryptoBalance(stats.circulatingSupply)} SUMR`}
            valueSize="medium"
            valueStyle={{
              color: 'var(--color-text-primary)',
            }}
            wrapperClassName={portfolioStakingInfoCardStyles.stakingStatsBlock}
          />
          <DataBlock
            title="% of circulating SUMR staked"
            size="xsmall"
            value={formatDecimalAsPercent(stats.percentStaked)}
            valueSize="medium"
            valueStyle={{
              color: 'var(--color-text-primary)',
            }}
            wrapperClassName={portfolioStakingInfoCardStyles.stakingStatsBlock}
          />
          <DataBlock
            title="Average SUMR lock duration"
            size="xsmall"
            value={`${dayjs(stats.averageLockDuration * 1000).diff(dayjs(0), 'days')} days`}
            valueSize="medium"
            valueStyle={{
              color: 'var(--color-text-primary)',
            }}
            wrapperClassName={portfolioStakingInfoCardStyles.stakingStatsBlock}
          />
        </div>
      </Card>
    </Card>
  )
}
