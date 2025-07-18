'use client'
import { useMemo } from 'react'
import {
  Audits,
  Button,
  Card,
  Emphasis,
  EXTERNAL_LINKS,
  FaqSection,
  Icon,
  INTERNAL_LINKS,
  SectionTabs,
  TabBar,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { supportedDefillamaProtocols, supportedDefillamaProtocolsConfig } from '@summerfi/app-types'
import { formatCryptoBalance, formatPercent } from '@summerfi/app-utils'
import Image from 'next/image'
import Link from 'next/link'

import { BigProtocolScroller } from '@/components/layout/LandingPageContent/components/BigProtocolScroller'
import { FinalCTAElement } from '@/components/layout/LandingPageContent/components/InstitutionsFinalCTA'
import { BuildBySummerFi } from '@/components/layout/LandingPageContent/content/BuildBySummerFi'
import { useLandingPageData } from '@/contexts/LandingPageContext'
import { useFeatureFlagRedirect } from '@/hooks/use-feature-flag'
import blueChipsImage from '@/public/img/institution/blue-chips.svg'
import chainSecurityLogo from '@/public/img/landing-page/auditor-logos/chainsecurity.svg'
import prototechLabsLogo from '@/public/img/landing-page/auditor-logos/prototech-labs.svg'

import publicAccessVaultsStyles from './publicAccessVaults.module.css'
import institutionsPageStyles from '@/app/institutions/institutionsPage.module.css'

import howItWorksImage from '@/public/img/institution/how-it-works-diagram.png'

export default function PublicAccessVaults() {
  const { landingPageData } = useLandingPageData()

  const protocolsList = useMemo(() => {
    return supportedDefillamaProtocols.map((protocol) => {
      const protocolConfig = supportedDefillamaProtocolsConfig[protocol]
      const { asset, displayName } = protocolConfig
      const protocolIcon = protocolConfig.icon
      const tvl = BigInt(landingPageData?.protocolTvls[protocol] ?? 0)
      const apy = landingPageData?.protocolApys[protocol] ?? [0, 0]

      return {
        protocolIcon,
        protocol: displayName,
        blocks: [
          ['TVL', tvl ? `$${formatCryptoBalance(tvl)}` : 'N/A'],
          ['Live APY', formatPercent(apy[1], { precision: 2 })],
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

  useFeatureFlagRedirect({
    config: landingPageData?.systemConfig,
    featureName: 'Institutions',
  })

  const totalProtocolTvl = landingPageData
    ? Object.values(landingPageData.protocolTvls).reduce((acc, tvl) => acc + BigInt(tvl), BigInt(0))
    : BigInt(0)

  return (
    <div className={publicAccessVaultsStyles.wrapper}>
      <div
        className={institutionsPageStyles.pageHeader}
        style={{ marginBottom: '0', paddingBottom: '0' }}
      >
        <Text as="h1" variant="h1">
          Superior risk adjusted DeFi yield
          <br />
          <Emphasis variant="h1colorful">for institutional allocators</Emphasis>
        </Text>
        <div className={institutionsPageStyles.pageHeaderDetails}>
          <Text as="span" variant="p1">
            Lazy Summer Protocol gives professional allocators a single entry point to on-chain
            yield. Capital is rotated automatically into the highest quality strategies, cutting
            operational complexity while targeting superior risk-adjusted returns.
          </Text>
          <Link href="/earn" target="_blank">
            <Button variant="primaryLargeColorful" style={{ minWidth: '240px' }}>
              <WithArrow variant="p2semi" style={{ color: 'white' }}>
                Get started now
              </WithArrow>
            </Button>
          </Link>
        </div>
      </div>
      <div className={publicAccessVaultsStyles.strategiesBlock}>
        <Text as="h2" variant="h2">
          DeFi’s highest quality strategies continuously optimised
        </Text>
        <Text as="p" variant="p1" className={publicAccessVaultsStyles.secondaryParagraph}>
          Effortless access to crypto’s best DeFi yields, continually rebalanced with AI powered
          automation for best in class risk adjusted return.
        </Text>
      </div>
      <BigProtocolScroller itemsList={protocolsList} />
      <div className={publicAccessVaultsStyles.strategiesBlockSubtitle}>
        <Text
          as="p"
          variant="p1"
          className={publicAccessVaultsStyles.secondaryParagraph}
          style={{ marginTop: '-70px' }}
        >
          All vaults interact only with tier-one liquidity venues that together hold more than
          &nbsp;
          <strong>{formatCryptoBalance(totalProtocolTvl, '$')} of total value</strong> and are
          <br />
          independently risk-rated.
        </Text>
      </div>
      <div className={institutionsPageStyles.subpageDescriptionBlock}>
        <div className={institutionsPageStyles.subpageDescriptionText}>
          <Text as="h2" variant="h2">
            Institutional-grade automation, whatever your
            <br />
            structure
          </Text>
        </div>
        <Card className={institutionsPageStyles.subpageDescriptionCard}>
          <Text as="h5" variant="h5colorful">
            Benefits
          </Text>
          <ul>
            <li>
              <Icon iconName="checkmark_colorful" size={16} />
              <div>
                <Text variant="h5" as="p">
                  Outperformance
                </Text>
                <Text variant="p1" as="p">
                  Consistently beats benchmark DeFi yields (USDC, ETH) via AI-optimized allocation.
                </Text>
              </div>
            </li>
            <li>
              <Icon iconName="checkmark_colorful" size={16} />
              <div>
                <Text variant="h5" as="p">
                  Fully Automated
                </Text>
                <Text variant="p1" as="p">
                  No manual strategy selection. AI agents rebalance capital in real time.
                </Text>
              </div>
            </li>
            <li>
              <Icon iconName="checkmark_colorful" size={16} />
              <div>
                <Text variant="h5" as="p">
                  100% Non Custodial
                </Text>
                <Text variant="p1" as="p">
                  Lazy Summer Protocol is fully permisionless. Your assets are always in your
                  control.
                </Text>
              </div>
            </li>
            <li>
              <Icon iconName="checkmark_colorful" size={16} />
              <div>
                <Text variant="h5" as="p">
                  Transparent & Auditable
                </Text>
                <Text variant="p1" as="p">
                  Onchain vaults with full visibility. No black boxes.
                </Text>
              </div>
            </li>
            <li>
              <Icon iconName="checkmark_colorful" size={16} />
              <div>
                <Text variant="h5" as="p">
                  Independent Risk Management
                </Text>
                <Text variant="p1" as="p">
                  Risk parameters set and monitored by Block Analitica.
                </Text>
              </div>
            </li>
            <li>
              <Icon iconName="checkmark_colorful" size={16} />
              <div>
                <Text variant="h5" as="p">
                  Intuitive UX
                </Text>
                <Text variant="p1" as="p">
                  Simple, compliant interfaces - ideal for teams new to DeFi and expert large
                  allocators alike.
                </Text>
              </div>
            </li>
          </ul>
          <Text
            as="h5"
            variant="h5colorful"
            style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' }}
          >
            <Icon iconName="stars_colorful" size={16} />
            Great For
          </Text>
          <Text
            as="h5"
            variant="h5"
            style={{
              textAlign: 'left',
              color: 'var(--color-text-primary-hover)',
            }}
          >
            Crypto native funds, Family offices, and Large individual allocators
          </Text>
        </Card>
      </div>
      <div className={publicAccessVaultsStyles.blueChipsBlock}>
        <Image src={blueChipsImage} alt="Blue Chip Digital Assets" />
        <div className={publicAccessVaultsStyles.blueChipsBlockDescription}>
          <Text as="h2" variant="h2">
            The best risk-adjusted yields for blue-chip digital assets
          </Text>
          <Text as="p" variant="p1semiColorful">
            Sustainably higher yields, optimized with AI.
          </Text>
          <Text as="p" variant="p1" className={publicAccessVaultsStyles.secondaryParagraph}>
            With Lazy Summer Protocol, your deposits are continuously monitored and reallocated
            across the top protocols, ensuring you are earning the best available yields.
          </Text>
          <div className={publicAccessVaultsStyles.blueChipsBlockButtons}>
            <Link href="/earn" target="_blank">
              <WithArrow variant="p3semi">Get started</WithArrow>
            </Link>
          </div>
        </div>
      </div>
      <div className={publicAccessVaultsStyles.aiPoweredRebalancingBlock}>
        <Text as="h2" variant="h2">
          Smarter yield generation with AI Powered automated rebalancing
        </Text>
        <Text
          as="p"
          variant="p1"
          className={publicAccessVaultsStyles.secondaryParagraph}
          style={{ marginBottom: '40px' }}
        >
          How & why we use AI to outperform and improve efficiency
        </Text>
        <TabBar
          tabs={[
            {
              label: 'How it works',
              id: 'how-it-works',
              content: <Image src={howItWorksImage} alt="How it works" />,
            },
            {
              label: 'Why it matters',
              id: 'why-it-matters',
              content: (
                <Card className={institutionsPageStyles.subpageDescriptionCard}>
                  <ul style={{ marginBottom: '20px' }}>
                    <li>
                      <Icon iconName="checkmark_colorful" size={16} />
                      <Text variant="p1" as="p">
                        <strong>Reduced costs</strong> – 0 manual gas, no duplicated research.
                      </Text>
                    </li>
                    <li>
                      <Icon iconName="checkmark_colorful" size={16} />
                      <Text variant="p1" as="p">
                        <strong>Reduced complexity</strong> – One vault token replaces dozens of
                        wallets.
                      </Text>
                    </li>
                    <li>
                      <Icon iconName="checkmark_colorful" size={16} />
                      <Text variant="p1" as="p">
                        <strong>Improved efficiency</strong> – Capital moves only when the expected
                        gain beats cost + risk.
                      </Text>
                    </li>
                  </ul>
                  <Link href={EXTERNAL_LINKS.BLOG.WHY_AI_MATTERS} target="_blank">
                    <WithArrow variant="p3semi">Learn how we use AI to works</WithArrow>
                  </Link>
                </Card>
              ),
            },
          ]}
        />
      </div>
      <div className={publicAccessVaultsStyles.totalLiquidityBlock}>
        <Text as="h2" variant="h2">
          Only DeFi’s highest quality protocols and strategies, with over{' '}
          {formatCryptoBalance(totalProtocolTvl, '$')} of total liquidity
        </Text>
        <Text
          as="p"
          variant="p1"
          className={publicAccessVaultsStyles.secondaryParagraph}
          style={{
            margin: 'var(--spacing-space-medium-large) 0 var(--spacing-space-x-large) 0',
          }}
        >
          Lazy Summer protocol allows for automated and instant access to DeFi’s highest quality
          protocols and strategies. Curated by third party risk assessments, every strategy that
          capital touches is vetted for technical excellence and financial soundness.
        </Text>
        <div className={publicAccessVaultsStyles.buttonsBlock}>
          <Link href="/earn" target="_blank">
            <Button variant="primaryLarge">Get started</Button>
          </Link>
          {/* <Button variant="secondaryLarge">View yields</Button> */}
        </div>
      </div>
      <div className={publicAccessVaultsStyles.transparentFlowsBlock}>
        <Text as="h2" variant="h2">
          Transparent flows & on demand risk oversight
        </Text>
      </div>
      <SectionTabs
        sections={[
          {
            title: 'Never second guess the source of your yield',
            content: (
              <Text variant="p1">
                Summer.fi ensures you never second guess the source of your yield. With our
                automated rebalances, every decision is fully traceable and optimized transparently.
              </Text>
            ),
            id: 'transparent-flows',
          },
          {
            title: 'Superior risk management from DeFi’s top risk team',
            content: (
              <div className={publicAccessVaultsStyles.transparentFlowsTopRiskTeam}>
                <Text variant="p1semi" as="p">
                  Your capital’s safety and diversification overseen and constantly assessed
                </Text>
                <Text variant="p1" as="p">
                  If depositing in general vaults, Block Analitica is the Risk Curator to the Lazy
                  Summer Protocol, who set and manage all the core risk parameters. They come to
                  Lazy Summer Protocol with a wealth of experience, using sophisticated models to
                  simulate market conditions and their own knowledge to prevent any unnecessary
                  risks taken to the protocol.
                </Text>
                <Text variant="p1semi" as="p">
                  Automatic Diversified Exposure
                </Text>
                <Text variant="p1" as="p">
                  Lazy Summer Protocol requires no management from users after they have deposited.
                  All risk management, yield optimizing and strategy rebalancing is handled
                  automatically within the parameters set by the Risk Curator. No chance of fat
                  fingering a trade again.
                </Text>
              </div>
            ),
            id: 'transparent-flows-2',
          },
        ]}
      />
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
      <div className={institutionsPageStyles.finalCTAs}>
        <Text as="h2" variant="h2">
          Ready to allocate smarter?
        </Text>
        <div className={institutionsPageStyles.finalCTAElementsList}>
          <FinalCTAElement
            icon="earn_1_on_1"
            title="15 minute demo call with Summer.fi team"
            url={EXTERNAL_LINKS.BD_CONTACT}
            urlLabel="Schedule call"
          />
          <FinalCTAElement
            icon="earn_yield_trend"
            title="Self serve vault deposit with Summer.fi dashboard"
            url={`${INTERNAL_LINKS.summerLazy}/earn`}
            urlLabel="Deposit now"
          />
          <FinalCTAElement
            icon="earn_user_activities"
            title="Integration docs for Fireblocks, Anchorage and Gnosis Safe"
            url={EXTERNAL_LINKS.KB.HELP}
            urlLabel="View docs"
          />
        </div>
      </div>
      <FaqSection
        customTitle="Frequently Asked Questions"
        wrapperClassName={publicAccessVaultsStyles.faqWrapper}
        expanderButtonStyles={{
          padding: 'var(--spacing-space-large) 0',
        }}
        data={[
          {
            title: 'What is a Public access vault?',
            content: (
              <Text variant="p1" as="p">
                A pre curated, risk managed deposit once, set and forget vault where Lazy Summer
                automatically rebalances across top protocols for the best risk-adjusted yield.
              </Text>
            ),
          },
          {
            title: 'Who can deposit?',
            content: (
              <Text variant="p1" as="p">
                Any verified wallet outside sanctioned regions can deposit. Users can deposit as
                little as 1$ to over 1B$.
              </Text>
            ),
          },
          {
            title: 'How is the yield generated?',
            content: (
              <Text variant="p1" as="p">
                Strategies vary, but generally yield is generated from top tier DeFi lending
                protocols. Other strategies are also included which have slightly different yield
                generated mechanics, but all are presented transparently in the Summer.fi app.
              </Text>
            ),
          },
          {
            title: 'How often are vaults rebalanced?',
            content: (
              <Text variant="p1" as="p">
                Yield and risk metrics are checked constantly throughout the day; rebalances trigger
                automatically when a preset benefit threshold is hit. These can all be seen
                transparently under “rebalance activity”.
              </Text>
            ),
          },
          {
            title: 'Can I withdraw anytime?',
            content: (
              <Text variant="p1" as="p">
                There are no explicit lock ups and users can withdraw anytime so long as their
                withdrawal is under the “Instant liquidity amount”. This exists simply because some
                supported protocols have withdrawal delays, but 100% of capital is never deployed
                into one of those.
              </Text>
            ),
          },
          {
            title: 'What fees apply?',
            content: (
              <Text variant="p1" as="p">
                A 1% management fee is applied to stablecoin vaults and a 0.3% fee is applied to non
                stablecoin vaults (ETH).
              </Text>
            ),
          },
          {
            title: 'How is risk managed?',
            content: (
              <Text variant="p1" as="p">
                Risk is managed by a third party risk curator who sets and manages deposit caps.
                These are the max amount of user funds that can be deployed into any one protocol at
                a given time.
              </Text>
            ),
          },
        ]}
      />
    </div>
  )
}
