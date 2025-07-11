/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client'
import { Button, Card, Emphasis, Icon, SectionTabs, Text, WithArrow } from '@summerfi/app-earn-ui'
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
      <BigProtocolScroller
        protocolTvls={landingPageData?.protocolTvls}
        protocolApys={landingPageData?.protocolApys}
      />
      <div>
        <div className={selfManagedVaultsStyles.benefitsHeaderWrapper}>
          <Text variant="h2">What are the benefits?</Text>
        </div>
        <SectionTabs
          sections={[
            {
              title: 'Fully customizable to meet any institutional mandate',
              content: (
                <div className={selfManagedVaultsStyles.benefitsDescriptionAndPoints}>
                  <Text variant="p1">
                    For institutions with conservative to opportunistic approaches, Lazy Summer
                    vaults can be configured to define portfolio behaviour that suits your needs
                    with ability to:
                  </Text>
                  <ul>
                    <li>
                      <Icon iconName="checkmark" size={16} />
                      <Text variant="p1" as="p">
                        Set yield strategy preferences
                      </Text>
                    </li>
                    <li>
                      <Icon iconName="checkmark" size={16} />
                      <Text variant="p1" as="p">
                        Define risk parameters
                      </Text>
                    </li>
                    <li>
                      <Icon iconName="checkmark" size={16} />
                      <Text variant="p1" as="p">
                        Enforce reallocation logic & diversification rules
                      </Text>
                    </li>
                    <li>
                      <Icon iconName="checkmark" size={16} />
                      <Text variant="p1" as="p">
                        Control access by team or entity
                      </Text>
                    </li>
                  </ul>
                </div>
              ),
              id: 'customizable',
            },
            {
              title: 'Corporate governance, compliance & institutional scale in mind',
              content: (
                <div className={selfManagedVaultsStyles.benefitsDescriptionAndPoints}>
                  <Text variant="p1">
                    Closed access vaults on Lazy Summer enable institutions to isolate
                    decision-making and meet reporting requirements with ease.
                  </Text>
                  <Text variant="p1">Advanced access controls and role-based permissions.</Text>
                  <ul>
                    <li>
                      <Icon iconName="checkmark" size={16} />
                      <Text variant="p1" as="p">
                        Role based Access: segment control across departments
                      </Text>
                    </li>
                    <li>
                      <Icon iconName="checkmark" size={16} />
                      <Text variant="p1" as="p">
                        Audit ready transaction logs: complete and accounting ready transaction
                        level visibility
                      </Text>
                    </li>
                    <li>
                      <Icon iconName="checkmark" size={16} />
                      <Text variant="p1" as="p">
                        Compliance alignment: suited for internal & external audits
                      </Text>
                    </li>
                  </ul>
                </div>
              ),
              id: 'corporate-governance',
            },
          ]}
        />
      </div>
    </div>
  )
}
