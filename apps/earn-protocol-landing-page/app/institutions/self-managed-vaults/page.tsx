/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client'
import { useMemo } from 'react'
import {
  Audits,
  Button,
  Card,
  Emphasis,
  FaqSection,
  Icon,
  SectionTabs,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { supportedDefillamaProtocols, supportedDefillamaProtocolsConfig } from '@summerfi/app-types'
import { formatCryptoBalance, formatPercent } from '@summerfi/app-utils'

import { BigProtocolScroller } from '@/components/layout/LandingPageContent/components/BigProtocolScroller'
import { InstitutionsContactForm } from '@/components/layout/LandingPageContent/components/InstitutionsContactForm'
import { BuildBySummerFi } from '@/components/layout/LandingPageContent/content/BuildBySummerFi'
import { useLandingPageData } from '@/contexts/LandingPageContext'
import { useFeatureFlagRedirect } from '@/hooks/use-feature-flag'
import chainSecurityLogo from '@/public/img/landing-page/auditor-logos/chainsecurity.svg'
import prototechLabsLogo from '@/public/img/landing-page/auditor-logos/prototech-labs.svg'

import selfManagedVaultsStyles from './selfManagedVaults.module.css'
import institutionsPageStyles from '@/app/institutions/institutionsPage.module.css'

export default function SelfManagedVaults() {
  const { landingPageData } = useLandingPageData()

  useFeatureFlagRedirect({
    config: landingPageData?.systemConfig,
    featureName: 'Institutions',
  })

  const protocolsList = useMemo(() => {
    return supportedDefillamaProtocols.map((protocol) => {
      const protocolConfig = supportedDefillamaProtocolsConfig[protocol]
      const { strategy, asset, displayName } = protocolConfig
      const protocolIcon = protocolConfig.icon
      const tvl = BigInt(landingPageData?.protocolTvls?.[protocol] ?? 0)
      const apy = landingPageData?.protocolApys?.[protocol] ?? [0, 0]

      return {
        protocolIcon,
        protocol: displayName,
        blocks: [
          ['TVL', tvl ? `$${formatCryptoBalance(tvl)}` : 'N/A'],
          ['Strategy', strategy],
          ['Asset', asset.join(', ')],
          [
            '30d APY Range 24/25',
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            apy
              ? `${formatPercent(apy[0], {
                  precision: 2,
                })} - ${formatPercent(apy[1], {
                  precision: 2,
                })}`
              : 'N/A',
          ],
        ] as [string, string][],
        url: '',
      }
    })
  }, [landingPageData?.protocolTvls, landingPageData?.protocolApys])

  const smoothScrollToId = (id: string) => () => {
    const element = document.getElementById(id)

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
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
            Get access to DeFi’s most trusted yield sources - customized, compliant, and built for
            scale. Lazy Summer’s Closed access vaults give institutions seamless exposure to
            crypto’s highest quality yields, without compromising on security, transparency, or risk
            oversight.
          </Text>
          <Button
            variant="primaryLargeColorful"
            onClick={smoothScrollToId('institutions-self-managed-vaults-cta')}
          >
            <WithArrow variant="p2semi">Get started</WithArrow>
          </Button>
          <WithArrow
            variant="p2semi"
            style={{ color: 'white', margin: '20px 10px 0 0', cursor: 'pointer' }}
            onClick={smoothScrollToId('institutions-self-managed-vaults-contact-form')}
          >
            Contact us
          </WithArrow>
        </div>
      </div>
      <div className={institutionsPageStyles.subpageDescriptionBlock}>
        <div className={institutionsPageStyles.subpageDescriptionText}>
          <Text as="h2" variant="h2">
            Closed access vaults by Lazy Summer Protocol
          </Text>
          <Text as="h5" variant="h5">
            Bespoke DeFi vaults designed for institutions.
          </Text>
          <Text as="p" variant="p1">
            Lazy Summer’s Closed access vaults are ring-fenced strategies deployed only to
            whitelisted addresses and governed by institutional permissions. Funds remain
            segregated, strategies are auditable, and vaults can be tailored to your specific
            mandates.
          </Text>
        </div>
        <Card className={institutionsPageStyles.subpageDescriptionCard}>
          <Text as="h5" variant="h5colorful">
            Features
          </Text>
          <ul>
            <li>
              <Icon iconName="checkmark_colorful" size={16} />
              <Text variant="h5" as="p">
                Whitelisted access only - full control over who allocates
              </Text>
            </li>
            <li>
              <Icon iconName="checkmark_colorful" size={16} />
              <Text variant="h5" as="p">
                No co-mingling - assets stay isolated from other users
              </Text>
            </li>
            <li>
              <Icon iconName="checkmark_colorful" size={16} />
              <Text variant="h5" as="p">
                Regulatory-ready - supports internal and external compliance requirements
              </Text>
            </li>
          </ul>
        </Card>
      </div>
      <div
        className={selfManagedVaultsStyles.integrationsBlock}
        id="institutions-self-managed-vaults-cta"
      >
        <Text as="h2" variant="h2">
          One integration, seamless access to crypto’s highest quality yield sources
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
      <BigProtocolScroller itemsList={protocolsList} />
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
      <div id="institutions-self-managed-vaults-contact-form">
        <InstitutionsContactForm />
      </div>
      <div>
        <div className={institutionsPageStyles.securityAndCompliance}>
          <Text variant="p1semiColorful" as="div">
            Best in class regulatory structure
          </Text>
          <Text variant="h2" as="h2">
            Security and compliance first
          </Text>
          <Text variant="p1semi" as="p">
            We’re focused on compliance, so you can focus on utility and yield.
          </Text>
        </div>
        <Audits chainSecurityLogo={chainSecurityLogo} prototechLabsLogo={prototechLabsLogo} />
      </div>
      <BuildBySummerFi proAppStats={landingPageData?.proAppStats} />
      <FaqSection
        customTitle="Frequently Asked Questions"
        wrapperClassName={selfManagedVaultsStyles.faqWrapper}
        expanderButtonStyles={{
          padding: 'var(--spacing-space-large) 0',
        }}
        data={[
          {
            title: 'What is a Self-Managed Vault?',
            content: (
              <Text variant="p1" as="p">
                A non custodial vault shell powered by Lazy Summer Protocol where you define assets,
                risk criteria, and rebalancing logic, all executed on-chain.
              </Text>
            ),
          },
          {
            title: 'What security measures protect our assets?',
            content: (
              <Text variant="p1" as="p">
                Vaults are non-custodial; funds stay in wallets you control.
              </Text>
            ),
          },
          {
            title: 'Can anyone use self-managed vaults?',
            content: (
              <Text variant="p1" as="p">
                Yes, but we recommend a $10 M+ starting deposit to justify customization and
                dedicated support.
              </Text>
            ),
          },
          {
            title: 'What support is available?',
            content: (
              <Text variant="p1" as="p">
                You’ll have a account manager who will provide both technical and non technical
                onboarding and management support.
              </Text>
            ),
          },
          {
            title: 'Why choose this over building in house?',
            content: (
              <Text variant="p1" as="p">
                One seamless integration integration to access Maker, Aave, Morpho and all the other
                best in class DeFi yield sources.
              </Text>
            ),
          },
          {
            title: 'Who controls the funds?',
            content: (
              <Text variant="p1" as="p">
                You do. Vaults are non-custodial; deposits/withdrawals require your multisig or MPC
                signature (Fireblocks/Copper integrations available).
              </Text>
            ),
          },
        ]}
      />
    </div>
  )
}
