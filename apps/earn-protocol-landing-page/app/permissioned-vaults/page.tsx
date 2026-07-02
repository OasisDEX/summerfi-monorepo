'use client'
import { Audits, Button, Emphasis, Icon, Text, UseCasesSlider } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { TagButton } from '@/components/atoms/TagButton'
import { HeroWrapper } from '@/components/layout/HeroWrapper/HeroWrapper'
import { CheckLine } from '@/components/layout/LandingPageContent/components/CheckLine'
import { BuildBySummerFiPlain } from '@/components/layout/LandingPageContent/content/BuildBySummerFi'
import { LandingRwaFaqSection } from '@/components/layout/LandingPageContent/content/LandingFaqSection'
import { SubLandingPageSection } from '@/components/layout/SubLandingPageSection/SubLandingPageSection'
import { FractalGlassBackground } from '@/components/molecules/FractalGlassBackground/FractalGlassBackground'
import { LandingPageContactForm } from '@/components/organisms/LandingPageContactForm/LandingPageContactForm'
import { EarnProtocolEvents } from '@/helpers/mixpanel'
import chainSecurityLogo from '@/public/img/landing-page/auditor-logos/chainsecurity.svg'
import prototechLabsLogo from '@/public/img/landing-page/auditor-logos/prototech-labs.svg'
import sherlockLogo from '@/public/img/landing-page/auditor-logos/sherlock.svg'
import avantgardeLogo from '@/public/img/landing-page/private-markets/avantgarde.svg'
import balanceLogo from '@/public/img/landing-page/private-markets/logo_balance.svg'
import summerLogo from '@/public/img/landing-page/private-markets/logo_summer.svg'
import utilaLogo from '@/public/img/landing-page/private-markets/logo_utila.svg'

import rwaVaultsStyles from './RwaVaults.module.css'

import ourProductsLinesBackground from '@/public/img/landing-page/our-products-lines-bg.png'
import apolloMarketLogo from '@/public/img/landing-page/private-markets/apollo.png'
import mapleMarketLogo from '@/public/img/landing-page/private-markets/maple.png'
import stacMarketLogo from '@/public/img/landing-page/private-markets/stac.png'
import superstateMarketLogo from '@/public/img/landing-page/private-markets/superstate.png'
import vaneckMarketLogo from '@/public/img/landing-page/private-markets/vaneck.png'
import wisdomTreeMarketLogo from '@/public/img/landing-page/private-markets/wisdomtree.png'
import vaultExposureInstiScreenshot from '@/public/img/landing-page/vault-exposure-screenshot-insti.png'

export default function RwaVaults() {
  const smoothScrollToId = (id: string) => {
    const element = document.getElementById(id)

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  const pathname = usePathname()
  const handleAuditClick = (auditId: string) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-permissioned-vaults-audit-${auditId}-learn-more`,
      page: pathname,
    })
  }

  const handleScrollToForm = () => {
    smoothScrollToId('contact-form')
    EarnProtocolEvents.buttonClicked({
      buttonName: 'lp-view-permissioned-vaults-contact-form',
      page: '/',
    })
  }

  return (
    <>
      <HeroWrapper className={rwaVaultsStyles.heroWrapper}>
        <div className={rwaVaultsStyles.heroBackground}>
          <FractalGlassBackground />
        </div>
        <div className={rwaVaultsStyles.heroContent}>
          <TagButton>Permissioned RWA Vault</TagButton>
          <Text variant="h1">
            <Emphasis variant="h1colorful">Institutional grade onchain yield.</Emphasis> Private,
            diversified and automated.
          </Text>
          <Text variant="p1" className={rwaVaultsStyles.heroParagraph}>
            The Summer.fi Strategically Allocated RWA Vault, curated by Avantgarde, gives automated
            access to the highest quality RWA’s and private markets, designed exclusively for
            accredited and qualified investors, institutions and funds.
          </Text>
          <div className={rwaVaultsStyles.heroButtons}>
            {/* <Button variant="primaryMedium">View Vault</Button> */}
            <Button variant="secondaryMedium" onClick={() => handleScrollToForm()}>
              Get in touch
            </Button>
          </div>
        </div>
      </HeroWrapper>
      <SubLandingPageSection className={rwaVaultsStyles.subLandingPageSection}>
        <div className={rwaVaultsStyles.subSectionColumn}>
          <Text variant="h3">Earn directly from the highest quality RWA’s and private markets</Text>
          <Text variant="p2" className={rwaVaultsStyles.subSectionTextSecondary}>
            This new Vault concept allows approved depositors to earn directly from the leading
            tokenized assets and private credit markets on Ethereum, all from a single Vault with no
            additional KYC when accessing through an approved custodian or MPC provider. The Vault
            automatically allocates towards a set target of assets, which is periodically adjusted
            by the Vault curator, Avantgarde, to achieve a strong, diversified yield.
          </Text>
          <div className={rwaVaultsStyles.partnerLogos}>
            <Image alt="Vaneck" src={vaneckMarketLogo} className={rwaVaultsStyles.partnerLogo} />
            <Image alt="Maple" src={mapleMarketLogo} className={rwaVaultsStyles.partnerLogo} />
            <Image alt="Stac" src={stacMarketLogo} className={rwaVaultsStyles.partnerLogo} />
            <Image alt="Apollo" src={apolloMarketLogo} className={rwaVaultsStyles.partnerLogo} />
            <Image
              alt="Superstate"
              src={superstateMarketLogo}
              className={rwaVaultsStyles.partnerLogo}
            />
            <Image
              alt="WisdomTree"
              src={wisdomTreeMarketLogo}
              className={rwaVaultsStyles.partnerLogo}
            />
          </div>
        </div>
      </SubLandingPageSection>
      <SubLandingPageSection className={rwaVaultsStyles.subLandingPageSection}>
        <div className={rwaVaultsStyles.subSectionRow}>
          <div className={rwaVaultsStyles.subSectionColumn}>
            <Text variant="h3">Strategically allocated by Avantgarde</Text>
            <Text variant="p2" className={rwaVaultsStyles.subSectionTextSecondary}>
              Avantgarde is a Panama-based digital asset management and DeFi software firm. They
              bring over 8 years of experience (building in DeFi since 2016) managing non-custodial,
              on-chain investment strategies, covering DeFi yield curation and Real World Assets
              (RWA). With their curated Morpho Vaults and Separately Managed Accounts (SMAs), they
              set and manage conservative and dynamic yield allocations, monitor continuous protocol
              risk, and structure tailored RWA-backed looping strategies for institutional and
              crypto-native investors.
            </Text>
            <Button
              variant="secondaryMedium"
              className={rwaVaultsStyles.buttonAlignStart}
              onClick={() => handleScrollToForm()}
            >
              Get in touch to know more
            </Button>
          </div>
          <div className={rwaVaultsStyles.partnerLogoFrame}>
            <Image alt="Avantgarde" src={avantgardeLogo} width={290} />
          </div>
        </div>
      </SubLandingPageSection>
      <SubLandingPageSection
        className={`${rwaVaultsStyles.subLandingPageSection} ${rwaVaultsStyles.cardSection}`}
      >
        <div className={rwaVaultsStyles.card}>
          <Image
            alt="background lines"
            src={ourProductsLinesBackground}
            loading="eager"
            className={rwaVaultsStyles.linesBackground}
          />
          <div className={rwaVaultsStyles.backgroundOrb} />
          <div className={`${rwaVaultsStyles.cardContent} ${rwaVaultsStyles.cardContentNarrow}`}>
            <div className={rwaVaultsStyles.iconBadge}>
              <Icon iconName="chart" size={18} className={rwaVaultsStyles.icon} />
            </div>
            <Text variant="h4">
              Deep liquidity yield sources designed for institutions and funds
            </Text>
            <Text
              variant="p2"
              className={`${rwaVaultsStyles.subSectionTextSecondary} ${rwaVaultsStyles.cardSubtitle}`}
            >
              The Strategically Allocated RWA Vault has exposure to thoughtfully curated underlying
              yield sources with deep liquidity and quality collateral in mind
            </Text>
            <div className={rwaVaultsStyles.iconColumn}>
              <CheckLine text="Only top-tier institutional-grade assets" />
              <CheckLine text="Permissioned markets that means funds are never mixed with non-KYC’d users." />
              <CheckLine text="Capable of handling large amounts of capital which can be deployed or withdrawn efficiently" />
            </div>
          </div>
          <div className={rwaVaultsStyles.vaultExposurePosition}>
            <Image src={vaultExposureInstiScreenshot} alt="vault exposure screenshot" />
          </div>
        </div>
        <div className={rwaVaultsStyles.card}>
          <Image
            alt="background lines"
            src={ourProductsLinesBackground}
            className={`${rwaVaultsStyles.linesBackground} ${rwaVaultsStyles.linesBackgroundSecondBlock}`}
          />
          <div className={rwaVaultsStyles.backgroundOrb} />
          <div className={rwaVaultsStyles.cardContent}>
            <div className={rwaVaultsStyles.iconBadge}>
              <Icon iconName="shield_check" size={18} className={rwaVaultsStyles.icon} />
            </div>
            <Text variant="h4">
              Best in class Infrastructure, designed for institutional access
            </Text>
            <Text
              variant="p2"
              className={`${rwaVaultsStyles.subSectionTextSecondary} ${rwaVaultsStyles.cardSubtitle}`}
            >
              The Summer Institutional RWA Vaults put security above all else, and are built on top
              of robust smart contracts developed for the Lazy Summer Protocol. With additional
              layers to handle permissioned access, the Summer Institutional Vaults enable approved
              depositors to access to a basket of RWA’s and private markets.
            </Text>
            <div className={rwaVaultsStyles.infrastructureColumns}>
              <div className={rwaVaultsStyles.infrastructureColumn}>
                <Text variant="p1semi">
                  <Text variant="p3colorful">01.</Text>
                  <br />
                  Ring-Fenced Liquidity (Permissioned Access)
                </Text>
                <Text variant="p2" className={rwaVaultsStyles.subSectionTextSecondary}>
                  Summer.fi&apos;s permissioned Vaults are restricted to deposits exclusively from
                  whitelisted addresses. And if accessed through a partner custodian, no additional
                  KYC is needed.
                </Text>
              </div>
              <div className={rwaVaultsStyles.infrastructureColumn}>
                <Text variant="p1semi">
                  <Text variant="p3colorful">02.</Text>
                  <br />
                  Earn directly from the assets, not from borrowers
                </Text>
                <Text variant="p2" className={rwaVaultsStyles.subSectionTextSecondary}>
                  Unlike almost all other RWA Vaults in DeFi where you earn from users borrowing
                  against RWA’s, this Vault earns the yield from the underlying RWA’s and private
                  markets directly.
                </Text>
              </div>
              <div className={rwaVaultsStyles.infrastructureColumn}>
                <Text variant="p1semi">
                  <Text variant="p3colorful">03.</Text>
                  <br />
                  Fully self-custodial, always
                </Text>
                <Text variant="p2" className={rwaVaultsStyles.subSectionTextSecondary}>
                  The Summer.fi RWA Vaults are entirely self-custodial. You never give custody of
                  your assets to others and all accounting is transparent and onchain. There is no
                  access to any funds by Summer.fi or the Curator.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </SubLandingPageSection>
      <SubLandingPageSection className={rwaVaultsStyles.custodySection}>
        <Text variant="p1semi" className={rwaVaultsStyles.custodySectionLabel}>
          Institutional grade custody partners
        </Text>
        <div className={rwaVaultsStyles.custodyColumns}>
          <div className={rwaVaultsStyles.custodyColumn}>
            <div className={rwaVaultsStyles.custodyLogoWrapper}>
              <Image alt="Utila" src={utilaLogo} className={rwaVaultsStyles.custodyLogo} />
            </div>
            <Text variant="p2" className={rwaVaultsStyles.custodyDescription}>
              An enterprise-grade, non-custodial MPC wallet that empowers institutions to manage
              digital assets across multiple chains.
            </Text>
            <div className={rwaVaultsStyles.custodyChecks}>
              <CheckLine text="Advanced MPC-CMP cryptography" />
              <CheckLine text="Streamlined multi-chain asset management" />
              <CheckLine text="Will require KYC" />
            </div>
          </div>
          <div className={rwaVaultsStyles.custodyColumn}>
            <div className={rwaVaultsStyles.custodyLogoWrapper}>
              <Image alt="Balance" src={balanceLogo} className={rwaVaultsStyles.custodyLogo} />
            </div>
            <Text variant="p2" className={rwaVaultsStyles.custodyDescription}>
              Regulated operating system for institutions to securely store, manage, and settle both
              digital assets and fiat.
            </Text>
            <div className={rwaVaultsStyles.custodyChecks}>
              <CheckLine text="Canadian and US qualified custodian" />
              <CheckLine text="Integrated off-chain settlements and automated compliance" />
              <CheckLine text="No additional KYC, access immediatley" />
            </div>
          </div>
          <div className={rwaVaultsStyles.custodyColumn}>
            <div className={rwaVaultsStyles.custodyLogoWrapper}>
              <Image alt="Summer.fi" src={summerLogo} className={rwaVaultsStyles.custodyLogo} />
            </div>
            <Text variant="p2" className={rwaVaultsStyles.custodyDescription}>
              Provided you meet the requirements and complete KYC, you will also be able to access
              the Vault via the{' '}
              <Link
                href="/earn?vaults=permissioned-rwa-vaults"
                style={{
                  borderBottom: '1px dashed rgba(255,255,255,0.3)',
                }}
              >
                Summer.fi
              </Link>{' '}
              UI.
            </Text>
            <div className={rwaVaultsStyles.custodyChecks}>
              <CheckLine text="Still fully non-custodial" />
              <CheckLine text="Complete picture of the Vault in real time." />
              <CheckLine
                text={
                  <>
                    Requires KYC. Book an appointment to get approved access{' '}
                    <span
                      onClick={handleScrollToForm}
                      style={{
                        cursor: 'pointer',
                        color: 'var(--color-background-primary)',
                      }}
                    >
                      here
                    </span>
                  </>
                }
              />
            </div>
          </div>
        </div>
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <Text variant="p2">
            Want to integrate this Vault to your platform? Find out more{' '}
            <Link
              href="/integrations"
              style={{
                color: 'var(--color-background-primary)',
              }}
            >
              here
            </Link>
          </Text>
        </div>
      </SubLandingPageSection>
      <UseCasesSlider />
      <SubLandingPageSection>
        <Audits
          fullWidth
          chainSecurityLogo={chainSecurityLogo}
          prototechLabsLogo={prototechLabsLogo}
          sherlockLogo={sherlockLogo}
          onAuditClick={handleAuditClick}
        />
      </SubLandingPageSection>
      <LandingPageContactForm formType="rwa" />
      <div className={rwaVaultsStyles.buildBySummerWrapper}>
        <BuildBySummerFiPlain />
      </div>
      <div className={rwaVaultsStyles.faqWrapper}>
        <LandingRwaFaqSection />
      </div>
    </>
  )
}
