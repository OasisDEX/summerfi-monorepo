'use client'
import { type Dispatch, type FC } from 'react'
import { useAuthModal } from '@account-kit/react'
import {
  Button,
  DataModule,
  Icon,
  SUMR_CAP,
  Text,
  Tooltip,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import { ADDRESS_ZERO, formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { getDelegateTitle } from '@/features/claim-and-delegate/helpers'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
} from '@/features/claim-and-delegate/types'
import { useSumrNetApyConfig } from '@/features/nav-config/hooks/useSumrNetApyConfig'
import { useHandleButtonClickEvent, useHandleTooltipOpenEvent } from '@/hooks/use-mixpanel-event'

import classNames from './PortfolioRewardsCardsV2.module.css'

interface SumrAvailableToClaimProps {
  rewardsData: ClaimDelegateExternalData
}

interface SumrInOldStakingModuleProps {
  rewardsData: ClaimDelegateExternalData
}

interface YourTotalSumrProps {
  rewardsData: ClaimDelegateExternalData
}

interface YourDelegateProps {
  rewardsData: ClaimDelegateExternalData
  state: ClaimDelegateState
}

interface PortfolioRewardsCardsV2Props {
  rewardsData: ClaimDelegateExternalData
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
}

const SumrAvailableToClaim: FC<SumrAvailableToClaimProps> = ({ rewardsData }) => {
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const tooltipEventHandler = useHandleTooltipOpenEvent()
  const { walletAddress } = useParams()
  const [sumrNetApyConfig] = useSumrNetApyConfig()
  const { openAuthModal } = useAuthModal()
  const assumedSumrPriceRaw = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP
  const rawSumr = Number(rewardsData.sumrToClaim.aggregatedRewards.total)
  const rawSumrUSD = rawSumr * assumedSumrPriceRaw
  const sumrAmount = formatCryptoBalance(rawSumr)
  const sumrAmountUSD = `$${formatFiatBalance(rawSumrUSD)}`

  const { userWalletAddress } = useUserWallet()

  const resolvedWalletAddress = walletAddress as string

  const handleClaimEventButton = () => {
    buttonClickEventHandler(`portfolio-sumr-rewards-claim`)
  }

  const handleConnect = () => {
    buttonClickEventHandler(`portfolio-sumr-rewards-claim-connect`)
    if (!userWalletAddress) {
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
            tooltipName="portfolio-sumr-rewards-total-available-to-claim"
            onTooltipOpen={tooltipEventHandler}
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
            Claim $SUMR
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
              Claim $SUMR
            </Button>
          </Link>
        )
      }
    />
  )
}

const SumrInOldStakingModule: FC<SumrInOldStakingModuleProps> = ({ rewardsData }) => {
  // TODO: this component needs to be updated to allow removing stake from old staking module
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const { walletAddress } = useParams()
  const { userWalletAddress } = useUserWallet()
  const { openAuthModal } = useAuthModal()

  const resolvedWalletAddress = walletAddress as string
  const sumrAvailableToStake = Number(rewardsData.sumrStakeDelegate.stakedAmount)

  const value = `${formatCryptoBalance(sumrAvailableToStake)} SUMR`

  const handleRemoveStakeInOldModule = () => {
    buttonClickEventHandler(`portfolio-sumr-rewards-staked-sumr-add-remove-stake`)
  }

  const handleConnect = () => {
    buttonClickEventHandler(`portfolio-sumr-rewards-staked-sumr-connect`)
    if (!userWalletAddress) {
      openAuthModal()
    }
  }

  return (
    <DataModule
      dataBlock={{
        title: 'SUMR Staked in Old Staking Module',
        value,
        titleSize: 'medium',
        valueSize: 'large',
      }}
      actionable={
        !userWalletAddress ? (
          <Button variant="unstyled" onClick={handleConnect}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
              Remove Old Staked SUMR
            </Text>
          </Button>
        ) : (
          <Link href={`/delegate/${walletAddress}`} prefetch onClick={handleRemoveStakeInOldModule}>
            <Button
              variant="unstyled"
              disabled={userWalletAddress.toLowerCase() !== resolvedWalletAddress.toLowerCase()}
            >
              <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
                Remove Old Staked SUMR
              </Text>
            </Button>
          </Link>
        )
      }
    />
  )
}

const YourTotalSumr: FC<YourTotalSumrProps> = ({ rewardsData }) => {
  const [sumrNetApyConfig] = useSumrNetApyConfig()

  const assumedSumrPriceRaw = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

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
      gradientBackground
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
    />
  )
}

const YourDelegate: FC<YourDelegateProps> = ({ rewardsData, state }) => {
  const buttonClickEventHandler = useHandleButtonClickEvent()
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

  // const votingPower = Number(
  //   rewardsData.tallyDelegates.find((item) => item.userAddress.toLowerCase() === sumrDelegatedTo)
  //     ?.votePower ?? 1,
  // )

  const subValue =
    sumrDelegatedTo !== ADDRESS_ZERO
      ? // <div className={classNames.votingPower}>
        //   <Text as="p" variant="p3semi" style={{ color: getVotingPowerColor(votingPower) }}>
        //     Vote and Reward Power: {formatShorthandNumber(votingPower, { precision: 2 })}
        //   </Text>
        //   <Tooltip
        //     tooltip="Vote and Reward Power reflects a delegates activity within governance. A 1.0 Power will give you full staking rewards. Anything less will reduce your reward amounts."
        //     tooltipWrapperStyles={{ minWidth: '230px', left: '-200px' }}
        //   >
        //     <Icon iconName="info" variant="s" color={getVotingPowerColor(votingPower)} />
        //   </Tooltip>
        // </div>
        null
      : 'You have not delegated'

  const handleChangeDelegateEventButton = () => {
    buttonClickEventHandler(`portfolio-sumr-rewards-change-delegate`)
  }

  const handleConnect = () => {
    buttonClickEventHandler(`portfolio-sumr-rewards-change-delegate-connect`)
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
            href={`/delegate/${walletAddress}`}
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

export const PortfolioRewardsCardsV2: FC<PortfolioRewardsCardsV2Props> = ({
  rewardsData,
  state,
}) => {
  return (
    <div className={classNames.portfolioRewardsCardsWrapper}>
      <div className={classNames.cardWrapper}>
        <YourTotalSumr rewardsData={rewardsData} />
      </div>
      <div className={classNames.cardWrapper}>
        <YourDelegate rewardsData={rewardsData} state={state} />
      </div>
      <div className={classNames.cardWrapper}>
        <SumrAvailableToClaim rewardsData={rewardsData} />
      </div>
      <div className={classNames.cardWrapper}>
        <SumrInOldStakingModule rewardsData={rewardsData} />
      </div>
      {/* <div className={clsx(classNames.cardWrapper, classNames.cardWrapperFullWidth)}>
        <SumrPriceBar />
      </div> */}
    </div>
  )
}
