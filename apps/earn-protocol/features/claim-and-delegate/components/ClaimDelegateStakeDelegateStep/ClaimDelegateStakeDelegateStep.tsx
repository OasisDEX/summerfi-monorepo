import type { Dispatch, FC } from 'react'
import { Button, Card, DataBlock, Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatDecimalAsPercent, formatFiatBalance } from '@summerfi/app-utils'
import Link from 'next/link'

import type {
  ClaimDelegateReducerAction,
  ClaimDelegateState,
} from '@/features/claim-and-delegate/types'

import classNames from './ClaimDelegateStakeDelegateStep.module.scss'

interface ClaimDelegateStakeDelegateStepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
}

export const ClaimDelegateStakeDelegateStep: FC<ClaimDelegateStakeDelegateStepProps> = () => {
  const claimed = formatCryptoBalance(123)
  const claimedInUSD = formatFiatBalance(123)

  const apy = formatDecimalAsPercent(0.032)
  const sumrPerYear = '*11,032 $SUMR / Year'

  const handleStakeAndDelegate = () => {}

  const handleClaimAndForfeit = () => {}

  return (
    <div className={classNames.claimDelegateStakeDelegateStepWrapper}>
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
        ClaimDelegateStakeDelegateStep
        <div className={classNames.buttonsWrapper}>
          <Button variant="secondarySmall" onClick={handleClaimAndForfeit}>
            <Text variant="p3semi" as="p">
              Claim & Forfeit staking yield
            </Text>
          </Button>
          <Button
            variant="primarySmall"
            style={{ paddingRight: 'var(--general-space-32)' }}
            onClick={handleStakeAndDelegate}
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
