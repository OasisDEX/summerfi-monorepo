'use client'

import { FC, useMemo } from 'react'
import { BannerCard, INTERNAL_LINKS, Text } from '@summerfi/app-ui'
import { useRouter } from 'next/navigation'

import automationIcon from '@/public/img/banners/boost-banner-1.svg'
import multiplyIcon from '@/public/img/banners/boost-banner-2.svg'
import protocolsIcon from '@/public/img/banners/boost-banner-3.svg'
import migrateIcon from '@/public/img/banners/boost-banner-4.svg'

const getBoostCards = ({
  push,
  userAddress,
}: {
  push: (url: string) => void
  userAddress: string
}) => [
  {
    title: 'Enable automation to your active positions',
    description:
      'Automation help protect your positions from unexpected losses, and optimise their performance',
    footer: 'Boost Rays by up to 1.5X',
    button: {
      label: 'Add automation to your positions',
      action: () => push(`${INTERNAL_LINKS.portfolio}/${userAddress}`),
    },
    image: {
      src: automationIcon,
      alt: 'automation-icon',
    },
  },
  {
    title: 'Trade using Multiply and Yield Loops',
    description:
      'Perform a Multiply trade within Summer.fi, or open, close or adjust a Yield Loop position - you will instantly earn up to 20% of your yearly points total instantly. ',
    footer: 'Get instant Rays plus boosts for repeated use',
    button: {
      label: 'Start Trading now',
      action: () => push(`${INTERNAL_LINKS.earn}/?category=yield-loops`),
    },
    image: {
      src: multiplyIcon,
      alt: 'multiply-icon',
    },
  },
  {
    title: 'Use more protocols through Summer.fi ',
    description:
      'Earn up to 3X the Rays for each open position when you’re using 5 or more Protocols. ',
    footer: 'Boost the Rays on ALL your open positions',
    button: {
      label: 'Explore other protocols',
      action: () => push(INTERNAL_LINKS.multiply),
    },
    image: {
      src: protocolsIcon,
      alt: 'protocols-icon',
    },
  },
  {
    title: 'Migrate a DeFi position in from elsewhere',
    description:
      'If you have supported DeFi positions managed through other interfaces, import them into Summer.fi using our migration tool ',
    footer: 'Earn 20% of the years points instantly',
    button: {
      label: 'Migrate existing position',
      action: () => push(`${INTERNAL_LINKS.portfolio}/${userAddress}`),
    },
    image: {
      src: migrateIcon,
      alt: 'migrate-icon',
    },
  },
]

interface BoostCardsProps {
  userAddress: string
}

export const BoostCards: FC<BoostCardsProps> = ({ userAddress }) => {
  const { push } = useRouter()
  const boostCards = useMemo(() => getBoostCards({ push, userAddress }), [push, userAddress])

  return boostCards.map((item) => (
    <div key={item.title} style={{ marginBottom: 'var(--space-m)' }}>
      <BannerCard
        title={item.title}
        description={item.description}
        footer={
          <Text as="span" variant="p4semiColorful">
            {item.footer}
          </Text>
        }
        button={item.button}
        image={item.image}
      />
    </div>
  ))
}
