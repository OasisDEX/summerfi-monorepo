'use client'
import { type FC } from 'react'
import { useChain } from '@account-kit/react'
import {
  Button,
  DataModule,
  Icon,
  RAYS_TO_SUMR_CONVERSION_RATE,
  SUMR_CAP,
  Text,
  Tooltip,
} from '@summerfi/app-earn-ui'
import { SDKChainId } from '@summerfi/app-types'
import {
  ADDRESS_ZERO,
  formatCryptoBalance,
  formatDecimalAsPercent,
  formatFiatBalance,
} from '@summerfi/app-utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { SDKChainIdToAAChainMap } from '@/account-kit/config'
import { localSumrDelegates } from '@/features/claim-and-delegate/consts'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { useSumrNetApyConfig } from '@/features/nav-config/hooks/useSumrNetApyConfig'
import { useClientChainId } from '@/hooks/use-client-chain-id'

import classNames from './PortfolioRewardsCards.module.scss'

interface SumrAvailableToClaimProps {
  rewardsData: ClaimDelegateExternalData
}

const SumrAvailableToClaim: FC<SumrAvailableToClaimProps> = ({ rewardsData }) => {
  const { walletAddress } = useParams()
  const [sumrNetApyConfig] = useSumrNetApyConfig()
  const assumedSumrPriceRaw = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP
  const rawSumr = Number(rewardsData.sumrToClaim.total)
  const rawSumrUSD = formatFiatBalance(rawSumr * assumedSumrPriceRaw)
  const sumrAmount = formatCryptoBalance(rawSumr)
  const sumrAmountUSD = `$${formatFiatBalance(rawSumrUSD)}`

  return (
    <DataModule
      dataBlock={{
        title: (
          <Tooltip
            tooltip={
              <Text as="p" variant="p4semi">
                SUMR available to claim across all networks. Mainet, Base, and Optimism
              </Text>
            }
            tooltipWrapperStyles={{ minWidth: '240px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
              <Icon iconName="info" variant="s" />
              <Text as="p" variant="p2semi">
                Total $SUMR available to claim
              </Text>
            </div>
          </Tooltip>
        ),
        value: sumrAmount,
        subValue: sumrAmountUSD,
        titleSize: 'medium',
        valueSize: 'large',
      }}
      actionable={
        <Link href={`/claim/${walletAddress}`} prefetch>
          <Button variant="primarySmall">Claim</Button>
        </Link>
      }
      gradientBackground
    />
  )
}

interface StakedAndDelegatedSumrProps {
  rewardsData: ClaimDelegateExternalData
}

const StakedAndDelegatedSumr: FC<StakedAndDelegatedSumrProps> = ({ rewardsData }) => {
  const { walletAddress } = useParams()
  const { setChain } = useChain()
  const { clientChainId } = useClientChainId()

  const rawApy = rewardsData.sumrStakingInfo.sumrStakingApy
  const isDelegated = rewardsData.sumrStakeDelegate.delegatedTo !== ADDRESS_ZERO
  const rawStakedAndDelegated = isDelegated ? rewardsData.sumrStakeDelegate.sumrDelegated : '0'
  const rawDecayFactor = rewardsData.sumrStakeDelegate.delegatedToDecayFactor

  const value = formatCryptoBalance(rawStakedAndDelegated)
  const apy = formatDecimalAsPercent(rawApy * rawDecayFactor)

  const handleRemoveDelegation = () => {
    // delegation is only supported on base
    if (clientChainId !== SDKChainId.BASE) {
      // eslint-disable-next-line no-console
      console.log('update network to base')
      setChain({ chain: SDKChainIdToAAChainMap[SDKChainId.BASE] })
    }

    // TODO: Implement remove delegation
    // eslint-disable-next-line no-console
    console.log('remove delegation clicked')
  }

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
        isDelegated ? (
          <Button variant="unstyled" onClick={handleRemoveDelegation}>
            <Text variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
              Remove delegate
            </Text>
          </Button>
        ) : (
          <Link href={`/stake-delegate/${walletAddress}`} prefetch>
            <Text variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
              Stake and delegate
            </Text>
          </Link>
        )
      }
    />
  )
}

interface YourTotalSumrProps {
  rewardsData: ClaimDelegateExternalData
}

const YourTotalSumr: FC<YourTotalSumrProps> = ({ rewardsData }) => {
  const [sumrNetApyConfig] = useSumrNetApyConfig()
  const assumedMarketCap = formatCryptoBalance(sumrNetApyConfig.dilutedValuation)

  const assumedSumrPriceRaw = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP
  const assumedSumrPrice = formatFiatBalance(assumedSumrPriceRaw)

  const rawTotalSumr = Number(rewardsData.sumrBalances.total)
  const rawTotalSumrUSD = rawTotalSumr * assumedSumrPriceRaw

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

interface YourDelegateProps {
  rewardsData: ClaimDelegateExternalData
}

const YourDelegate: FC<YourDelegateProps> = ({ rewardsData }) => {
  const { walletAddress } = useParams()

  const delegatee = localSumrDelegates.find(
    (item) =>
      item.address?.toLowerCase() === rewardsData.sumrStakeDelegate.sumrDelegated.toLowerCase(),
  )

  const value = delegatee ? delegatee.title : 'No delegate'
  const subValue = delegatee ? '' : 'You have not delegated'

  return (
    <DataModule
      dataBlock={{
        title: 'Your delegate',
        value,
        titleSize: 'medium',
        valueSize: 'large',
        subValue,
      }}
      actionable={
        <Link href={`/stake-delegate/${walletAddress}`} prefetch>
          <Text variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            Change delegate
          </Text>
        </Link>
      }
    />
  )
}

interface YourRaysProps {
  totalRays: number
}

const YourRays: FC<YourRaysProps> = ({ totalRays }) => {
  const rawValue = RAYS_TO_SUMR_CONVERSION_RATE * totalRays
  const value = formatCryptoBalance(rawValue)

  const _totalRays = formatCryptoBalance(totalRays)

  return (
    <DataModule
      dataBlock={{
        title: 'Your season 1 $SUMR',
        value,
        subValue: (
          <Text variant="p3semi" style={{ color: 'var(--earn-protocol-success-100)' }}>
            Rays earned {_totalRays}
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

interface PortfolioRewardsCardsProps {
  rewardsData: ClaimDelegateExternalData
  totalRays: number
}

export const PortfolioRewardsCards: FC<PortfolioRewardsCardsProps> = ({
  rewardsData,
  totalRays,
}) => {
  const hasRays = totalRays > 0

  return (
    <div className={classNames.portfolioRewardsCardsWrapper}>
      {!hasRays ? (
        <div className={classNames.cardWrapper}>
          <YourTotalSumr rewardsData={rewardsData} />
        </div>
      ) : (
        <YourTotalSumr rewardsData={rewardsData} />
      )}
      <div className={classNames.cardWrapper}>
        <SumrAvailableToClaim rewardsData={rewardsData} />
      </div>
      <div className={classNames.cardWrapper}>
        <StakedAndDelegatedSumr rewardsData={rewardsData} />
      </div>
      <div className={classNames.cardWrapper}>
        <YourDelegate rewardsData={rewardsData} />
      </div>
      {hasRays && (
        <div className={classNames.cardWrapper}>
          <YourRays totalRays={totalRays} />
        </div>
      )}
    </div>
  )
}
