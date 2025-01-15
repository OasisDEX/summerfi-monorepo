'use client'
import { type FC, type ReactNode } from 'react'
import { Button, Card, MarketingPointsList, Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import {
  sumrGovernLazySummerData,
  sumrStakeToDelegate,
} from '@/features/sumr-claim/components/SumrGovernance/const'
import { SumrGovernanceList } from '@/features/sumr-claim/components/SumrGovernanceList/SumrGovernanceList'
import { SumrOwnership } from '@/features/sumr-claim/components/SumrOwnership/SumrOwnership'
import { SumrSupplySchedule } from '@/features/sumr-claim/components/SumrSupplySchedule/SumrSupplySchedule'

import classNames from './SumrGovernance.module.scss'

interface SumrGovernanceContentProps {
  children: ReactNode
  header?: string
  description?: string
  button: {
    label: string
    action: () => void
  }
  link: {
    label: string
    href: string
  }
}

const SumrGovernanceContent: FC<SumrGovernanceContentProps> = ({
  children,
  header,
  description,
  button,
  link,
}) => {
  return (
    <div className={classNames.sumrGovernanceContent}>
      {header && (
        <Text
          as="h3"
          variant="h3"
          style={{
            marginBottom: description ? 'var(--general-space-8)' : 'var(--general-space-24)',
          }}
        >
          {header}
        </Text>
      )}
      {description && (
        <Text as="p" variant="p2">
          {description}
        </Text>
      )}
      <Card variant="cardSecondary" className={classNames.customCard}>
        {children}
      </Card>
      <div className={classNames.actionableWrapper}>
        <Button variant="primaryLarge" onClick={button.action}>
          {button.label}
        </Button>
        <Link href={link.href}>
          <WithArrow>{link.label}</WithArrow>
        </Link>
      </div>
    </div>
  )
}

const data = {
  'govern-lazy-summer': {
    title: 'Govern Lazy Summer',
    content: (
      <SumrGovernanceContent
        header="The only way to govern Lazy Summer Protocol"
        button={{ label: 'Go to Governance', action: () => null }}
        link={{ label: 'Claim $SUMR', href: '/' }}
      >
        <SumrGovernanceList list={sumrGovernLazySummerData} />
      </SumrGovernanceContent>
    ),
  },
  'stake-to-delegate': {
    title: 'Stake to delegate + earn',
    content: (
      <SumrGovernanceContent
        header="Earn more $SUMR while protecting the protocol"
        button={{ label: 'Stake your $SUMR', action: () => null }}
        link={{ label: 'View delegates', href: '/' }}
      >
        <SumrGovernanceList list={sumrStakeToDelegate} />
      </SumrGovernanceContent>
    ),
  },
  'sumr-ownership': {
    title: '$SUMR ownership',
    content: (
      <SumrGovernanceContent
        header="$SUMR ownership"
        button={{ label: 'Go to Governance', action: () => null }}
        link={{ label: 'Claim $SUMR', href: '/' }}
      >
        <SumrOwnership />
      </SumrGovernanceContent>
    ),
  },
  'sumr-supply-schedule': {
    title: '$SUMR supply schedule',
    content: (
      <SumrGovernanceContent
        header="Predictable and transparent supply schedule"
        description="35% Community Allocation. Overtime, a significant portion of $SUMR will be distributed to the community, ensuring decentralized control and fostering a user-driven protocol."
        button={{ label: 'Claim $SUMR', action: () => null }}
        link={{ label: 'See SUMR Vesting Conditions', href: '/' }}
      >
        <SumrSupplySchedule />
      </SumrGovernanceContent>
    ),
  },
}

export const SumrGovernance = () => {
  return (
    <div className={classNames.sumrGovernanceWrapper}>
      <MarketingPointsList
        header="Governance power, robust tokenomic’s and multiple ways to earn"
        data={data}
        detailsWrapperClassName={classNames.marketingDetailsCustomWrapper}
      />
    </div>
  )
}
