'use client'
import { Audits, Emphasis, Text, UseCasesSlider } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import {
  BuildOwnOnchainVaultImage,
  SelfManagedVaultsBox1Background,
  SelfManagedVaultsBox2Background,
} from '@/app/build-your-own-vault/background'
import { TagButton } from '@/components/atoms/TagButton'
import { HeroWrapper } from '@/components/layout/HeroWrapper/HeroWrapper'
import { CheckLine } from '@/components/layout/LandingPageContent/components/CheckLine'
import { BuildBySummerFiPlain } from '@/components/layout/LandingPageContent/content/BuildBySummerFi'
import { LandingSelfManagedVaultFaqSection } from '@/components/layout/LandingPageContent/content/LandingFaqSection'
import { SubLandingPageSection } from '@/components/layout/SubLandingPageSection/SubLandingPageSection'
import { FractalGlassBackground } from '@/components/molecules/FractalGlassBackground/FractalGlassBackground'
import { LandingPageContactForm } from '@/components/organisms/LandingPageContactForm/LandingPageContactForm'
import { EarnProtocolEvents } from '@/helpers/mixpanel'
import chainSecurityLogo from '@/public/img/landing-page/auditor-logos/chainsecurity.svg'
import prototechLabsLogo from '@/public/img/landing-page/auditor-logos/prototech-labs.svg'
import sherlockLogo from '@/public/img/landing-page/auditor-logos/sherlock.svg'

import selfManagedVaultsStyles from './SelfManagedVaults.module.css'

import ourProductsLinesBackground from '@/public/img/landing-page/our-products-lines-bg.png'
import franklinTempletonMarketLogo from '@/public/img/landing-page/private-markets/franklin_templeton.png'
import mapleMarketLogo from '@/public/img/landing-page/private-markets/maple.png'
import securitizeMarketLogo from '@/public/img/landing-page/private-markets/securitize.png'
// import stacMarketLogo from '@/public/img/landing-page/private-markets/stac.png'
import superstateMarketLogo from '@/public/img/landing-page/private-markets/superstate.png'
import sdkScreenshot from '@/public/img/landing-page/sdk-screenshot.png'
// import wisdomTreeMarketLogo from '@/public/img/landing-page/private-markets/wisdomtree.png'
import selfManagedVaultScreenshot from '@/public/img/landing-page/self-managed-vault-screenshot.png'

export default function SelfManagedVaults() {
  const pathname = usePathname()
  const handleAuditClick = (auditId: string) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-build-your-own-vault-audit-${auditId}-learn-more`,
      page: pathname,
    })
  }

  return (
    <>
      <HeroWrapper larger className={selfManagedVaultsStyles.heroWrapper}>
        <div className={selfManagedVaultsStyles.heroBackground}>
          <FractalGlassBackground skewed />
        </div>
        <div className={selfManagedVaultsStyles.heroContent}>
          <TagButton>Build Your Own Vault</TagButton>
          <Text variant="h1">
            <Emphasis variant="h1colorful">Unlimited access to DeFi yield,</Emphasis> built for
            forward thinking institutions
          </Text>
          <Text variant="p1" className={selfManagedVaultsStyles.heroParagraph}>
            Summer.fi enables institutions to build their own custom vaults. Get unlimited access to
            DeFi and RWA yields from across the Ethereum ecosystem, while meeting every compliance
            and regulatory need.
          </Text>
          <Image
            alt="screenshot of the build Your vaults product"
            src={selfManagedVaultScreenshot}
            className={selfManagedVaultsStyles.selfManagedVaultScreenshotWrapper}
          />
        </div>
      </HeroWrapper>
      <SubLandingPageSection>
        <div className={selfManagedVaultsStyles.introCardsRow}>
          <div className={selfManagedVaultsStyles.introCard}>
            <SelfManagedVaultsBox1Background />
            <Text variant="h4">Build your own onchain yield vault in weeks not years</Text>
            <Text variant="p1" className={selfManagedVaultsStyles.introCardParagraph}>
              Bypass years of complex smart contract development and expensive DeFi Teams. Our
              plug-and-play architecture empowers you to launch secure, bespoke yield products for
              your own capital, or on the behalf of your users.
            </Text>
            <BuildOwnOnchainVaultImage />
          </div>
          <div className={selfManagedVaultsStyles.introCard}>
            <SelfManagedVaultsBox2Background />
            <Text variant="h4">One integration for all of crypto&apos;s onchain yield</Text>
            <Text variant="p1" className={selfManagedVaultsStyles.introCardParagraph}>
              Eliminate the massive overhead of managing dozens of protocol connections. Simply
              choose your yield sources, set your risk strategy and access policy and Summer.fi does
              the rest.
            </Text>
            <div className={selfManagedVaultsStyles.marketLogosGrid}>
              <Image alt="Securitize" src={securitizeMarketLogo} width={155} height={26} />
              <Image alt="Maple" src={mapleMarketLogo} width={114} height={36} />
              <Image alt="Superstate" src={superstateMarketLogo} width={163} height={23} />
              <Image
                alt="Franklin Templeton"
                src={franklinTempletonMarketLogo}
                width={153}
                height={30}
              />
            </div>
          </div>
        </div>
      </SubLandingPageSection>
      <SubLandingPageSection
        className={`${selfManagedVaultsStyles.subLandingPageSection} ${selfManagedVaultsStyles.cardSection}`}
      >
        <div className={selfManagedVaultsStyles.card}>
          <Image
            alt="background lines"
            src={ourProductsLinesBackground}
            loading="eager"
            className={selfManagedVaultsStyles.linesBackground}
          />
          <div className={selfManagedVaultsStyles.backgroundOrb} />
          <div className={selfManagedVaultsStyles.cardContent}>
            <div className={selfManagedVaultsStyles.iconBadge}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 22V18H15V22M8 6H8.01M16 6H16.01M12 6H12.01M12 10H12.01M12 14H12.01M16 10H16.01M16 14H16.01M8 10H8.01M8 14H8.01M6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z"
                  stroke="#BA5D8B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Text variant="h4">Institutional-grade automation, whatever your structure</Text>
            <Text
              variant="p2"
              className={`${selfManagedVaultsStyles.subSectionTextSecondary} ${selfManagedVaultsStyles.cardSubtitle}`}
            >
              Design bespoke policy-driven yield strategies that automatically enforce your firm’s
              specific diversification rules, exposure caps, and asset mandates.
            </Text>
            <div className={selfManagedVaultsStyles.iconGrid}>
              <CheckLine text="AI enabled keeper agents continuously monitor markets and reallocate capital when your custom thresholds are met." />
              <CheckLine text="Create fully customizable rules for eligible assets, EVM chains, and trusted venues." />
              <CheckLine text="Eliminate manual operations and bridge friction with automated, internally defined diversification rules." />
            </div>
          </div>
        </div>
        <div className={selfManagedVaultsStyles.card}>
          <Image
            alt="background lines"
            src={ourProductsLinesBackground}
            className={`${selfManagedVaultsStyles.linesBackground} ${selfManagedVaultsStyles.linesBackgroundSecondBlock}`}
          />
          <div className={selfManagedVaultsStyles.backgroundOrb} />
          <div className={selfManagedVaultsStyles.cardContent}>
            <div className={selfManagedVaultsStyles.iconBadge}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M2.06251 12.3474C1.97916 12.1229 1.97916 11.8759 2.06251 11.6514C2.87421 9.68324 4.25202 8.00042 6.02128 6.81628C7.79053 5.63214 9.87155 5 12.0005 5C14.1295 5 16.2105 5.63214 17.9797 6.81628C19.749 8.00042 21.1268 9.68324 21.9385 11.6514C22.0218 11.8759 22.0218 12.1229 21.9385 12.3474C21.1268 14.3155 19.749 15.9983 17.9797 17.1825C16.2105 18.3666 14.1295 18.9988 12.0005 18.9988C9.87155 18.9988 7.79053 18.3666 6.02128 17.1825C4.25202 15.9983 2.87421 14.3155 2.06251 12.3474Z"
                  stroke="#BA5D8B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.0005 14.9994C13.6574 14.9994 15.0005 13.6562 15.0005 11.9994C15.0005 10.3425 13.6574 8.99938 12.0005 8.99938C10.3437 8.99938 9.00051 10.3425 9.00051 11.9994C9.00051 13.6562 10.3437 14.9994 12.0005 14.9994Z"
                  stroke="#BA5D8B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Text variant="h4">Transparent flows & on demand risk oversight</Text>
            <Text
              variant="p2"
              className={`${selfManagedVaultsStyles.subSectionTextSecondary} ${selfManagedVaultsStyles.cardSubtitle}`}
            >
              Maintain absolute control over your capital with closed, ring-fenced vaults that
              prevent co-mingling and integrate seamlessly with your preferred custody providers.
            </Text>
            <CheckLine text="Delegate independent risk oversight to Block Analitica or utilize your own in-house risk teams." />
            <CheckLine text="Ensure compliance with whitelist-only access and fully segregated, non-custodial architecture." />
            <CheckLine text="Streamline back-office operations with audit-ready transaction logs and daily NAV reporting." />
          </div>
        </div>
        <div className={selfManagedVaultsStyles.card}>
          <Image
            alt="background lines"
            src={ourProductsLinesBackground}
            className={`${selfManagedVaultsStyles.linesBackground} ${selfManagedVaultsStyles.linesBackgroundSecondBlock}`}
          />
          <div className={selfManagedVaultsStyles.backgroundOrb} />
          <div className={selfManagedVaultsStyles.cardContent}>
            <div className={selfManagedVaultsStyles.iconBadge}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
                  stroke="#BA5D8B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Text variant="h4">Create an additional revenue stream for your business</Text>
            <Text
              variant="p2"
              className={`${selfManagedVaultsStyles.subSectionTextSecondary} ${selfManagedVaultsStyles.cardSubtitle}`}
            >
              Unlock the hidden revenue potential of your treasury. Safely deploy idle assets into
              institutional-grade, yield-generating environments without sacrificing liquidity or
              security.
            </Text>
            <CheckLine text="Choose from a management or performance fee, or a mixture of both." />
            <CheckLine text="Automatically earn on all deposits block by block. No monthly invoicing or calculations needed." />
            <CheckLine text="Full onchain transparancy of fees at all times to put your customers at ease." />
          </div>
        </div>
      </SubLandingPageSection>
      <UseCasesSlider />
      <SubLandingPageSection>
        <div className={selfManagedVaultsStyles.sdkSection}>
          <div className={selfManagedVaultsStyles.sdkTextColumn}>
            <Text variant="h3">Simple integration into your app or product </Text>
            <Text variant="p2" className={selfManagedVaultsStyles.sdkDescription}>
              All custom Vaults come ready supported within the Summer SDK so you can quickly and
              easily add your Vaults to your app or products. The SDK supports the full
              functionality of the Vault, including deposit and withdrawal actions as well as all
              live and historical data including rebalances.
            </Text>
          </div>
          <Image
            alt="screenshot of the sdk showing a build Your vault integration"
            src={sdkScreenshot}
          />
        </div>
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
      <LandingPageContactForm formType="own-vault" />
      <SubLandingPageSection className={selfManagedVaultsStyles.buildBySection}>
        <BuildBySummerFiPlain />
      </SubLandingPageSection>
      <div className={selfManagedVaultsStyles.faqWrapper}>
        <LandingSelfManagedVaultFaqSection />
      </div>
    </>
  )
}
