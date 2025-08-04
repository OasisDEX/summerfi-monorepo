'use client'
import { type Dispatch, type FC } from 'react'
import { useAuthModal } from '@account-kit/react'
import {
  Button,
  DataModule,
  getVotingPowerColor,
  Icon,
  SUMR_CAP,
  Text,
  Tooltip,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import {
  ADDRESS_ZERO,
  formatCryptoBalance,
  formatDecimalAsPercent,
  formatFiatBalance,
  formatShorthandNumber,
} from '@summerfi/app-utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { getDelegateTitle } from '@/features/claim-and-delegate/helpers'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
} from '@/features/claim-and-delegate/types'
import { useSumrNetApyConfig } from '@/features/nav-config/hooks/useSumrNetApyConfig'
import { trackButtonClick } from '@/helpers/mixpanel'

import classNames from './PortfolioRewardsCards.module.css'

interface SumrAvailableToClaimProps {
  rewardsData: ClaimDelegateExternalData
}

const SumrAvailableToClaim: FC<SumrAvailableToClaimProps> = ({ rewardsData }) => {
  const { walletAddress } = useParams()
  const [sumrNetApyConfig] = useSumrNetApyConfig()
  const { openAuthModal } = useAuthModal()
  const assumedSumrPriceRaw = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP
  const rawSumr = Number(rewardsData.sumrToClaim.claimableAggregatedRewards.total)
  const rawSumrUSD = rawSumr * assumedSumrPriceRaw
  const sumrAmount = formatCryptoBalance(rawSumr)
  const sumrAmountUSD = `$${formatFiatBalance(rawSumrUSD)}`

  const { userWalletAddress } = useUserWallet()

  const resolvedWalletAddress = walletAddress as string

  const handleClaimEventButton = () => {
    trackButtonClick({
      id: 'SumrClaimPortfolioButton',
      page: `/portfolio/${resolvedWalletAddress}`,
      userAddress: userWalletAddress,
      totalSumr: sumrAmount,
    })
  }

  const handleConnect = () => {
    if (!userWalletAddress) {
      handleClaimEventButton()
      openAuthModal()
    }
  }

  return (
    <DataModule
      dataBlock={{
        title: (
          <Tooltip
            tooltip={
              <Text as="p" variant="p4semi">
                $SUMR available to claim across all networks. Mainet, Base, and Arbitrum
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
        titleWrapperStyles: {
          whiteSpace: 'unset',
        },
        value: sumrAmount,
        subValue: sumrAmountUSD,
        titleSize: 'medium',
        valueSize: 'large',
      }}
      actionable={
        !userWalletAddress ? (
          <Button variant="primarySmall" onClick={handleConnect}>
            Claim
          </Button>
        ) : (
          <Link href={`/claim/${walletAddress}`} prefetch onClick={handleClaimEventButton}>
            <Button
              variant="primarySmall"
              disabled={
                rawSumr === 0 ||
                userWalletAddress.toLowerCase() !== resolvedWalletAddress.toLowerCase()
              }
            >
              Claim
            </Button>
          </Link>
        )
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
  const resolvedWalletAddress = walletAddress as string
  const { userWalletAddress } = useUserWallet()
  const { openAuthModal } = useAuthModal()
  const rawApy = rewardsData.sumrStakingInfo.sumrStakingApy
  const isDelegated = rewardsData.sumrStakeDelegate.delegatedTo !== ADDRESS_ZERO
  const rawStaked = isDelegated ? rewardsData.sumrStakeDelegate.stakedAmount : '0'
  const rawDecayFactor = rewardsData.sumrStakeDelegate.delegatedToDecayFactor

  const value = formatCryptoBalance(rawStaked)
  const apy = formatDecimalAsPercent(rawApy * rawDecayFactor)

  const handleStakeAndDelegateEventButton = () => {
    trackButtonClick({
      id: 'SumrStakeAndDelegatePortfolioButton',
      page: `/portfolio/${resolvedWalletAddress}`,
      userAddress: userWalletAddress,
      totalSumrStaked: value,
    })
  }

  const handleConnect = () => {
    handleStakeAndDelegateEventButton()
    if (!userWalletAddress) {
      openAuthModal()
    }
  }

  return (
    <DataModule
      dataBlock={{
        title: 'Staked $SUMR',
        value,
        subValue: (
          <Text variant="p3semi" style={{ color: 'var(--earn-protocol-success-100)' }}>
            Earning {apy} APR
          </Text>
        ),
        titleSize: 'medium',
        valueSize: 'large',
      }}
      actionable={
        !userWalletAddress ? (
          <Button variant="unstyled" onClick={handleConnect}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
              Add stake or remove stake
            </Text>
          </Button>
        ) : (
          <Link
            href={`/stake-delegate/${walletAddress}?step=stake`}
            prefetch
            onClick={handleStakeAndDelegateEventButton}
          >
            <Button
              variant="unstyled"
              disabled={userWalletAddress.toLowerCase() !== resolvedWalletAddress.toLowerCase()}
            >
              <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
                Add stake or remove stake
              </Text>
            </Button>
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

  const rawTotalSumr =
    Number(rewardsData.sumrBalances.total) +
    Number(rewardsData.sumrBalances.vested) +
    Number(rewardsData.sumrStakeDelegate.stakedAmount) +
    Number(rewardsData.sumrToClaim.aggregatedRewards.total)

  const rawTotalSumrUSD = rawTotalSumr * assumedSumrPriceRaw

  const totalSumr = formatCryptoBalance(rawTotalSumr)
  const totalSumrUSD = formatFiatBalance(rawTotalSumrUSD)

  return (
    <DataModule
      dataBlock={{
        title: 'Your Total $SUMR (Accrued + Staked + In your wallet)',
        titleWrapperStyles: {
          whiteSpace: 'unset',
        },
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
  state: ClaimDelegateState
}

const YourDelegate: FC<YourDelegateProps> = ({ rewardsData, state }) => {
  const { walletAddress } = useParams()
  const resolvedWalletAddress = walletAddress as string
  const { userWalletAddress } = useUserWallet()
  const { openAuthModal } = useAuthModal()

  const sumrDelegatedTo =
    state.delegatee?.toLowerCase() ?? rewardsData.sumrStakeDelegate.delegatedTo.toLowerCase()

  const rewardsDataDelegatee = rewardsData.tallyDelegates.find(
    (item) => item.userAddress.toLowerCase() === sumrDelegatedTo,
  )

  const resolvedDelegateTitle = getDelegateTitle({
    tallyDelegate: rewardsDataDelegatee,
    currentDelegate: sumrDelegatedTo,
  })

  const value = sumrDelegatedTo === ADDRESS_ZERO ? 'No delegate' : resolvedDelegateTitle

  const votingPower = Number(
    rewardsData.tallyDelegates.find((item) => item.userAddress.toLowerCase() === sumrDelegatedTo)
      ?.votePower ?? 1,
  )

  const subValue =
    sumrDelegatedTo !== ADDRESS_ZERO ? (
      <div className={classNames.votingPower}>
        <Text as="p" variant="p3semi" style={{ color: getVotingPowerColor(votingPower) }}>
          Vote and Reward Power: {formatShorthandNumber(votingPower, { precision: 2 })}
        </Text>
        <Tooltip
          tooltip="Vote and Reward Power reflects a delegates activity within governance. A 1.0 Power will give you full staking rewards. Anything less will reduce your reward amounts."
          tooltipWrapperStyles={{ minWidth: '230px', left: '-200px' }}
        >
          <Icon iconName="info" variant="s" color={getVotingPowerColor(votingPower)} />
        </Tooltip>
      </div>
    ) : (
      'You have not delegated'
    )

  const handleChangeDelegateEventButton = () => {
    trackButtonClick({
      id: 'SumrChangeDelegatePortfolioButton',
      page: `/portfolio/${resolvedWalletAddress}`,
      userAddress: userWalletAddress,
      totalSumrStaked: rewardsData.sumrStakeDelegate.stakedAmount,
    })
  }

  const handleConnect = () => {
    handleChangeDelegateEventButton()
    if (!userWalletAddress) {
      openAuthModal()
    }
  }

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
        !userWalletAddress ? (
          <Button variant="unstyled" onClick={handleConnect}>
            <Text variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
              Change delegate
            </Text>
          </Button>
        ) : (
          <Link
            href={`/stake-delegate/${walletAddress}`}
            prefetch
            onClick={handleChangeDelegateEventButton}
          >
            <Button
              variant="unstyled"
              disabled={userWalletAddress.toLowerCase() !== resolvedWalletAddress.toLowerCase()}
            >
              <Text variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
                Change delegate
              </Text>
            </Button>
          </Link>
        )
      }
    />
  )
}

interface YourRaysProps {
  totalRays: number
}

const YourRays: FC<YourRaysProps> = ({ totalRays }) => {
  const _totalRays = formatCryptoBalance(totalRays)

  return (
    <DataModule
      dataBlock={{
        title: 'Your season 2 $RAYS',
        value: _totalRays,
        titleSize: 'medium',
        valueSize: 'large',
      }}
      actionable={
        <Link href="https://pro.summer.fi/rays/leaderboard" target="_blank">
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
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
}

export const PortfolioRewardsCards: FC<PortfolioRewardsCardsProps> = ({
  rewardsData,
  totalRays,
  state,
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
        <YourDelegate rewardsData={rewardsData} state={state} />
      </div>
      {hasRays && (
        <div className={classNames.cardWrapper}>
          <YourRays totalRays={totalRays} />
        </div>
      )}
    </div>
  )
}
