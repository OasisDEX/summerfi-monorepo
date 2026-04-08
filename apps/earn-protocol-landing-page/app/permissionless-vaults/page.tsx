'use client'

import {
  Audits,
  Button,
  Emphasis,
  Icon,
  Text,
  VaultCardsCarousel,
  WithArrow,
} from '@summerfi/app-earn-ui'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { TagButton } from '@/components/atoms/TagButton'
import { LandingPageBlobs } from '@/components/layout/LandingMasterPage/LandingPageBlobs'
import { CheckLine } from '@/components/layout/LandingPageContent/components/CheckLine'
import { HeroWrapper } from '@/components/layout/sub-pages/HeroWrapper'
import { ProtocolIconsWithMore } from '@/components/layout/sub-pages/ProtocolIconsWithMore'
import { SubLandingPageSection } from '@/components/layout/sub-pages/SubLandingPageSection'
import { useLandingPageData } from '@/contexts/LandingPageContext'
import { EarnProtocolEvents } from '@/helpers/mixpanel'
import chainSecurityLogo from '@/public/img/landing-page/auditor-logos/chainsecurity.svg'
import prototechLabsLogo from '@/public/img/landing-page/auditor-logos/prototech-labs.svg'
import sherlockLogo from '@/public/img/landing-page/auditor-logos/sherlock.svg'

import permissionlessVaultsStyles from './PermissionlessVaults.module.css'

import blockAnaliticaPinkFaded from '@/public/img/landing-page/blockanalitca-pink-faded.png'
import summerFiPinkFaded from '@/public/img/landing-page/summer-fi-pink-faded.png'
import vaultExposureScreenshot from '@/public/img/landing-page/vault-exposure-screenshot.png'

export default function PermissionlessVaults() {
  const { landingPageData } = useLandingPageData()
  const pathname = usePathname()
  const handleAuditClick = (auditId: string) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-self-managed-vaults-audit-${auditId}-learn-more`,
      page: pathname,
    })
  }

  return (
    <>
      <HeroWrapper large className={permissionlessVaultsStyles.heroWrapper}>
        <div className={permissionlessVaultsStyles.heroBackground}>
          <LandingPageBlobs />
        </div>
        <div className={permissionlessVaultsStyles.heroContent}>
          <TagButton>Permisionless DeFi Vaults</TagButton>
          <Text variant="h1">
            <Emphasis variant="h1colorful">Automated access to DeFi’s best yields,</Emphasis>
            <br />
            continually rebalanced to earn you more.
          </Text>
          <Text variant="p1" className={permissionlessVaultsStyles.subtext}>
            With Lazy Summer permisionless vaults, deposit once and earn the best yields across DeFi
            - automatically rebalanced, built-in risk-management and liquid anytime.
          </Text>
        </div>
        <VaultCardsCarousel
          vaultsList={landingPageData?.vaultsWithConfig}
          rewardTokenPrices={landingPageData?.rewardTokenPrices}
          vaultsApyByNetworkMap={landingPageData?.vaultsApyByNetworkMap}
          vaultsInfo={landingPageData?.vaultsInfo}
        />
      </HeroWrapper>
      <div
        className={permissionlessVaultsStyles.pageContentWrapper}
        style={{
          overflow: 'hidden',
        }}
      >
        <SubLandingPageSection className={permissionlessVaultsStyles.subLandingPageSectionFirst}>
          <div className={clsx(permissionlessVaultsStyles.subLandingPageSectionData)}>
            <div
              className={clsx(
                permissionlessVaultsStyles.subLandingPageTextColumn,
                permissionlessVaultsStyles.subLandingPageTextColumnLargeGap,
              )}
            >
              <div className={permissionlessVaultsStyles.subLandingPageHeadingGroup}>
                <Text variant="p3colorful">Consistently outperform benchmark yield</Text>
                <Text variant="h3">
                  Lazy Summer keeps your capital continuously allocated across the DeFi yield market
                </Text>
              </div>
              <Text variant="p1" className={permissionlessVaultsStyles.subLandingPageSubtext}>
                Lazy Summer’s approach to risk is holistic and not siloed by a single protocol, with
                Block Analitica providing independent, continuous oversight.
              </Text>
              <div className={permissionlessVaultsStyles.iconColumn}>
                <CheckLine text="Outperform single protocol strategies by staying allocated to the best available rates." />
                <CheckLine text="Capture fluctuating rate movements" />
                <CheckLine text="Compounding rewards, and consistently outperforming the benchmarks." />
              </div>
              <ProtocolIconsWithMore limit={5} />
            </div>
            <div className={permissionlessVaultsStyles.vaultExposureScreenshotWrapper}>
              <Image src={vaultExposureScreenshot} alt="vault exposure screenshot" />
            </div>
          </div>
        </SubLandingPageSection>
        <SubLandingPageSection>
          <div
            className={clsx(
              permissionlessVaultsStyles.subLandingPageSectionData,
              permissionlessVaultsStyles.subLandingPageSectionDataAlignStart,
            )}
          >
            <div className={permissionlessVaultsStyles.subLandingPageTextColumn}>
              <Text variant="p3colorful">Block Analitica Risk Managed</Text>
              <Text variant="h3">DeFi’s best risk adjusted yield</Text>
              <Text variant="p1" className={permissionlessVaultsStyles.subLandingPageSubtext}>
                Lazy Summer&apos;s approach to risk is holistic and not siloed by a single protocol,
                with Block Analitica providing independent, continuous oversight.
              </Text>
            </div>
            <div
              className={clsx(
                permissionlessVaultsStyles.subLandingPageTextColumn,
                permissionlessVaultsStyles.subLandingPageTextColumnLargeGap,
              )}
            >
              <div className={permissionlessVaultsStyles.iconColumn}>
                <Icon
                  iconName="shield_ban"
                  size={24}
                  className={permissionlessVaultsStyles.iconStroke}
                />
                <Text variant="p2" className={permissionlessVaultsStyles.subLandingPageSubtext}>
                  Block Analitica sets, monitors and informs all vault exposure caps independently.
                </Text>
              </div>
              <div className={permissionlessVaultsStyles.iconColumn}>
                <Icon
                  iconName="chart"
                  size={24}
                  className={permissionlessVaultsStyles.iconStroke}
                />
                <Text variant="p2" className={permissionlessVaultsStyles.subLandingPageSubtext}>
                  Designed for risk-adjusted outperformance
                </Text>
              </div>
              <div className={permissionlessVaultsStyles.iconColumn}>
                <Icon
                  iconName="award"
                  size={24}
                  className={permissionlessVaultsStyles.iconStroke}
                />
                <Text variant="p2" className={permissionlessVaultsStyles.subLandingPageSubtext}>
                  Diversification across blue chip protocols reduces concentration risk.
                </Text>
              </div>
            </div>
          </div>
        </SubLandingPageSection>
        <SubLandingPageSection>
          <div
            className={clsx(
              permissionlessVaultsStyles.riskManagedCardsRow,
              permissionlessVaultsStyles.subLandingPageSectionData,
            )}
          >
            <div className={permissionlessVaultsStyles.riskManagedCard}>
              <Image src={blockAnaliticaPinkFaded} alt="block analitica" />
              <div className={permissionlessVaultsStyles.riskManagedCardTextGroup}>
                <Text variant="h4" className={permissionlessVaultsStyles.riskManagedCardTitle}>
                  Actively risk-managed
                </Text>
                <Text variant="p2" className={permissionlessVaultsStyles.subLandingPageSubtext}>
                  Block Analitica provides independent, continuous risk management and oversight,
                  giving users access to top tier protocols via sophisticated models and analysis.
                </Text>
              </div>
              <div className={permissionlessVaultsStyles.iconColumn}>
                <CheckLine text="Designed for risk-adjusted outperformance." />
                <CheckLine text="Block Analitica sets, monitors and informs all vault exposure caps independently." />
                <CheckLine text="Can set exposure caps to 0 in risk off market events." />
              </div>
              <Link href="/earn" className={permissionlessVaultsStyles.riskManagedCardLink}>
                <Button variant="textPrimaryMedium">
                  <WithArrow>View all actively risk managed vaults</WithArrow>
                </Button>
              </Link>
            </div>
            <div className={permissionlessVaultsStyles.riskManagedCard}>
              <Image
                src={summerFiPinkFaded}
                className={permissionlessVaultsStyles.riskManagedCardImage}
                alt="summer fi"
              />
              <div className={permissionlessVaultsStyles.riskManagedCardTextGroup}>
                <Text variant="h4" className={permissionlessVaultsStyles.riskManagedCardTitle}>
                  DAO risk-managed
                </Text>
                <Text variant="p2" className={permissionlessVaultsStyles.subLandingPageSubtext}>
                  DAO managed vaults give you automated access to DeFi&apos;s top performing
                  strategies, through a risk framework developed in partnership with Block
                  Analitica.
                </Text>
              </div>
              <div className={permissionlessVaultsStyles.iconColumn}>
                <CheckLine text="Designed to dramatically outperform benchmarks." />
                <CheckLine text="Rigorous protocol categorization helps protect against downside risk." />
                <CheckLine text="Decentralized guardians that can set exposure caps to 0 in risk off market events." />
              </div>
              <Link
                href="/earn?vaults=dao-risk-managed"
                className={permissionlessVaultsStyles.riskManagedCardLink}
              >
                <Button variant="textPrimaryMedium">
                  <WithArrow>View all actively risk managed vaults</WithArrow>
                </Button>
              </Link>
            </div>
          </div>
        </SubLandingPageSection>
        <SubLandingPageSection
          style={{
            flexDirection: 'column',
            gap: 'var(--spacing-space-large)',
          }}
        >
          <Text variant="p1semi" className={permissionlessVaultsStyles.subLandingPageSubtext}>
            Features
          </Text>
          <div
            className={clsx(
              permissionlessVaultsStyles.subLandingPageSectionData,
              permissionlessVaultsStyles.subLandingPageSectionDataAlignStart,
            )}
          >
            <div className={permissionlessVaultsStyles.subLandingPageTextColumn}>
              <Text variant="p3colorful">01.</Text>
              <Text variant="h4">Never chase another yield source</Text>
              <Text
                variant="p1"
                className={permissionlessVaultsStyles.subLandingPageSubtext}
                style={{
                  marginBottom: '18px',
                }}
              >
                Stop checking dashboards, searching for new protocols and listening to DeFi
                influencers. Lazy Summer protocol automatically adds new yield sources that are
                performing well.
              </Text>
              <div className={permissionlessVaultsStyles.iconColumn}>
                <CheckLine text="Lazy Summer governance approves new yield sources." />
                <CheckLine text="SUMR community monitors top performing yield sources." />
              </div>
            </div>
            <div className={permissionlessVaultsStyles.subLandingPageTextColumn}>
              <Text variant="p3colorful">02.</Text>
              <Text variant="h4">
                Instant liquidity, always. Withdraw your capital when you want.
              </Text>
              <Text
                variant="p1"
                className={permissionlessVaultsStyles.subLandingPageSubtext}
                style={{
                  marginBottom: '18px',
                }}
              >
                Yield sources are only approved and allocated to if some amount of capital can be
                withdrawn instantly.
              </Text>
              <div className={permissionlessVaultsStyles.iconColumn}>
                <CheckLine text="Lazy Summer prioritized capital being withdrawable" />
              </div>
            </div>
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
      </div>
    </>
  )
}
