'use client'
import { Card, Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { useUserWallet } from '@/hooks/use-user-wallet'

import classNames from './SumrNotTransferable.module.css'

const getBoxes = (userWalletAddress: string | undefined) => [
  {
    preTitle: 'Long Term Focus',
    title: 'Encourages Long-Term Alignment',
    description:
      'Non-transferability eliminates the potential for immediate price volatility caused by speculators buying and selling the token.',
    link: {
      label: 'Get $SUMR',
      href: userWalletAddress ? `/portfolio/${userWalletAddress}?tab=rewards` : '/sumr#claim',
    },
  },
  {
    preTitle: 'Mercenary Users',
    title: 'Discourages Bad Actors',
    description:
      'Non-transferable tokens cannot be exploited by bots or malicious actors attempting to farm and sell tokens indiscriminately.',
    link: {
      label: 'Get $SUMR',
      href: userWalletAddress ? `/portfolio/${userWalletAddress}?tab=rewards` : '/sumr#claim',
    },
  },
  {
    preTitle: 'Smooth Transition',
    title: 'Smooth Transition to Full Utility',
    description:
      'A non-transferable token allows the protocol to focus on refining its utility before introducing liquidity through transferability.',
    link: {
      label: 'Get $SUMR',
      href: userWalletAddress ? `/portfolio/${userWalletAddress}?tab=rewards` : '/sumr#claim',
    },
  },
]

export const SumrNotTransferable = () => {
  const { userWalletAddress } = useUserWallet()

  return (
    <div className={classNames.sumrNotTransferableWrapper}>
      <div className={classNames.header}>
        <Text as="h2" variant="h2">
          Non-Transferable. A feature not a bug
        </Text>
        <Text as="p" variant="p1" style={{ maxWidth: '800px', margin: '0 auto' }}>
          Until at least July 1st 2025, $SUMR will not be tradeable, it can only be earned and used
          to govern the protocol. This is highly beneficial to both the protocol and for our
          community because it removes distractions and immediate short term thinking, creating the
          most long term value.
        </Text>
      </div>
      <div className={classNames.boxes}>
        {getBoxes(userWalletAddress).map((box, index) => (
          <Card variant="cardPrimary" key={index} className={classNames.box}>
            <Text as="p" variant="p3semiColorful">
              {box.preTitle}
            </Text>
            <Text as="p" variant="p1semi">
              {box.title}
            </Text>
            <Text as="p" variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              {box.description}
            </Text>
            <Link href={box.link.href}>
              <WithArrow variant="p3semi">{box.link.label}</WithArrow>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
