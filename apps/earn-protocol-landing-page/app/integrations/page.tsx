'use client'
import { Audits, Button, Emphasis, Icon, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { TagButton } from '@/components/atoms/TagButton'
import { HeroWrapper } from '@/components/layout/HeroWrapper/HeroWrapper'
import { CheckLine } from '@/components/layout/LandingPageContent/components/CheckLine'
import { LandingIntegrationsFaqSection } from '@/components/layout/LandingPageContent/content/LandingFaqSection'
import { SubLandingPageSection } from '@/components/layout/SubLandingPageSection/SubLandingPageSection'
import { FractalGlassBackground } from '@/components/molecules/FractalGlassBackground/FractalGlassBackground'
import { LandingPageContactForm } from '@/components/organisms/LandingPageContactForm/LandingPageContactForm'
import { EarnProtocolEvents } from '@/helpers/mixpanel'
import chainSecurityLogo from '@/public/img/landing-page/auditor-logos/chainsecurity.svg'
import prototechLabsLogo from '@/public/img/landing-page/auditor-logos/prototech-labs.svg'
import sherlockLogo from '@/public/img/landing-page/auditor-logos/sherlock.svg'

import integrationsStyles from './Integrations.module.css'

import ourProductsLinesBackground from '@/public/img/landing-page/our-products-lines-bg.png'
import sdkScreenshot from '@/public/img/landing-page/sdk-screenshot.png'

const DefiSaverXSummerFiLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="589" height="60" viewBox="0 0 589 60" fill="none">
    <path
      fill="#dbd3d7"
      fillRule="evenodd"
      d="M36 41.3a2 2 0 0 1 2.5.3l9.7 9.6c.7.8.7 2-.2 2.7a30 30 0 0 1-36 0c-1-.6-1-2-.2-2.7l9.6-9.6a2 2 0 0 1 2.5-.3c3.8 2 8.4 2 12.2 0m15.2-29.5c.8-.8 2-.7 2.7.1a30 30 0 0 1 0 36.2c-.7.8-2 .9-2.7.1l-9.6-9.6a2 2 0 0 1-.3-2.5c2-3.8 2-8.4 0-12.2a2 2 0 0 1 .3-2.5zM6 11.9c.6-.8 1.9-.9 2.7-.1l9.6 9.6q.9 1.2.3 2.5c-2 3.8-2 8.4 0 12.2a2 2 0 0 1-.3 2.5l-9.6 9.6c-.8.8-2 .7-2.7-.1a30 30 0 0 1 0-36.2m163 5.9c6 0 9.5 3 9.6 8.1h-3q-.2-5.2-6.5-5.4-6 .2-6 4.3c0 3.2 3.2 3.7 6.7 4.3 4.4.7 9.3 1.7 9.3 7.1 0 4.5-3.4 7.3-9.3 7.3-6.3 0-10.2-3.3-10.2-8.6h3c.1 3.7 2.7 6 7.2 6 4 0 6.2-1.8 6.2-4.5 0-3.3-3.3-3.8-7-4.4-4.3-.7-9-1.8-9-7 0-4.4 3.3-7.2 9-7.2m56.2 7c5.3 0 9 3.8 9 9V35h-15.2c.4 3.5 3 5.8 6.4 5.8 2.6 0 4.9-1.3 6-3.3l2.3 1.2c-1.4 2.9-4.5 4.7-8.3 4.7-5.4 0-9.3-4-9.3-9.5 0-5.3 3.8-9.1 9.1-9.1m-112.5-.1c5.5 0 9.4 3.7 9.4 9.2l-.1 1.5h-13.7q.7 3.9 4.6 4 3-.1 4.2-2.3l4.3 1c-1 3.2-4.5 5.1-8.7 5.1-5.6 0-9.6-3.8-9.6-9.4 0-5.4 4-9.1 9.6-9.1m76.6.1c4.5 0 7.3 2.5 7.3 6.5v11.4h-2.8v-2.5h-.4q-1.8 3-6 3c-3.7 0-6.1-2-6.1-4.9s2.6-5.3 7.7-5.8l4.8-.6v-.7q-.1-3.6-4.5-3.8-4.1 0-4.3 3.4h-2.9c0-3.7 2.9-6 7.2-6M87.8 18.4c8.4 0 14 4.9 14 12.1 0 7.3-5.6 12.2-14 12.2h-9.1V18.4zm54.3 4.9h-11.7v5.3h10.3V33h-10.3v9.7h-5.7V18.4h17.4zm7 19.4h-5V25.2h5zm57.6-2.3h.3l5.5-15h3l-6.6 17.3h-4l-6.6-17.2h2.9zm38.7-15.3q1.3 0 2 .5v2.6a7 7 0 0 0-2.5-.5c-2.6 0-4.4 2.3-4.4 5.7v9.3h-2.8V25.5h2.8v2.3h.3a5 5 0 0 1 4.6-2.7M189 34.8q-5 1-4.9 3.5t3.8 2.6c3.5 0 5.9-2.2 5.9-5v-1.6zM84.2 38.3h3.6c5 0 8.3-3 8.3-7.8s-3.3-7.7-8.3-7.7h-3.6zm141-11a6 6 0 0 0-6 5.2h12.2a6 6 0 0 0-6.2-5.2m-112.5 1.1c-2.3 0-4 1.6-4.3 3.9h8.6c-.3-2.2-2-3.9-4.3-3.9m34-11.5c1.7 0 3 1.2 3 3 0 1.7-1.3 3-3 3-1.8 0-3-1.3-3-3q.1-2.8 3-3M11.9 6A30 30 0 0 1 48 6c.9.6 1 2 .2 2.7l-9.7 9.6a2 2 0 0 1-2.4.3c-3.8-2-8.4-2-12.2 0a2 2 0 0 1-2.5-.3l-9.6-9.6c-.8-.8-.7-2 .1-2.7"
      clipRule="evenodd"
    />
    <path
      fill="#dbd3d7"
      d="M372 18.2c7.8 0 10.4 4.7 10.8 7.6l-6.6 1.3c-.2-1.6-1-3.5-4.2-3.5-2 0-3.5 1-3.5 2.6q0 2 2.8 2.5l3.9.9c5.4 1.1 8 3.2 8 7.7 0 4.3-3.6 8.5-10.8 8.5-8.3 0-11.2-5-11.5-8l6.8-1.4c.2 2 1.4 4 4.6 4 2.5 0 3.7-1.3 3.7-2.6s-1.4-1.8-3.4-2.3l-3.8-.9c-3.6-.9-7.2-3.1-7.2-7.8s4.4-8.6 10.3-8.6m21.6 16c0 3.3 2.2 5 5 5 2.9 0 5-1.7 5-5V18.8h7.3v14.8c0 7.2-4.8 12.2-12.3 12.2-7.4 0-12.2-5-12.2-12.2V18.8h7.2zm123.8-16c8.4 0 13.4 5.1 13.4 13.6v2h-19.6c.2 3.4 3.2 6 6.9 6a6 6 0 0 0 6-4l6.2 2c-1.5 4.4-5.7 8-12.3 8-7.4 0-14-5.2-14-14 0-8.4 6.4-13.6 13.4-13.6m-73.9 0c7.5 0 12 5 12 12.2v14.8h-7.2V29.8c0-3.3-2-5-4.8-5s-4.8 1.7-4.8 5v15.4h-7.2V29.8c0-3.3-2-5-4.8-5s-4.8 1.7-4.8 5v15.4h-7.2V30.4c0-7.2 4.5-12.2 12-12.2a11 11 0 0 1 8.4 3.2q3-3.1 8.4-3.2m45 0c7.5 0 12 5 12 12.2v14.8h-7.2V29.8c0-3.3-2-5-4.8-5s-4.7 1.7-4.7 5v15.4h-7.3V29.8c0-3.3-2-5-4.8-5s-4.8 1.7-4.8 5v15.4h-7.2V30.4c0-7.2 4.6-12.2 12-12.2a11 11 0 0 1 8.4 3.2q3-3.1 8.4-3.2m64 22.1c2.7 0 4.9 2.2 4.9 5h-9.7c0-2.8 2.2-5 4.8-5M573 7c1.5 0 3 .3 3.5.5v5.8h-2.2c-1.6 0-3.7.7-3.7 3.6v1.9h17.2v26.4h-7.2V25h-10v20.3h-7.2V25h-3.7v-6.1h3.7v-2c0-6 3.8-9.8 9.6-9.8m-24.5 11.5q1.4 0 2.4.3v6h-2.3c-3.8 0-6.7 2.7-6.7 7.2v13.2h-7.2V18.8h6.6V23c1-2.7 4.2-4.5 7.2-4.5m-31 5.4c-3.7 0-5.8 2.8-6 5.2h12.2c-.1-2.6-2-5.2-6.1-5.2M584 8.4c2.7 0 4.8 2.2 4.8 4.9h-9.6c0-2.7 2.1-5 4.8-5"
    />
    <path
      fill="#777576"
      d="M312.3 24.2c.5.6.5 1.6 0 2.2l-6 6 6 6a1.5 1.5 0 0 1-2.2 2l-6-6-6 6a1.5 1.5 0 1 1-2.1-2l6-6-6-6a1.5 1.5 0 0 1 2.1-2.2l6 6 6-6c.6-.6 1.6-.6 2.2 0"
    />
  </svg>
)

const DefiSaverXSummerFiBlock = () => {
  return (
    <SubLandingPageSection className={integrationsStyles.defiSaverSection}>
      <div className={integrationsStyles.defiSaverCard}>
        <div className={integrationsStyles.defiSaverTealOrb} />
        <div className={integrationsStyles.defiSaverPurpleOrb} />
        <div className={integrationsStyles.defiSaverLogosSection}>
          <div className={integrationsStyles.defiSaverLogos}>
            <DefiSaverXSummerFiLogo />
          </div>
        </div>
        <div className={integrationsStyles.defiSaverContent}>
          <div className={integrationsStyles.defiSaverTextGroup}>
            <Text as="p" variant="p3" className={integrationsStyles.featuredLabel}>
              Featured integration
            </Text>
            <Text as="p" variant="h4" className={integrationsStyles.defiSaverTitle}>
              DeFi Saver x Lazy Summer
            </Text>
            <Text as="p" variant="p2" className={integrationsStyles.mutedText}>
              See how DeFi Saver seamlessly enhanced their platform by integrating Lazy Summer
              vaults. By leveraging Lazy Summer infrastructure, they successfully deployed a native,
              &ldquo;set-and-forget&rdquo; yield product to their users.
            </Text>
          </div>
          <div className={integrationsStyles.defiSaverChecklist}>
            <CheckLine
              text={<span className={integrationsStyles.mutedText}>Turnkey product expansion</span>}
            />
            <CheckLine
              text={
                <span className={integrationsStyles.mutedText}>
                  Frictionless yield user journeys natively in-app
                </span>
              }
            />
            <CheckLine
              text={<span className={integrationsStyles.mutedText}>Reliability at scale</span>}
            />
          </div>
          <Link
            href="https://blog.summer.fi/automated-exposure-to-defis-highest-quality-yield-now-available-on-defi-saver/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondaryMedium" className={integrationsStyles.buttonAlignStart}>
              Learn more
            </Button>
          </Link>
        </div>
      </div>
    </SubLandingPageSection>
  )
}

const WaysToIntegrateIconSdk = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.25" y="3.25" width="13.5" height="11.5" rx="2" stroke="#BA5D8B" strokeWidth="1.5" />
    <line x1="2.75" y1="6.75" x2="15.25" y2="6.75" stroke="#BA5D8B" strokeWidth="1.5" />
    <circle cx="5" cy="5" r="0.75" fill="#BA5D8B" />
    <circle cx="7.5" cy="5" r="0.75" fill="#BA5D8B" />
  </svg>
)

const WaysToIntegrateIconContracts = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.5 5L4 9L6.5 13"
      stroke="#BA5D8B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.5 5L14 9L11.5 13"
      stroke="#BA5D8B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9.75 4L8.25 14" stroke="#BA5D8B" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const WaysToIntegrateIconThirdParty = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="2.5" width="13" height="13" rx="2" stroke="#BA5D8B" strokeWidth="1.5" />
    <path
      d="M6.5 9L8 10.5L11.5 7"
      stroke="#BA5D8B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const WaysToIntegrate = () => {
  const integrationCards = [
    {
      title: 'Using our SDK',
      description: 'Integrate directly into your app with our flexible SDK',
      ctas: [
        {
          label: 'Doc',
          url: 'https://summerfi.notion.site/summerfi-sdk-docs',
        },
      ],
      icon: <WaysToIntegrateIconSdk />,
    },
    {
      title: 'With Smart contracts',
      description: 'Crypto native apps interact directly with smart contract code',
      ctas: [
        {
          label: 'Github',
          url: 'https://github.com/OasisDEX/summer-earn-protocol',
        },
      ],
      icon: <WaysToIntegrateIconContracts />,
    },
    {
      title: '3rd Party SDKs',
      description: 'Fully integrated for teams using their service.',
      ctas: [
        {
          label: 'Yield.xyz',
          url: 'https://yield.xyz/',
        },
        {
          label: 'Enso',
          url: 'https://www.enso.build/',
        },
      ],
      icon: <WaysToIntegrateIconThirdParty />,
    },
  ]

  return (
    <div className={integrationsStyles.waysToIntegrate} id="ways-to-integrate">
      <Text variant="h2" className={integrationsStyles.waysToIntegrateTitle}>
        3 ways to integrate
      </Text>
      <div className={integrationsStyles.waysToIntegrateGrid}>
        {integrationCards.map(({ title, description, ctas, icon }) => (
          <div key={title} className={integrationsStyles.waysToIntegrateCard}>
            <div className={integrationsStyles.waysToIntegrateIconBadge}>{icon}</div>
            <div className={integrationsStyles.waysToIntegrateCardBody}>
              <Text as="p" variant="h5" className={integrationsStyles.waysToIntegrateCardTitle}>
                {title}
              </Text>
              <Text
                as="p"
                variant="p2"
                className={integrationsStyles.waysToIntegrateCardDescription}
              >
                {description}
              </Text>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '8px',
              }}
            >
              {ctas.map(({ label, url }) => (
                <Link
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={integrationsStyles.waysToIntegrateCta}
                >
                  <Text
                    as="span"
                    variant="p3"
                    className={integrationsStyles.waysToIntegrateCtaLabel}
                  >
                    {label}
                  </Text>
                  <span className={integrationsStyles.waysToIntegrateCtaArrow} aria-hidden>
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const HandsOnSupport = () => {
  const smoothScrollToId = (id: string) => {
    const element = document.getElementById(id)

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
  const handleScrollToContactForm = () => {
    smoothScrollToId('contact-form')
    EarnProtocolEvents.buttonClicked({
      buttonName: 'lp-view-permissioned-vaults-contact-form',
      page: '/',
    })
  }

  return (
    <div className={integrationsStyles.handsOnSupport}>
      <div className={integrationsStyles.handsOnSupportCard}>
        <div className={integrationsStyles.handsOnSupportGlowTop} />
        <div className={integrationsStyles.handsOnSupportGlowBottom} />
        <div className={integrationsStyles.handsOnSupportContent}>
          <div className={integrationsStyles.handsOnSupportText}>
            <Text as="p" variant="h4" className={integrationsStyles.handsOnSupportTitle}>
              Hands on technical support
            </Text>
            <Text as="p" variant="p2" className={integrationsStyles.mutedText}>
              Our SDK is fully self serve, though our team provides direct, one-on-one support every
              step of the way, should you need it.
            </Text>
          </div>
          <Button
            variant="secondaryMedium"
            className={integrationsStyles.handsOnSupportButton}
            onClick={handleScrollToContactForm}
          >
            Get in touch
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Integrations() {
  const smoothScrollToId = (id: string) => {
    const element = document.getElementById(id)

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
  const pathname = usePathname()
  const handleAuditClick = (auditId: string) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-integrations-audit-${auditId}-learn-more`,
      page: pathname,
    })
  }

  const handleScrollToFormsToIntegrate = () => {
    smoothScrollToId('ways-to-integrate')
    EarnProtocolEvents.buttonClicked({
      buttonName: 'lp-view-permissioned-vaults-contact-form',
      page: '/',
    })
  }
  const handleScrollToContactForm = () => {
    smoothScrollToId('contact-form')
    EarnProtocolEvents.buttonClicked({
      buttonName: 'lp-view-permissioned-vaults-contact-form',
      page: '/',
    })
  }

  return (
    <>
      <HeroWrapper className={integrationsStyles.heroWrapper} large>
        <div className={integrationsStyles.heroBackground}>
          <FractalGlassBackground skewed />
        </div>
        <div className={integrationsStyles.heroContent}>
          <div className={integrationsStyles.heroTextColumn}>
            <TagButton>Integration</TagButton>
            <Text variant="h1">
              <Emphasis variant="h1colorful">One integration</Emphasis> to give your users the best
              of DeFi.
            </Text>
            <Text variant="p1" className={integrationsStyles.heroDescription}>
              The Summer.fi institutional Private access RWA vault gives forward thinking
              institutions automated access to DeFi&lsquo;s highest quality yield sources designed
              for qualified investors.
            </Text>
            <div className={integrationsStyles.heroButtons}>
              <Button variant="primaryMedium" onClick={handleScrollToFormsToIntegrate}>
                Integrate now
              </Button>
              <Button variant="secondaryMedium" onClick={handleScrollToContactForm}>
                Get in touch
              </Button>
            </div>
          </div>

          <Image
            alt="screenshot of the sdk showing a self managed vault integration"
            src={sdkScreenshot}
            loading="eager"
          />
        </div>
      </HeroWrapper>
      <SubLandingPageSection
        className={`${integrationsStyles.subLandingPageSection} ${integrationsStyles.cardSection}`}
      >
        <div className={integrationsStyles.card}>
          <Image
            alt="background lines"
            src={ourProductsLinesBackground}
            loading="eager"
            className={integrationsStyles.linesBackground}
          />
          <div className={integrationsStyles.backgroundOrb} />
          <div className={integrationsStyles.cardContent}>
            <div className={integrationsStyles.iconBadge}>
              <Icon iconName="chart" size={18} className={integrationsStyles.icon} />
            </div>
            <Text variant="h4">Delight your yield-hungry users</Text>
            <Text
              variant="p2"
              className={`${integrationsStyles.subSectionTextSecondary} ${integrationsStyles.cardSubtitle}`}
            >
              Transform complex onchain mechanics into a frictionless earning experience. By
              integrating Lazy Summer vault infrastructure, you can offer your users instant access
              to DeFi’s highest-quality, risk-adjusted yields. Lazy Summer abstracts away the heavy
              lifting - from gas optimization to continuous rebalancing - so you can focus on
              driving TVL and keeping your users engaged with minimal effort.
            </Text>
            <div
              className={`${integrationsStyles.iconColumn} ${integrationsStyles.cardIconColumnWide}`}
            >
              <CheckLine text="Unrestricted deep liquidity: Seamlessly route user funds into robust, highly liquid protocols, ensuring smooth entry and exit at any scale without heavy slippage." />
              <CheckLine text="Automated risk management: Keep your users protected and profitable with battle-tested strategies that are continuously monitored and optimized for the safest, highest APYs." />
              <CheckLine text="One-transaction native UX: Abstract away the friction of DeFi. Let your users deploy capital directly within your own interface without worrying about multiple transactions, gas fees, or protocol interactions." />
            </div>
          </div>
        </div>
        <div className={integrationsStyles.card}>
          <Image
            alt="background lines"
            src={ourProductsLinesBackground}
            loading="eager"
            className={`${integrationsStyles.linesBackground} ${integrationsStyles.linesBackgroundSecondBlock}`}
          />
          <div className={integrationsStyles.backgroundOrb} />
          <div className={integrationsStyles.cardContent}>
            <div className={integrationsStyles.iconBadge}>
              <Icon iconName="shield_check" size={18} className={integrationsStyles.icon} />
            </div>
            <Text variant="h4">Automated Access to DeFi’s Best Yields</Text>
            <Text
              variant="p2"
              className={`${integrationsStyles.subSectionTextSecondary} ${integrationsStyles.cardSubtitle}`}
            >
              Turn your app into a yield-generating powerhouse. By integrating Lazy Summer’s
              automated infrastructure, you can effortlessly offer the premium, set-and-forget
              earning opportunities your users demand - driving higher TVL and boosting retention.
            </Text>
            <div className={integrationsStyles.featureGrid}>
              <div className={integrationsStyles.featureItem}>
                <Text variant="p1semi">Drive user retention</Text>
                <Text variant="p2" className={integrationsStyles.mutedText}>
                  Prevent capital flight. Keep liquidity on your platform by offering competitive,
                  hands-off yield generation.
                </Text>
              </div>
              <div className={integrationsStyles.featureItem}>
                <Text variant="p1semi">Frictionless user journeys</Text>
                <Text variant="p2" className={integrationsStyles.mutedText}>
                  Eliminate gas headaches and multi-step wallet approvals for your users with
                  seamless, automated deposits.
                </Text>
              </div>
              <div className={integrationsStyles.featureItem}>
                <Text variant="p1semi">Minimal ongoing maintenance</Text>
                <Text variant="p2" className={integrationsStyles.mutedText}>
                  Summer.fi constantly monitors, upgrades, and optimizes the underlying protocol
                  connections, freeing up your engineering resources.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </SubLandingPageSection>
      <SubLandingPageSection className={integrationsStyles.additionalBenefitsSection}>
        <Text variant="p1semi" className={integrationsStyles.additionalBenefitsLabel}>
          Additional benefits
        </Text>
        <div className={integrationsStyles.additionalBenefitsRow}>
          <div
            className={`${integrationsStyles.benefitColumn} ${integrationsStyles.benefitColumnLeft}`}
          >
            <Text variant="p3colorful">01.</Text>
            <Text variant="h4">Quick & Easy Integration</Text>
            <Text variant="p2" className={integrationsStyles.mutedText}>
              Skip the steep learning curve, the developer-first SDK are designed for rapid,
              seamless implementation. Enable powerful DeFi yield strategies directly into your
              existing architecture in a fraction of the time, allowing your engineering team to
              stay focused on your core product.
            </Text>
            <CheckLine text="Clean architecture and comprehensive documentation." />
          </div>
          <div
            className={`${integrationsStyles.benefitColumn} ${integrationsStyles.benefitColumnRight}`}
          >
            <Text variant="p3colorful">02.</Text>
            <Text variant="h4">Big ROI: Built-In Revenue Mechanics with compliance</Text>
            <Text variant="p2" className={integrationsStyles.mutedText}>
              Turn your platform’s liquidity into a sustainable business model. Lazy Summer
              infrastructure allows you to seamlessly configure fee-sharing mechanics and monetize
              the yield your users generate.{' '}
            </Text>
            <CheckLine text="Easily configure your own take rates, spreads, or performance fees directly within the integration." />
          </div>
        </div>
      </SubLandingPageSection>
      <DefiSaverXSummerFiBlock />
      <SubLandingPageSection>
        <WaysToIntegrate />
      </SubLandingPageSection>
      <SubLandingPageSection>
        <Audits
          fullWidth
          chainSecurityLogo={chainSecurityLogo}
          prototechLabsLogo={prototechLabsLogo}
          sherlockLogo={sherlockLogo}
          onAuditClick={handleAuditClick}
        />
      </SubLandingPageSection>
      <SubLandingPageSection>
        <HandsOnSupport />
      </SubLandingPageSection>
      <LandingPageContactForm formType="integrations" />
      <div className={integrationsStyles.faqWrapper}>
        <LandingIntegrationsFaqSection />
      </div>
    </>
  )
}
