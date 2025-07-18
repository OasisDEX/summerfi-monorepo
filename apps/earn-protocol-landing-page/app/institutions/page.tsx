'use client'
import {
  Audits,
  Button,
  Emphasis,
  EnhancedRiskManagement,
  EXTERNAL_LINKS,
  FaqSection,
  Icon,
  INTERNAL_LINKS,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import Image from 'next/image'
import Link from 'next/link'

import { FinalCTAElement } from '@/components/layout/LandingPageContent/components/InstitutionsFinalCTA'
import { BuildBySummerFi } from '@/components/layout/LandingPageContent/content/BuildBySummerFi'
import { useLandingPageData } from '@/contexts/LandingPageContext'
import { InstitutionsPromoBlock } from '@/features/institutions/components/InstitutionsPromoBlock/InstitutionsPromoBlock'
import { useFeatureFlagRedirect } from '@/hooks/use-feature-flag'
import chainSecurityLogo from '@/public/img/landing-page/auditor-logos/chainsecurity.svg'
import prototechLabsLogo from '@/public/img/landing-page/auditor-logos/prototech-labs.svg'
import blockAnalyticaLogo from '@/public/img/landing-page/block-analytica.svg'
import aaveLogo from '@/public/img/landing-page/protocols/aave.svg'
import morphoBlueLogo from '@/public/img/landing-page/protocols/morpho-blue.svg'
import skyLogo from '@/public/img/landing-page/protocols/sky.svg'
import sparkLogo from '@/public/img/landing-page/protocols/spark.svg'

import institutionsPageStyles from './institutionsPage.module.css'

import depositUiImage from '@/public/img/institution/deposit-ui.png'
import securityAndComplianceImage from '@/public/img/institution/security-and-compliance.png'
import rebalanceActivityImage from '@/public/img/landing-page/enhanced-risk-management_rebalance-activity.png'
import strategyExposureImage from '@/public/img/landing-page/enhanced-risk-management_strategy-exposure.png'

export const SecurityAndComplianceList = ({ items }: { items: string[] }) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={`security-compliance-item-${item}`}>
          <Icon iconName="checkmark_colorful" size={14} />
          <Text variant="p1" as="p">
            {item}
          </Text>
        </li>
      ))}
    </ul>
  )
}

export default function InstitutionsPage() {
  const { landingPageData } = useLandingPageData()

  useFeatureFlagRedirect({
    config: landingPageData?.systemConfig,
    featureName: 'Institutions',
  })

  const smoothScrollToId = (id: string) => () => {
    const element = document.getElementById(id)

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className={institutionsPageStyles.wrapper}>
      <div className={institutionsPageStyles.pageHeader}>
        <Text as="h1" variant="h1">
          Crypto native yield, built for
          <br />
          <Emphasis variant="h1colorful">forward thinking institutions</Emphasis>
        </Text>
        <div className={institutionsPageStyles.pageHeaderDetails}>
          <Text as="p" variant="p1semi">
            Institutional access to the DeFi ecosystem for advanced use cases and full control.
          </Text>
          <Text as="span" variant="p1">
            Lazy Summer Protocol gives professional allocators a single entry point to on-chain
            yield. Institutions can now access DeFi’s highest quality protocols, all in one.
          </Text>
          <Button variant="primaryLargeColorful" onClick={smoothScrollToId('institutions-cta')}>
            <WithArrow variant="p2semi">Get started</WithArrow>
          </Button>
        </div>
      </div>
      <div className={institutionsPageStyles.pageSubHeader}>
        <Text as="h2" variant="h2">
          DeFi’s Highest-Quality Strategies&nbsp;
          <Emphasis variant="h2colorful">-&nbsp;on your terms.</Emphasis>
        </Text>
        <Text as="p" variant="p1">
          Effortless access to crypto’s best DeFi protocols, via closed access, fully customizable
          vaults or public access optimized for scale and best in class risk adjusted return.
        </Text>
      </div>
      <div className={institutionsPageStyles.promoBlocks} id="institutions-cta">
        <InstitutionsPromoBlock
          title="Self managed Vaults"
          description="Institutional-grade vault infrastructure to access the best of DeFi - fully customizable, inherently composable, and built for future compliance and regulatory needs."
          bestFor="Banks, Hedge funds, Centralized exchanges and Asset managers"
          coreFeatures={[
            'Ring-fence deposits to pre-approved addresses; zero mingling.',
            'Separately Managed Accounts (SMA)',
            'Option for third party risk management by Block Analitica ',
            'Fully customizable yield sources and venues',
            'Daily NAV file (CSV / XML)',
            'Simple SDK ready integration',
            '24-h exit guarantee',
          ]}
          ctaUrl="/institutions/self-managed-vaults"
          secondaryCtaUrl={EXTERNAL_LINKS.BD_CONTACT}
          secondaryCtaLabel="Speak with a specialist"
        />
        <InstitutionsPromoBlock
          title="Large capital deployment into public access vaults"
          description="Effortless access to crypto’s best DeFi yields. Continually rebalanced by AI powered Keepers to earn you more while saving you time and costs."
          bestFor="Crypto native funds, Family offices, and Large individual allocators"
          coreFeatures={[
            'Best in class risk adjusted yield',
            'Built-in third party risk management by Block Analitica ',
            'SUMR rewards stream block-by-block',
            'Built-in diversification across venues',
            '24-h exit guarantee',
          ]}
          ctaUrl="/institutions/public-access-vaults"
        />
      </div>
      <div className={institutionsPageStyles.onboardingBlock}>
        <div>
          <Text as="h2" variant="h2">
            Stress-free onboarding & hands on Support
          </Text>
          <Text as="p" variant="p1">
            Get started quickly with our streamlined, self serve onboarding process or our hands on
            technical support for custom integrations.
          </Text>
          <Link href={EXTERNAL_LINKS.BD_CONTACT} target="_blank">
            <Button variant="primaryLarge">Set up a call</Button>
          </Link>
        </div>
        <div>
          <Image src={depositUiImage} alt="Deposit UI" />
        </div>
      </div>
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
      <div className={institutionsPageStyles.securityAndComplianceBlock}>
        <Image src={securityAndComplianceImage} alt="Security and Compliance" />
        <SecurityAndComplianceList
          items={[
            'Assets are fully self custodial with your preffered wallet solution ',
            'Assets are managed and segregated by established service providers',
            'Available to Qualified Purchasers in supported jurisdiction',
            'Minimize counterparty risk with a customizable whitelists',
          ]}
        />
      </div>
      <div className={institutionsPageStyles.enhancedRiskManagementBlock}>
        <EnhancedRiskManagement
          protectedCapital="$10B+"
          imagesMap={{
            rebalanceActivityImage,
            strategyExposureImage,
            blockAnalyticaLogo,
            aaveLogo,
            morphoBlueLogo,
            skyLogo,
            sparkLogo,
          }}
          bottomBoxes={false}
        />
      </div>
      <Audits chainSecurityLogo={chainSecurityLogo} prototechLabsLogo={prototechLabsLogo} />
      <div className={institutionsPageStyles.buildBySummerSpacer}>
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
        <BuildBySummerFi proAppStats={landingPageData?.proAppStats} />
      </div>
      <div className={institutionsPageStyles.finalCTAs}>
        <Text as="h2" variant="h2">
          Ready to get institutional grade DeFi?
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
        wrapperClassName={institutionsPageStyles.faqWrapper}
        expanderButtonStyles={{
          padding: 'var(--spacing-space-large) 0',
        }}
        data={[
          {
            title: 'How quickly can I integrate Lazy Summer Protocol?',
            content: (
              <Text variant="p1" as="p">
                Very quickly! Our SDK is designed for simplicity, allowing most developers to
                integrate within hours. We also offer hands-on support for custom integrations.
              </Text>
            ),
          },
          {
            title:
              'Our SDK is designed for simplicity - most developers can integrate within hours?',
            content: (
              <Text variant="p1" as="p">
                Yes, our SDK is designed for simplicity, allowing most developers to integrate
                within hours. We also offer hands-on support for custom integrations.
              </Text>
            ),
          },
          {
            title: 'Can I customize fees or revenue shares?',
            content: (
              <Text variant="p1" as="p">
                Yes, Lazy Summer Protocol allows you to customize fees and revenue shares to suit
                your institutional needs. You can set up your own fee structure and revenue sharing
                model.
              </Text>
            ),
          },
        ]}
      />
    </div>
  )
}
