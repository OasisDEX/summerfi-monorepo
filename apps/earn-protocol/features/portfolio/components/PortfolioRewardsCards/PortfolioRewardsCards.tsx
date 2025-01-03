'use client'
import { Button, DataModule, Text } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatDecimalAsPercent, formatFiatBalance } from '@summerfi/app-utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { SUMR_CAP } from '@/constants/earn-protocol'
import { useSumrNetApyConfig } from '@/features/nav-config/hooks/useSumrNetApyConfig'

import classNames from './PortfolioRewardsCards.module.scss'

const SumrAvailableToClaim = () => {
  const { walletAddress } = useParams()
  const [sumrNetApyConfig] = useSumrNetApyConfig()
  const assumedSumrPriceRaw = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP
  const rawSumr = 11
  const rawSumrUSD = formatFiatBalance(rawSumr * assumedSumrPriceRaw)
  const sumrAmount = formatCryptoBalance(rawSumr)
  const sumrAmountUSD = formatFiatBalance(rawSumrUSD)

  return (
    <DataModule
      dataBlock={{
        title: '$SUMR available to claim',
        value: sumrAmount,
        subValue: sumrAmountUSD,
        titleSize: 'medium',
        valueSize: 'large',
      }}
      actionable={
        <Link href={`/earn/claim/${walletAddress}`} prefetch>
          <Button variant="primarySmall">Claim</Button>
        </Link>
      }
      gradientBackground
    />
  )
}

const StakedAndDelegatedSumr = () => {
  const rawApy = 0.026
  const rawStaked = 3500

  const value = formatCryptoBalance(rawStaked)
  const apy = formatDecimalAsPercent(rawApy)

  return (
    <DataModule
      dataBlock={{
        title: 'Staked & Delegated $SUMR',
        value,
        subValue: (
          <Text variant="p3semi" style={{ color: 'var(--earn-protocol-success-100)' }}>
            Earning {apy} APY
          </Text>
        ),
        titleSize: 'medium',
        valueSize: 'large',
      }}
      actionable={
        <Link href="/" target="_blank">
          <Text variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            Stake and delegate
          </Text>
        </Link>
      }
    />
  )
}

const YourTotalSumr = () => {
  const [sumrNetApyConfig] = useSumrNetApyConfig()
  const assumedMarketCap = formatCryptoBalance(sumrNetApyConfig.dilutedValuation)

  const assumedSumrPriceRaw = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP
  const assumedSumrPrice = formatFiatBalance(assumedSumrPriceRaw)

  const rawTotalSumr = 0
  const rawTotalSumrUSD = formatFiatBalance(rawTotalSumr * assumedSumrPriceRaw)

  const totalSumr = formatCryptoBalance(rawTotalSumr)
  const totalSumrUSD = formatFiatBalance(rawTotalSumrUSD)

  return (
    <DataModule
      dataBlock={{
        title: 'Your Total $SUMR',
        value: totalSumr,
        subValue: `$${totalSumrUSD}`,
        titleSize: 'medium',
        valueSize: 'large',
      }}
      actionable={
        <Text variant="p3semi" style={{ color: 'var(--earn-protocol-success-100)' }}>
          Assumed Market Cap: {assumedMarketCap}
          <span style={{ color: 'var(--earn-protocol-secondary-60)' }}>
            {' '}
            • 1 $SUMR = ${assumedSumrPrice}
          </span>
        </Text>
      }
    />
  )
}

const YourDelegate = () => {
  const value = 'No delegate'

  return (
    <DataModule
      dataBlock={{
        title: 'Your delegate',
        value,
        titleSize: 'medium',
        valueSize: 'large',
      }}
      actionable={
        <Link href="/" target="_blank">
          <Text variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            Change delegate
          </Text>
        </Link>
      }
    />
  )
}

const YourRays = () => {
  const rawValue = 0

  const value = formatCryptoBalance(rawValue)

  const earnedRaw = 45232
  const earned = formatCryptoBalance(earnedRaw)

  return (
    <DataModule
      dataBlock={{
        title: 'Your season 2 $SUMR',
        value,
        subValue: (
          <Text variant="p3semi" style={{ color: 'var(--earn-protocol-success-100)' }}>
            Rays earned {earned}
            <span style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              {' '}
              • 1 $RAYS = 2.4 $SUMR
            </span>
          </Text>
        ),
        titleSize: 'medium',
        valueSize: 'large',
      }}
      actionable={
        <Link href="https://summer.fi/rays/leaderboard" target="_blank">
          <Text variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            Rays Leaderboard
          </Text>
        </Link>
      }
    />
  )
}

export const PortfolioRewardsCards = () => {
  const hasRays = true

  return (
    <div className={classNames.portfolioRewardsCardsWrapper}>
      {!hasRays ? (
        <div className={classNames.cardWrapper}>
          <YourTotalSumr />
        </div>
      ) : (
        <YourTotalSumr />
      )}
      <div className={classNames.cardWrapper}>
        <SumrAvailableToClaim />
      </div>
      <div className={classNames.cardWrapper}>
        <StakedAndDelegatedSumr />
      </div>
      <div className={classNames.cardWrapper}>
        <YourDelegate />
      </div>
      {hasRays && (
        <div className={classNames.cardWrapper}>
          <YourRays />
        </div>
      )}
    </div>
  )
}
