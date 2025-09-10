'use client'
import { type FC } from 'react'
import { Card, TabBar, Text, WithArrow } from '@summerfi/app-earn-ui'
import { slugify } from '@summerfi/app-utils'
import Image from 'next/image'
import Link from 'next/link'

import { vaultDetailsHowItWorksLinks } from '@/features/vault-details/components/VaultDetailsHowItWorks/config'
import { useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'
import governance from '@/public/img/vault_details/governance.svg'
import howItWorks from '@/public/img/vault_details/how_it_works.svg'

const LinksAndDescription = () => {
  const handleButtonClick = useHandleButtonClickEvent()

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Text
        as="p"
        variant="p2"
        style={{
          marginBottom: 'var(--spacing-space-small)',
          color: 'var(--earn-protocol-secondary-60)',
        }}
      >
        The Lazy Summer Protocol is a permissionless passive lending product, which sets out to
        offer effortless and secure optimised yield, while diversifying risk.
      </Text>
      <div style={{ display: 'flex', gap: '45px', flexWrap: 'wrap' }}>
        {vaultDetailsHowItWorksLinks.map((link) => (
          <Link
            href={link.href}
            key={link.label}
            target="_blank"
            onClick={() => {
              handleButtonClick(`vault-details-how-it-all-works-${slugify(link.label)}`)
            }}
          >
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
  )
}

const ContentWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-space-large)' }}>
      <LinksAndDescription />
      {children}
    </div>
  )
}

const ImageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        borderRadius: 'var(--general-radius-16)',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        background: 'var(--earn-protocol-neutral-100)',
        padding: 'var(--general-space-32) var(--general-space-24)',
      }}
    >
      {children}
    </div>
  )
}

export const VaultDetailsHowItWorks = () => {
  const handleButtonClick = useHandleButtonClickEvent()
  const tabs = [
    {
      label: 'Rebalance mechanism',
      id: 'rebalance-mechanism',
      content: (
        <ContentWrapper>
          <ImageWrapper>
            <Image
              src={howItWorks}
              alt="how-it-works"
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
              width={1200}
            />
          </ImageWrapper>
        </ContentWrapper>
      ),
    },
    {
      label: 'Governance',
      id: 'governance',
      content: (
        <ContentWrapper>
          <ImageWrapper>
            <Image
              src={governance}
              alt="governance"
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
              width={1200}
            />
          </ImageWrapper>
        </ContentWrapper>
      ),
    },
  ]

  const handleTabChange = (tab: { id: string }) => {
    handleButtonClick(`vault-details-how-it-all-works-${tab.id}`)
  }

  return (
    <Card variant="cardSecondary">
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

        <TabBar tabs={tabs} handleTabChange={handleTabChange} />
      </div>
    </Card>
  )
}
