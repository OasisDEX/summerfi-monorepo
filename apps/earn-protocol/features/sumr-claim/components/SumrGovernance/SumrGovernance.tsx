'use client'
import { type FC, type ReactNode } from 'react'
import {
  Button,
  Card,
  EXTERNAL_LINKS,
  MarketingPointsList,
  Text,
  useUserWallet,
  WithArrow,
} from '@summerfi/app-earn-ui'
import Link from 'next/link'

import {
  sumrGovernLazySummerData,
  sumrStakeToDelegate,
} from '@/features/sumr-claim/components/SumrGovernance/const'
import { SumrGovernanceList } from '@/features/sumr-claim/components/SumrGovernanceList/SumrGovernanceList'
import { SumrOwnership } from '@/features/sumr-claim/components/SumrOwnership/SumrOwnership'
import { SumrSupplySchedule } from '@/features/sumr-claim/components/SumrSupplySchedule/SumrSupplySchedule'
import { isOutsideLink } from '@/helpers/is-outside-link'

import classNames from './SumrGovernance.module.css'

interface SumrGovernanceContentProps {
  children: ReactNode
  header?: string
  description?: string
  button: {
    label: string
    href: string
  }
  showButton?: boolean
  link: {
    label: string
    href: string
  }
  showLink?: boolean
}

const SumrGovernanceContent: FC<SumrGovernanceContentProps> = ({
  children,
  header,
  description,
  button,
  link,
  showButton = true,
  showLink = true,
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
        {showButton && (
          <Link
            href={button.href}
            target={isOutsideLink(button.href) ? '_blank' : undefined}
            style={{ width: '100%' }}
          >
            <Button variant="primarySmall">
              <Text as="p" variant="p3semi">
                {button.label}
              </Text>
            </Button>
          </Link>
        )}
        {showLink && (
          <Link href={link.href} target={isOutsideLink(link.href) ? '_blank' : undefined}>
            <WithArrow variant="p3semi">{link.label}</WithArrow>
          </Link>
        )}
      </div>
    </div>
  )
}

const getData = (userWalletAddress: string | undefined) => ({
  'govern-lazy-summer': {
    title: 'Govern Lazy Summer',
    content: (
      <SumrGovernanceContent
        header="The only way to govern Lazy Summer Protocol"
        button={{
          label: 'Learn about $SUMR',
          href: `${EXTERNAL_LINKS.BLOG.INTRODUCING_SUMR_TOKEN}`,
        }}
        link={{
          label: 'Claim $SUMR',
          href: userWalletAddress ? `/portfolio/${userWalletAddress}?tab=rewards` : '/sumr#claim',
        }}
      >
        <SumrGovernanceList list={sumrGovernLazySummerData} />
      </SumrGovernanceContent>
    ),
  },
  'stake-to-delegate': {
    title: 'Stake to Delegate + Earn',
    content: (
      <SumrGovernanceContent
        header="Earn more $SUMR while protecting the protocol"
        button={{
          label: 'Stake your $SUMR',
          href: userWalletAddress ? `/stake-delegate/${userWalletAddress}` : '/sumr#claim',
        }}
        link={{
          label: 'Learn more',
          href: `${EXTERNAL_LINKS.BLOG.INTRODUCING_SUMR_TOKEN}`,
        }}
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
        button={{
          label: 'Learn about $SUMR',
          href: `${EXTERNAL_LINKS.BLOG.INTRODUCING_SUMR_TOKEN}`,
        }}
        link={{
          label: 'Claim $SUMR',
          href: userWalletAddress ? `/portfolio/${userWalletAddress}?tab=rewards` : '/sumr#claim',
        }}
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
        button={{
          label: 'Claim $SUMR',
          href: userWalletAddress ? `/portfolio/${userWalletAddress}?tab=rewards` : '/sumr#claim',
        }}
        link={{
          label: 'See $SUMR Vesting Conditions',
          href: `${EXTERNAL_LINKS.BLOG.INTRODUCING_SUMR_TOKEN}`,
        }}
      >
        <SumrSupplySchedule />
      </SumrGovernanceContent>
    ),
  },
})

export const SumrGovernance = () => {
  const { userWalletAddress } = useUserWallet()
  const data = getData(userWalletAddress)

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
