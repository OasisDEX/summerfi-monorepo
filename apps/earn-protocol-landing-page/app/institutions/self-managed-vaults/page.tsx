/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client'
import { useMemo } from 'react'
import {
  Audits,
  BigGradientBox,
  Button,
  Emphasis,
  FaqSection,
  Icon,
  SectionTabs,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { supportedDefillamaProtocols, supportedDefillamaProtocolsConfig } from '@summerfi/app-types'
import { formatCryptoBalance, formatPercent } from '@summerfi/app-utils'
import clsx from 'clsx'
import Image from 'next/image'

import { BigProtocolScroller } from '@/components/layout/LandingPageContent/components/BigProtocolScroller'
import { InstitutionsContactForm } from '@/components/layout/LandingPageContent/components/InstitutionsContactForm'
import { BuildBySummerFi } from '@/components/layout/LandingPageContent/content/BuildBySummerFi'
import { useLandingPageData } from '@/contexts/LandingPageContext'
import { useFeatureFlagRedirect } from '@/hooks/use-feature-flag'
import { useScrolled } from '@/hooks/use-scrolled'
import selfManagedVaultDiagram from '@/public/img/institution/self-managed-vault-diagram.svg'
import chainSecurityLogo from '@/public/img/landing-page/auditor-logos/chainsecurity.svg'
import prototechLabsLogo from '@/public/img/landing-page/auditor-logos/prototech-labs.svg'

import selfManagedVaultsStyles from './selfManagedVaults.module.css'
import institutionsPageStyles from '@/app/institutions/institutionsPage.module.css'

import customVaultsUI from '@/public/img/institution/custom-vaults-ui.png'

export default function SelfManagedVaults() {
  const { landingPageData } = useLandingPageData()
  const { isScrolledToTop } = useScrolled()

  useFeatureFlagRedirect({
    config: landingPageData?.systemConfig,
    featureName: 'Institutions',
  })

  const protocolsList = useMemo(() => {
    return supportedDefillamaProtocols.map((protocol) => {
      const protocolConfig = supportedDefillamaProtocolsConfig[protocol]
      const { displayName } = protocolConfig
      const protocolIcon = protocolConfig.icon
      const tvl = BigInt(landingPageData?.protocolTvls?.[protocol] ?? 0)
      const apy = landingPageData?.protocolApys?.[protocol] ?? [0, 0]

      return {
        protocolIcon,
        protocol: displayName,
        blocks: [
          ['TVL', tvl ? `$${formatCryptoBalance(tvl)}` : 'N/A'],
          [
            '30d APY Range',
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
          Get better access to crypto yield
          <br />
          with&nbsp;
          <Emphasis variant="h1colorful">self-managed Vaults</Emphasis>
        </Text>
        <div className={institutionsPageStyles.pageHeaderDetails}>
          <Text as="span" variant="p1">
            With just a single integration, you can get access to all of crypto&apos;s most trusted
            yield sources. Customized, compliant and built for scale. Summer.fi self-managed vaults
            give institutions seamless exposure without compromising on security or risk.
          </Text>
          <Button
            variant="primaryLargeColorful"
            onClick={smoothScrollToId('institutions-self-managed-vaults-cta')}
          >
            <WithArrow variant="p2semi">Get in touch</WithArrow>
          </Button>
        </div>
      </div>
      <div
        className={clsx(institutionsPageStyles.scrollDownButton, {
          [institutionsPageStyles.scrollDownButtonHidden]: !isScrolledToTop,
        })}
        onClick={smoothScrollToId('institutions-self-managed-vaults-description')}
      >
        <Text variant="p3semi">
          Read more <Icon iconName="arrow_forward" size={20} />
        </Text>
      </div>
      <div
        className={institutionsPageStyles.subpageDescriptionBlock}
        id="institutions-self-managed-vaults-description"
      >
        <div className={institutionsPageStyles.subpageDescriptionText}>
          <Text as="h2" variant="h2">
            Know where every dollar comes from with our closed-access functionality
          </Text>
          <Text as="p" variant="p1">
            Every Self-managed vault from Summer.fi has the option to restrict access to only
            approved users and addresses. This means you maintain an even higher degree of control
            and have no co-mingling of funds from non approved addresses.
          </Text>
        </div>
      </div>
      <BigGradientBox color="red" style={{ padding: '64px' }}>
        <Image
          src={customVaultsUI}
          alt="Custom vaults UI"
          id="institutions-self-managed-vaults-ui"
        />
      </BigGradientBox>
      <div
        className={selfManagedVaultsStyles.integrationsBlock}
        id="institutions-self-managed-vaults-cta"
      >
        <Text as="h2" variant="h2">
          One integration for all of crypto&apos;s onchain yield
        </Text>
        <Text as="p" variant="p1">
          Self-managed Vaults can you give you access to any onchain yield. This includes public or
          private markets across all EVM based blockchains with support for all types of yield
          including Lending, DEX LPs, RWA&apos;s, Yield Looping and more. Construct the yield
          portfolio of your choosing with ease.
        </Text>
        <Image
          src={selfManagedVaultDiagram}
          alt="Self-managed vaults diagram"
          id="institutions-self-managed-vaults-diagram"
          style={{ margin: '64px 0' }}
        />
        <Text as="h2" variant="h2" style={{ textAlign: 'center' }}>
          Just some of the yield markets you can access
        </Text>
      </div>
      <BigProtocolScroller itemsList={protocolsList} />
      <div>
        <div className={selfManagedVaultsStyles.benefitsHeaderWrapper}>
          <Text variant="h2">Key benefits of a self-managed Vault</Text>
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
            {
              title: 'Manage the risk in-house, or outsource to a third party risk manager',
              content: (
                <div className={selfManagedVaultsStyles.benefitsDescriptionAndPoints}>
                  <Text variant="p1">
                    Get the best of both worlds when it comes to risk, with self managed vaults.
                    Institutions can set risk parameters that best fit compliance and or risk
                    threshold requirements in a self directed or third party defined manner for
                    maximum convenience and control.
                  </Text>
                  <ul>
                    <li>
                      <Icon iconName="checkmark" size={16} />
                      <Text variant="p1" as="p">
                        Set self defined risk parameters
                      </Text>
                    </li>
                    <li>
                      <Icon iconName="checkmark" size={16} />
                      <Text variant="p1" as="p">
                        Opt-in third party risk manager (Block Analitica)
                      </Text>
                    </li>
                  </ul>
                </div>
              ),
              id: 'third-party-risk-manager',
            },
            {
              title: 'Game changing operational efficiency',
              content: (
                <div className={selfManagedVaultsStyles.benefitsDescriptionAndPoints}>
                  <Text variant="p1">
                    Institutions can now streamline DeFi operations to what matters most,
                    identifying and understanding underlying DeFi protocols and strategies.
                    Ultimately saving time, cutting costs and leading to top performance.
                  </Text>
                  <ul>
                    <li>
                      <Icon iconName="checkmark" size={16} />
                      <Text variant="p1" as="p">
                        Single point access to all of DeFi
                      </Text>
                    </li>
                    <li>
                      <Icon iconName="checkmark" size={16} />
                      <Text variant="p1" as="p">
                        One time integration
                      </Text>
                    </li>
                    <li>
                      <Icon iconName="checkmark" size={16} />
                      <Text variant="p1" as="p">
                        Reduced position management
                      </Text>
                    </li>
                  </ul>
                </div>
              ),
              id: 'operational-efficiency',
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
