'use client'
import type { FC } from 'react'
import { BigGradientBox, Text, useUserWallet, WithArrow } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import Link from 'next/link'

import classNames from './SumrMultipleWaysToEarn.module.css'

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
        <WithArrow variant="p3semi">{link.label}</WithArrow>
      </Link>
    </div>
  )
}

export const SumrMultipleWaysToEarn = () => {
  const { userWalletAddress } = useUserWallet()

  return (
    <div className={classNames.sumrMultipleWaysToEarnWrapper}>
      <Text as="h2" variant="h2" className={classNames.title}>
        Multiple ways to earn $SUMR
      </Text>
      <div className={classNames.boxes}>
        <BigGradientBox className={classNames.bottomBoxLeftGradient}>
          <Image
            src={rebalanceActivity}
            alt="Delegate & Stake to earn $SUMR"
            placeholder="blur"
            quality={100}
          />
          <SumrMultipleWaysToEarnTextualContent
            title="Delegate & Stake to earn $SUMR"
            description="Put your $SUMR to work by staking and delegating. Earn passive rewards while contributing to protocol governance. Shape the future of Lazy Summer and grow your holdings effortlessly."
            link={{
              href: userWalletAddress
                ? `/portfolio/${userWalletAddress}?tab=rewards`
                : '/sumr#claim',
              label: 'Stake & Earn',
            }}
          />
        </BigGradientBox>
        <BigGradientBox className={classNames.bottomBoxRightGradient}>
          <Image src={earnSumr} alt="Deposit to earn $SUMR" placeholder="blur" quality={100} />
          <SumrMultipleWaysToEarnTextualContent
            title="Deposit to earn $SUMR"
            description="Earn $SUMR as a reward for using the protocol and grow your portfolio by simply depositing into Lazy Summer. Gaining both yields optimized by AI and governance power in one seamless experience."
            link={{
              href: '/',
              label: 'Sign up',
            }}
          />
        </BigGradientBox>
      </div>
    </div>
  )
}
