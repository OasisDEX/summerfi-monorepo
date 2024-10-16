'use client'
import { useState } from 'react'
import { Card, InlineButtons, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type InlineButtonOption } from '@summerfi/app-types'
import Image from 'next/image'
import Link from 'next/link'

import {
  strategyDetailsHowItWorksLinks,
  strategyDetailsHowItWorksOptions,
} from '@/components/organisms/StrategyDetailsHowItWorks/config'

import rebalancingMorpho from 'public/img/rebalancing/rebalancing-morpho.png'

export const StrategyDetailsHowItWorks = () => {
  const [currentOption, setCurrentOption] = useState<InlineButtonOption<string>>(
    strategyDetailsHowItWorksOptions[0],
  )

  return (
    <Card variant="cardPrimary">
      <div
        id="how-it-works"
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
          options={strategyDetailsHowItWorksOptions}
          currentOption={currentOption}
          handleOption={(option) => setCurrentOption(option)}
          style={{
            marginBottom: 'var(--spacing-space-large)',
          }}
          variant="p4semi"
        />
        <div style={{ borderRadius: '15px', overflow: 'hidden', width: '100%', height: '100%' }}>
          <Image
            src={rebalancingMorpho}
            alt="rebalancing-morpho"
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
            }}
            width={1200}
            placeholder="blur"
          />
        </div>
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
          {strategyDetailsHowItWorksLinks.map((link) => (
            <Link href={link.href} key={link.label}>
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
