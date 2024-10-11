'use client'
import { useState } from 'react'
import { Card, InlineButtons, SkeletonImage, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type InlineButtonOption } from '@summerfi/app-types'
import Link from 'next/link'

const options: InlineButtonOption<string>[] = [
  {
    title: 'Flow of funds',
    key: 'flow-of-funds',
  },
  {
    title: 'Rebalance mechanism',
    key: 'rebalance-mechanism',
  },
  {
    title: 'Governance',
    key: 'governance',
  },
]

const links = [
  {
    label: 'White Paper',
    href: '/',
  },
  {
    label: 'Lite Paper',
    href: '/',
  },
  {
    label: 'Video',
    href: '/',
  },
]

export const StrategyDetailsHowItWorks = () => {
  const [currentOption, setCurrentOption] = useState<InlineButtonOption<string>>(options[0])

  return (
    <Card variant="cardPrimary">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <Text as="h5" variant="h5" style={{ marginBottom: 'var(--spacing-space-large)' }}>
          How it all works
        </Text>
        <InlineButtons
          options={options}
          currentOption={currentOption}
          handleOption={(option) => setCurrentOption(option)}
          style={{
            marginBottom: 'var(--spacing-space-large)',
          }}
        />
        <SkeletonImage
          src="/img/rebalancing/rebalancing-morpho.png"
          alt="rebalancing-morpho"
          sizes="100vw"
          style={{
            width: '100%',
            height: 'auto',
          }}
          width={1200}
          height={463}
        />
        <Text
          as="p"
          variant="p2"
          style={{
            marginTop: 'var(--spacing-space-x-large)',
            marginBottom: 'var(--spacing-space-small)',
          }}
        >
          The Summer Earn Protocol is a permissionless passive lending product, which sets out to
          offer effortless and secure optimised yield, while diversifying risk.
        </Text>
        <div style={{ display: 'flex', gap: '45px' }}>
          {links.map((link) => (
            <Link href={link.href} key={link.href}>
              <WithArrow
                as="p"
                variant="p3semi"
                style={{ color: 'var(--earn-protocol-primary-100)' }}
              >
                {link.label}
              </WithArrow>
            </Link>
          ))}
        </div>
      </div>
    </Card>
  )
}
