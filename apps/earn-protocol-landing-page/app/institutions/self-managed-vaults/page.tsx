/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client'
import { Button, Card, Emphasis, Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import { redirect } from 'next/navigation'

import { BigProtocolScroller } from '@/components/layout/LandingPageContent/components/BigProtocolScroller'
import { useLandingPageData } from '@/contexts/LandingPageContext'

import selfManagedVaultsStyles from './selfManagedVaults.module.css'
import institutionsPageStyles from '@/app/institutions/institutionsPage.module.css'

export default function SelfManagedVaults() {
  const { landingPageData } = useLandingPageData()

  const institutionsEnabled = landingPageData?.systemConfig.features.Institutions

  if (institutionsEnabled === false) {
    redirect('/')
  }

  return (
    <div className={selfManagedVaultsStyles.wrapper}>
      <div
        className={institutionsPageStyles.pageHeader}
        style={{ marginBottom: '0', paddingBottom: '0' }}
      >
        <Text as="h1" variant="h1">
          Crypto native yield with
          <br />
          <Emphasis variant="h1colorful">full institutional controls</Emphasis>
        </Text>
        <div className={institutionsPageStyles.pageHeaderDetails}>
          <Text as="span" variant="p1">
            Get access to DeFi’s most trusted yield sources—customized, compliant, and built for
            scale. Lazy Summer’s Closed Access Vaults give institutions seamless exposure to
            crypto’s highest quality yields, without compromising on security, transparency, or risk
            oversight.
          </Text>
          <Button variant="primaryLargeColorful">
            <WithArrow variant="p2semi">Get started</WithArrow>
          </Button>
          <WithArrow variant="p2semi" style={{ color: 'white', margin: '20px 10px 0 0' }}>
            Contact us
          </WithArrow>
        </div>
      </div>
      <div className={selfManagedVaultsStyles.descriptionBlock}>
        <div className={selfManagedVaultsStyles.descriptionText}>
          <Text as="h2" variant="h2">
            Closed Access Vaults by Lazy Summer Protocol
          </Text>
          <Text as="h5" variant="h5">
            Bespoke DeFi vaults designed for institutions.
          </Text>
          <Text as="p" variant="p1">
            Lazy Summer’s Closed Access Vaults are ring-fenced strategies—deployed only to
            whitelisted addresses and governed by institutional permissions. Funds remain
            segregated, strategies are auditable, and vaults can be tailored to your specific
            mandates.
          </Text>
        </div>
        <Card className={selfManagedVaultsStyles.descriptionCard}>
          <Text as="h5" variant="h5colorful">
            Features
          </Text>
          <ul>
            <li>
              <Icon iconName="checkmark_colorful" size={16} />
              <Text variant="h5" as="p">
                Whitelisted access only – full control over who allocates
              </Text>
            </li>
            <li>
              <Icon iconName="checkmark_colorful" size={16} />
              <Text variant="h5" as="p">
                No co-mingling – assets stay isolated from other users
              </Text>
            </li>
            <li>
              <Icon iconName="checkmark_colorful" size={16} />
              <Text variant="h5" as="p">
                Regulatory-ready – supports internal and external compliance requirements
              </Text>
            </li>
          </ul>
        </Card>
      </div>
      <div className={selfManagedVaultsStyles.integrationsBlock}>
        <Text as="h2" variant="h2">
          One integration, seamless access to the crypto’s highest quality yield sources
        </Text>
        <Text as="p" variant="p1">
          Lazy Summer connects you to the most proven DeFi protocols through a single SDK
          integration.
        </Text>
        <Text as="p" variant="p1">
          List of protocols and strategies available to institutional integrators via Lazy Summer as
          of June 2025.
        </Text>
      </div>
      <BigProtocolScroller protocolTvls={landingPageData?.protocolTvls} />
    </div>
  )
}
