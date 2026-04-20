'use client'
import { Button, Emphasis, Icon, LatestNews, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import { TagButton } from '@/components/atoms/TagButton'
import { HeroWrapper } from '@/components/layout/HeroWrapper/HeroWrapper'
import { CheckLine } from '@/components/layout/LandingPageContent/components/CheckLine'
import { SubLandingPageSection } from '@/components/layout/SubLandingPageSection/SubLandingPageSection'
import { FractalGlassBackground } from '@/components/molecules/FractalGlassBackground/FractalGlassBackground'
import { useLandingPageData } from '@/contexts/LandingPageContext'
import balanceLogo from '@/public/img/landing-page/private-markets/logo_balance.svg'
import summerLogo from '@/public/img/landing-page/private-markets/logo_summer.svg'
import utilaLogo from '@/public/img/landing-page/private-markets/logo_utila.svg'
import m1CapitalLogo from '@/public/img/landing-page/private-markets/m1_capital.svg'

import rwaVaultsStyles from './RwaVaults.module.css'

import ourProductsLinesBackground from '@/public/img/landing-page/our-products-lines-bg.png'
import apolloMarketLogo from '@/public/img/landing-page/private-markets/apollo.png'
import mapleMarketLogo from '@/public/img/landing-page/private-markets/maple.png'
import stacMarketLogo from '@/public/img/landing-page/private-markets/stac.png'
import superstateMarketLogo from '@/public/img/landing-page/private-markets/superstate.png'
import vaneckMarketLogo from '@/public/img/landing-page/private-markets/vaneck.png'
import wisdomTreeMarketLogo from '@/public/img/landing-page/private-markets/wisdomtree.png'
import vaultExposureScreenshot from '@/public/img/landing-page/vault-exposure-screenshot.png'

export default function RwaVaults() {
  const { landingPageData } = useLandingPageData()

  return (
    <>
      <HeroWrapper className={rwaVaultsStyles.heroWrapper}>
        <div className={rwaVaultsStyles.heroBackground}>
          <FractalGlassBackground />
        </div>
        <div className={rwaVaultsStyles.heroContent}>
          <TagButton>Permissioned RWA Vault</TagButton>
          <Text variant="h1">
            <Emphasis variant="h1colorful">Institutional grade DeFi yield.</Emphasis> Private,
            diversified and automated.
          </Text>
          <Text variant="p1" className={rwaVaultsStyles.heroParagraph}>
            The Summer.fi institutional Private access RWA vault managed by M1 Capital gives
            automated access to the highest quality RWA markets designed exclusively for qualified
            investors.
          </Text>
          <div
            style={{
              display: 'flex',
              gap: '24px',
            }}
          >
            <Button variant="primaryMedium">View Vault</Button>
            <Button variant="secondaryMedium">Get in touch</Button>
          </div>
        </div>
      </HeroWrapper>
      <SubLandingPageSection className={rwaVaultsStyles.subLandingPageSection}>
        <div className={rwaVaultsStyles.subSectionColumn}>
          <Text variant="h3">
            Seamlessly earn onchain yield from the highest quality RWA markets
          </Text>
          <Text variant="p1" className={rwaVaultsStyles.subSectionTextSecondary}>
            This private access Vault allows approved depositors to earn from the leading tokenized
            assets and private credit markets on Ethereum, all from a single Vault with no
            additional KYC. The Vault automatically rebalances towards a set target allocation of
            assets, which is periodically adjusted by the Vault Manager, M1 Capital.
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
            <Text variant="h3">
              Managed exposure to RWA and tokenized private credit by M1 Capital
            </Text>
            <Text variant="p1" className={rwaVaultsStyles.subSectionTextSecondary}>
              M1 Capital is an Amsterdam based Digital Hedge Fund. They bring over 4 years of
              experience managing delta neutral strategies onchain, covering DeFi and Real World
              Assets. With the Summer Institutional RWA Vault, they set and manage the supported
              tokenized funds, target allocations and the onboarding of Custodians and other
              institutions to access the Vault.
            </Text>
            <Button variant="secondaryMedium" style={{ margin: '0 auto 0 0' }}>
              Get in touch to know more
            </Button>
          </div>
          <div className={rwaVaultsStyles.partnerLogoFrame}>
            <Image alt="M1 Capital" src={m1CapitalLogo} width={290} />
          </div>
        </div>
      </SubLandingPageSection>
      <SubLandingPageSection
        className={`${rwaVaultsStyles.subLandingPageSection} ${rwaVaultsStyles.cardSection}`}
      >
        <div
          className={rwaVaultsStyles.card}
          style={{
            position: 'relative',
          }}
        >
          <Image
            alt="background lines"
            src={ourProductsLinesBackground}
            loading="eager"
            className={rwaVaultsStyles.linesBackground}
          />
          <div className={rwaVaultsStyles.backgroundOrb} />
          <div
            className={rwaVaultsStyles.cardContent}
            style={{
              width: '456px',
            }}
          >
            <div className={rwaVaultsStyles.iconBadge}>
              <Icon iconName="chart" size={18} className={rwaVaultsStyles.icon} />
            </div>
            <Text variant="h4">Deep liquidity yield sources designed for institutions</Text>
            <Text
              variant="p2"
              className={`${rwaVaultsStyles.subSectionTextSecondary} ${rwaVaultsStyles.cardSubtitle}`}
            >
              RWA Private access vaults have thoughtfully curated underlying yield sources with deep
              liquidity and quality collateral in mind.
            </Text>
            <div className={rwaVaultsStyles.iconColumn}>
              <CheckLine text="Curated, institutional-Grade Assets" />
              <CheckLine text="Permissioned environments that protect large-scale institutional capital" />
              <CheckLine text="Large amounts of capital can be deployed or withdrawn efficiently" />
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              right: '-5%',
              top: '15%',
            }}
          >
            <Image src={vaultExposureScreenshot} alt="vault exposure screenshot" />
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
              depositors to access to a basket of RWA markets.
            </Text>
            <div
              style={{
                display: 'flex',
                gap: 'var(--spacing-space-2x-large)',
                marginTop: 'var(--spacing-space-large)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  width: '33.33%',
                }}
              >
                <Text variant="p1semi">
                  <Text variant="p3colorful">01.</Text>
                  <br />
                  Ring-Fenced Liquidity (Permissioned Access)
                </Text>
                <Text
                  variant="p2"
                  style={{
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Summer.fi&apos;s institutional RWA Vaults are restricted to deposits exclusively
                  from pre-approved addresses.
                </Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  width: '33.33%',
                }}
              >
                <Text variant="p1semi">
                  <Text variant="p3colorful">02.</Text>
                  <br />
                  Independent Management by M1 Capital
                </Text>
                <Text
                  variant="p2"
                  style={{
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  M1 Capital are a professional and experienced team with a proven track record.
                  While the Vault infrastructure is designed and developed by Summer.fi.
                </Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  width: '33.33%',
                }}
              >
                <Text variant="p1semi">
                  <Text variant="p3colorful">03.</Text>
                  <br />
                  Self-custodial
                </Text>
                <Text
                  variant="p2"
                  style={{
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  The Summer Institutional Vaults are entirley self-custodial, you never give
                  custody of your assets to others. Only you can deposit or withdraw your assets,
                  and there is no access to your funds by Summer.fi or the Vault Manager.
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
            </div>
          </div>
          <div className={rwaVaultsStyles.custodyColumn}>
            <div className={rwaVaultsStyles.custodyLogoWrapper}>
              <Image alt="Summer.fi" src={summerLogo} className={rwaVaultsStyles.custodyLogo} />
            </div>
            <Text variant="p2" className={rwaVaultsStyles.custodyDescription}>
              Provided you have an approved wallet address, you will also be able to access the
              Vault via the{' '}
              <a href="https://summer.fi" target="_blank" rel="noopener noreferrer">
                Summer.fi
              </a>{' '}
              UI.
            </Text>
            <div className={rwaVaultsStyles.custodyChecks}>
              <CheckLine text="Still fully non-custodial" />
              <CheckLine text="Book an appointment to get approved access" />
            </div>
          </div>
        </div>
      </SubLandingPageSection>
      <SubLandingPageSection>
        <LatestNews news={landingPageData?.blogPosts} />
      </SubLandingPageSection>
    </>
  )
}
