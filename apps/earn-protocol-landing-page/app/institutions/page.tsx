'use client'
import { Audits, Button, Emphasis, FaqSection, Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type IconNamesList } from '@summerfi/app-types'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { BuildBySummerFi } from '@/components/layout/LandingPageContent/content/BuildBySummerFi'
import { useLandingPageData } from '@/contexts/LandingPageContext'
import { InstitutionsPromoBlock } from '@/features/institutions/components/InstitutionsPromoBlock/InstitutionsPromoBlock'
import chainSecurityLogo from '@/public/img/landing-page/auditor-logos/chainsecurity.svg'
import prototechLabsLogo from '@/public/img/landing-page/auditor-logos/prototech-labs.svg'

import institutionsPageStyles from './institutionsPage.module.css'

import depositUiImage from '@/public/img/institution/deposit-ui.png'
import securityAndComplianceImage from '@/public/img/institution/security-and-compliance.png'

const FinalCTAElement = ({
  title,
  icon,
  url,
  urlLabel,
}: {
  title: string
  icon: IconNamesList
  url: string
  urlLabel: string
}) => {
  return (
    <div className={institutionsPageStyles.finalCTAElement}>
      <Icon iconName={icon} size={32} />
      <Text variant="p2semi" as="p">
        {title}
      </Text>
      <Link href={url} prefetch={false}>
        <WithArrow variant="p2semi">{urlLabel}</WithArrow>
      </Link>
    </div>
  )
}

const SecurityAndComplianceList = ({ items }: { items: string[] }) => {
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

  const institutionsEnabled = landingPageData?.systemConfig.features.Institutions

  if (institutionsEnabled === false) {
    redirect('/')
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
          <Button variant="primaryLargeColorful">
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
      <div className={institutionsPageStyles.promoBlocks}>
        <InstitutionsPromoBlock
          title="Self managed Vaults"
          description="Institutional-grade access to DeFi—fully customizable, fully compliant, and composable by design."
          bestFor="Banks, Hedge funds and Asset managers"
          coreFeatures={[
            'Ring-fence deposits to pre-approved addresses; zero mingling.',
            'Separately Managed Accounts (SMA)',
            'Fully customizable yield sources and venues',
            'Daily NAV file (CSV / XML)',
            'Simple SDK ready integration',
            '24-h exit guarantee',
          ]}
        />
        <InstitutionsPromoBlock
          title="Large Capital deployment into Public Access Vaults"
          description="Effortless access to crypto’s  best DeFi yields. Continually rebalanced by AI powered Keepers to earn you more while saving you time and costs."
          bestFor="Banks, Hedge funds and Asset managers"
          coreFeatures={[
            'Best in class risk adjusted yield',
            'Separately Managed Accounts (SMA)',
            'SUMR rewards stream block-by-block',
            'Built-in diversification across venues',
            '24-h exit guarantee',
          ]}
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
          <Button variant="primaryLarge">Set up a call</Button>
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
            'Headquartered in the U.K. . with a Bankruptcy-Remote Trust Structure',
            'Assets are managed and segregated by established service providers',
            'Available to Qualified Purchasers in supported jurisdiction',
            'Minimize counterparty risk with a customizable whielists',
          ]}
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
            url=""
            urlLabel="Schedule call"
          />
          <FinalCTAElement
            icon="earn_yield_trend"
            title="Self serve vault deposit with Summer.fi dashboard"
            url=""
            urlLabel="Deposit now"
          />
          <FinalCTAElement
            icon="earn_user_activities"
            title="Integration docs for Fireblocks, Anchorage and Gnosis Safe"
            url=""
            urlLabel="Download docs"
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
            title: 'Our SDK is designed for simplicity—most developers can integrate within hours?',
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
