import type { FC } from 'react'
import { BigGradientBox, Text, WithArrow } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import Link from 'next/link'

import classNames from './SumrMultipleWaysToEarn.module.scss'

import earnSumr from '@/public/img/sumr/earn_sumr.png'
import rebalanceActivity from '@/public/img/sumr/rebalance_activity.png'

interface SumrMultipleWaysToEarnTextualContentProps {
  title: string
  description: string
  link: {
    label: string
    href: string
  }
}

const SumrMultipleWaysToEarnTextualContent: FC<SumrMultipleWaysToEarnTextualContentProps> = ({
  title,
  description,
  link,
}) => {
  return (
    <div className={classNames.textual}>
      <Text as="p" variant="p1semi">
        {title}
      </Text>
      <Text as="p" variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
        {description}
      </Text>
      <Link href={link.href}>
        <WithArrow>{link.label}</WithArrow>
      </Link>
    </div>
  )
}

export const SumrMultipleWaysToEarn = () => {
  return (
    <div className={classNames.sumrMultipleWaysToEarnWrapper}>
      <Text as="h2" variant="h2">
        Multiple ways to earn $SUMR
      </Text>
      <div className={classNames.boxes}>
        <BigGradientBox className={classNames.bottomBoxLeftGradient}>
          <Image
            src={rebalanceActivity}
            alt="Stake & Delegate to earn $SUMR"
            placeholder="blur"
            quality={100}
          />
          <SumrMultipleWaysToEarnTextualContent
            title="Stake & Delegate to earn $SUMR"
            description="Lazy Summer requires 0 management from users. Apart from your own deposits, all risk management, yield optimizing and strategy rebalancing is handled automatically. "
            link={{
              href: '/earn/portfolio',
              label: 'Stake & Earn',
            }}
          />
        </BigGradientBox>
        <BigGradientBox className={classNames.bottomBoxRightGradient}>
          <Image src={earnSumr} alt="Deposit to earn $SUMR" placeholder="blur" quality={100} />
          <SumrMultipleWaysToEarnTextualContent
            title="Deposit to earn $SUMR"
            description="Lazy Summer requires 0 management from users. Apart from your own deposits, all risk management, yield optimizing and strategy rebalancing is handled automatically. "
            link={{
              href: '/earn/portfolio',
              label: 'Sign up',
            }}
          />
        </BigGradientBox>
      </div>
    </div>
  )
}
