'use client'
import { type FC } from 'react'
import { BigGradientBox, Text, useUserWallet, WithArrow } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import Link from 'next/link'

import pillars from '@/public/img/sumr/pillars.svg'
import rewardingUsage from '@/public/img/sumr/rewarding_usage.svg'

import classNames from './SumrFundametnalUtility.module.css'

interface SumrFundamentalTextualContentProps {
  title: string
  description: string
  link: {
    label: string
    href: string
  }
}

const SumrFundamentalTextualContent: FC<SumrFundamentalTextualContentProps> = ({
  title,
  description,
  link,
}) => {
  return (
    <div className={classNames.textual}>
      <Text as="h5" variant="h5">
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

export const SumrFundamentalUtility = () => {
  const { userWalletAddress } = useUserWallet()

  return (
    <div className={classNames.sumrFundamentalUtilityWrapper}>
      <Text as="h2" variant="h2" className={classNames.title}>
        Fundamental utility and Incentive aligned ecosystem{' '}
      </Text>
      <div className={classNames.boxes}>
        <BigGradientBox className={classNames.bottomBoxLeftGradient}>
          <SumrFundamentalTextualContent
            title="The core pillar of protocol governance"
            description="With Summer, effortlessly earn the best yields and grow your capital faster. We automatically rebalance your assets to top protocols, maximizing your returns."
            link={{
              href: userWalletAddress
                ? `/portfolio/${userWalletAddress}?tab=rewards`
                : '/sumr#claim',
              label: 'Claim $SUMR',
            }}
          />
          <Image src={pillars} alt="The core pillar of protocol governance" />
        </BigGradientBox>
        <BigGradientBox className={classNames.bottomBoxRightGradient}>
          <SumrFundamentalTextualContent
            title="Rewarding sustained protocol usage"
            description="Lazy Summer requires 0 management from users. Only your own deposits, all risk management, yield optimizing and strategy rebalancing is handled automatically."
            link={{
              href: '/',
              label: 'Earn $SUMR',
            }}
          />
          <Image src={rewardingUsage} alt="Rewarding sustained protocol usage" />
        </BigGradientBox>
      </div>
    </div>
  )
}
