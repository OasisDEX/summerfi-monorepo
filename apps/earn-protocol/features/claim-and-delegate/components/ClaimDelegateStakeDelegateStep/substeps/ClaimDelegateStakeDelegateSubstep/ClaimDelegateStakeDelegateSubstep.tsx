import type { Dispatch, FC } from 'react'
import { Button, Card, DataBlock, Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatDecimalAsPercent, formatFiatBalance } from '@summerfi/app-utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { ClaimDelegateCard } from '@/features/claim-and-delegate/components/ClaimDelegateCard/ClaimDelegateCard'
import { sumrDelegates } from '@/features/claim-and-delegate/consts'
import {
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateTxStatuses,
  type ClamDelegateExternalData,
} from '@/features/claim-and-delegate/types'
import { PortfolioTabs } from '@/features/portfolio/types'

import classNames from './ClaimDelegateStakeDelegateSubstep.module.scss'

interface ClaimDelegateStakeDelegateSubstepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClamDelegateExternalData
}

export const ClaimDelegateStakeDelegateSubstep: FC<ClaimDelegateStakeDelegateSubstepProps> = ({
  state,
  dispatch,
  externalData,
}) => {
  const { walletAddress } = useParams()

  const claimed = formatCryptoBalance(externalData.sumrEarned)
  const claimedInUSD = formatFiatBalance(
    Number(externalData.sumrEarned) * Number(externalData.sumrPrice),
  )

  const apy = formatDecimalAsPercent(externalData.sumrApy)
  const sumrPerYear = `*${formatFiatBalance((Number(externalData.sumrDelegated) + Number(externalData.sumrEarned)) * Number(externalData.sumrApy))} $SUMR / Year`

  const handleStakeAndDelegate = () => {
    dispatch({ type: 'update-delegate-status', payload: ClaimDelegateTxStatuses.COMPLETED })
  }

  return (
    <div className={classNames.claimDelegateStakeDelegateSubstepWrapper}>
      <div className={classNames.leftContent}>
        <Card className={classNames.cardWrapper}>
          <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
            You have claimed
          </Text>
          <div className={classNames.valueWithIcon}>
            <Icon tokenName="SUMR" />
            <Text as="h4" variant="h4">
              {claimed}
            </Text>
          </div>
          <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
            ${claimedInUSD}
          </Text>
        </Card>
        <Text as="p" variant="p2semi" style={{ marginBottom: 'var(--general-space-4)' }}>
          Lazy Summer Governance Objectives
        </Text>
        <Text
          as="p"
          variant="p3"
          style={{
            color: 'var(--earn-protocol-secondary-40)',
            marginBottom: 'var(--general-space-4)',
          }}
        >
          Every delegate declares their governance objectives.
        </Text>
        <Link href="/" target="_blank">
          <WithArrow as="p" variant="p3">
            Learn more about Governance
          </WithArrow>
        </Link>
        <div className={classNames.spacer} />
        <DataBlock
          title="Staking Rewards"
          titleStyle={{
            color: 'var(--earn-protocol-secondary-100)',
            marginBottom: 'var(--general-space-8)',
          }}
          titleSize="medium"
          value={apy}
          valueStyle={{
            color: 'var(--earn-protocol-success-100)',
            marginBottom: 'var(--general-space-8)',
          }}
          valueSize="small"
          subValue={sumrPerYear}
          subValueStyle={{
            color: 'var(--earn-protocol-primary-100)',
            marginBottom: 'var(--general-space-8)',
          }}
        />
        <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          Earn $SUMR rewards for staking and delegating your tokens.
        </Text>
      </div>
      <div className={classNames.rightContent}>
        {sumrDelegates.map((delegate) => (
          <ClaimDelegateCard
            key={delegate.title}
            {...delegate}
            isActive={state.delegatee === delegate.address}
            handleClick={() => dispatch({ type: 'update-delegatee', payload: delegate.address })}
          />
        ))}
        <div className={classNames.buttonsWrapper}>
          <Link href={`/earn/portfolio/${walletAddress}?tab=${PortfolioTabs.REWARDS}`}>
            <Button variant="secondarySmall">
              <Text variant="p3semi" as="p">
                Claim & Forfeit staking yield
              </Text>
            </Button>
          </Link>
          <Button
            variant="primarySmall"
            style={{ paddingRight: 'var(--general-space-32)' }}
            onClick={handleStakeAndDelegate}
            disabled={!state.delegatee}
          >
            <WithArrow
              style={{ color: 'var(--earn-protocol-secondary-100)' }}
              variant="p3semi"
              as="p"
            >
              Stake & Delegate
            </WithArrow>
          </Button>
        </div>
      </div>
    </div>
  )
}
