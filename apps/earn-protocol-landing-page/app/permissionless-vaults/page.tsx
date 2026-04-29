'use client'

import { Audits, Button, Emphasis, Icon, Text, VaultCardsCarousel } from '@summerfi/app-earn-ui'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { TagButton } from '@/components/atoms/TagButton'
import { HeroWrapper } from '@/components/layout/HeroWrapper/HeroWrapper'
import { LandingPageBlobs } from '@/components/layout/LandingMasterPage/LandingPageBlobs'
import { CheckLine } from '@/components/layout/LandingPageContent/components/CheckLine'
import { LandingPermissionlessDefiVaultsFaqSection } from '@/components/layout/LandingPageContent/content/LandingFaqSection'
import { StartEarningNow } from '@/components/layout/LandingPageContent/content/StartEarningNow'
import { SubLandingPageSection } from '@/components/layout/SubLandingPageSection/SubLandingPageSection'
import { ProtocolIconsWithMore } from '@/components/molecules/ProtocolIconsWithMore/ProtocolIconsWithMore'
import { useLandingPageData } from '@/contexts/LandingPageContext'
import { EarnProtocolEvents } from '@/helpers/mixpanel'
import chainSecurityLogo from '@/public/img/landing-page/auditor-logos/chainsecurity.svg'
import prototechLabsLogo from '@/public/img/landing-page/auditor-logos/prototech-labs.svg'
import sherlockLogo from '@/public/img/landing-page/auditor-logos/sherlock.svg'
import liquidityImage from '@/public/img/landing-page/liquidity.svg'

import permissionlessVaultsStyles from './PermissionlessVaults.module.css'

import alwaysNonCustodialImage from '@/public/img/landing-page/always-non-custodial.png'
import blockAnaliticaPinkFaded from '@/public/img/landing-page/blockanalitca-pink-faded.png'
import depositSidePanelImage from '@/public/img/landing-page/deposit-side-panel.png'
import vaultExposureScreenshot from '@/public/img/landing-page/vault-exposure-screenshot.png'

export default function PermissionlessVaults() {
  const { landingPageData } = useLandingPageData()
  const pathname = usePathname()
  const handleAuditClick = (auditId: string) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-build-your-own-vault-audit-${auditId}-learn-more`,
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
      <div className={permissionlessVaultsStyles.pageContentWrapper}>
        <SubLandingPageSection className={permissionlessVaultsStyles.subLandingPageSectionFirst}>
          <div className={clsx(permissionlessVaultsStyles.subLandingPageSectionData)}>
            <div
              className={clsx(
                permissionlessVaultsStyles.subLandingPageTextColumn,
                permissionlessVaultsStyles.subLandingPageTextColumnLargeGap,
                permissionlessVaultsStyles.subLandingPageTextColumnWider,
              )}
            >
              <div className={permissionlessVaultsStyles.subLandingPageHeadingGroup}>
                <Text variant="p3colorful">Consistently outperform benchmark yield</Text>
                <Text variant="h3">
                  Lazy Summer keeps your capital continuously allocated across the DeFi yield market
                </Text>
              </div>
              <Text variant="p1" className={permissionlessVaultsStyles.subLandingPageSubtext}>
                With Lazy Summer Protocol, your deposits are continuously monitored and reallocated
                across the top protocols, ensuring you are earning the best available yields.
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
          <div className={permissionlessVaultsStyles.stack3xLarge}>
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
                  Block Analitica is the Risk Curator to the Lazy Summer Protocol, They come to Lazy
                  Summer Protocol with a wealth of experience, using sophisticated models to
                  simulate market conditions to prevent any unnecessary risks taken in the protocol.
                </Text>
                <Image
                  src={blockAnaliticaPinkFaded}
                  alt="block analitica"
                  className={permissionlessVaultsStyles.blockAnaliticaLogo}
                />
              </div>
              <div
                className={clsx(
                  permissionlessVaultsStyles.subLandingPageTextColumn,
                  permissionlessVaultsStyles.subLandingPageTextColumnLargeGap,
                )}
              >
                <div className={permissionlessVaultsStyles.iconColumn}>
                  <Icon
                    iconName="award"
                    size={24}
                    className={permissionlessVaultsStyles.iconStroke}
                  />
                  <Text variant="p2" className={permissionlessVaultsStyles.subLandingPageSubtext}>
                    Block Analitica sets, monitors and informs all vault exposure caps for the their
                    own set of risk managed vaults.
                  </Text>
                </div>
                <div className={permissionlessVaultsStyles.iconColumn}>
                  <Icon
                    iconName="chart"
                    size={24}
                    className={permissionlessVaultsStyles.iconStroke}
                  />
                  <Text variant="p2" className={permissionlessVaultsStyles.subLandingPageSubtext}>
                    Block Analitica helped to design the risk framework utilized in all DAO risk
                    managed vaults. A set of vaults designed to dramatically outperform benchmarks.
                  </Text>
                </div>
                <div className={permissionlessVaultsStyles.iconColumn}>
                  <Icon
                    iconName="chart"
                    size={24}
                    className={permissionlessVaultsStyles.iconStroke}
                  />
                  <Text variant="p2" className={permissionlessVaultsStyles.subLandingPageSubtext}>
                    Block Analitica helped to design the risk framework utilized in all DAO risk
                    managed vaults. A set of vaults designed to dramatically outperform benchmarks.
                  </Text>
                </div>
              </div>
            </div>
            <div
              className={clsx(
                permissionlessVaultsStyles.riskManagedCardsRow,
                permissionlessVaultsStyles.subLandingPageSectionData,
              )}
            >
              <div className={permissionlessVaultsStyles.riskManagedCard}>
                <div className={permissionlessVaultsStyles.riskManagedCardTextGroup}>
                  <Text variant="h4" className={permissionlessVaultsStyles.riskManagedCardTitle}>
                    Actively risk-managed
                  </Text>
                  <Text variant="p2" className={permissionlessVaultsStyles.subLandingPageSubtext}>
                    Block Analitica provides independent, continuous risk management and oversight,
                    giving users access to top tier protocols via sophisticated models and analysis.
                  </Text>
                </div>
                <div
                  className={clsx(
                    permissionlessVaultsStyles.iconColumn,
                    permissionlessVaultsStyles.riskManagedCardChecks,
                  )}
                >
                  <CheckLine text="Designed for risk-adjusted outperformance." />
                  <CheckLine text="Block Analitica sets, monitors and informs all vault exposure caps independently." />
                  <CheckLine text="Can set exposure caps to 0 in risk off market events." />
                </div>
                <Link href="/earn" className={permissionlessVaultsStyles.riskManagedCardLink}>
                  <Button variant="secondarySmall">View</Button>
                </Link>
              </div>
              <div className={permissionlessVaultsStyles.riskManagedCard}>
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
                <div
                  className={clsx(
                    permissionlessVaultsStyles.iconColumn,
                    permissionlessVaultsStyles.riskManagedCardChecks,
                  )}
                >
                  <CheckLine text="Designed to dramatically outperform benchmarks." />
                  <CheckLine text="Rigorous protocol categorization helps protect against downside risk." />
                  <CheckLine text="Decentralized guardians that can set exposure caps to 0 in risk off market events." />
                </div>
                <Link
                  href="/earn?vaults=dao-risk-managed"
                  className={permissionlessVaultsStyles.riskManagedCardLink}
                >
                  <Button variant="secondarySmall">View</Button>
                </Link>
              </div>
            </div>
          </div>
        </SubLandingPageSection>
        <SubLandingPageSection className={permissionlessVaultsStyles.featuresSection}>
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
              <Text variant="h4">Stop chasing yields with automated rebalancing</Text>
              <Text
                variant="p1"
                className={clsx(
                  permissionlessVaultsStyles.subLandingPageSubtext,
                  permissionlessVaultsStyles.featureDescription,
                )}
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
              <Text variant="h4">Start earning immediately with auto compounding</Text>
              <Text
                variant="p1"
                className={clsx(
                  permissionlessVaultsStyles.subLandingPageSubtext,
                  permissionlessVaultsStyles.featureDescription,
                )}
              >
                Lazy Summer Protocol continuously sells earned rewards and reinvests proceeds so you
                never have to time and dump rewards.
              </Text>
              <div className={permissionlessVaultsStyles.iconColumn}>
                <CheckLine text="Set It and Forget It: Watch your balance snowball automatically—no manual claims required." />
                <CheckLine text="Compound Interest on Autopilot: The protocol turn your rewards back into growth, instantly." />
              </div>
            </div>
          </div>
        </SubLandingPageSection>
        <SubLandingPageSection className={permissionlessVaultsStyles.powerSection}>
          <Text
            variant="h2"
            className={clsx(
              permissionlessVaultsStyles.subLandingPageHeadingGroup,
              permissionlessVaultsStyles.powerHeading,
            )}
          >
            The Power of DeFi, made accessible to everyone.
          </Text>
          <div className={permissionlessVaultsStyles.powerCardsRow}>
            <div
              className={clsx(
                permissionlessVaultsStyles.powerCard,
                permissionlessVaultsStyles.powerCardGap,
              )}
            >
              <Text variant="p3semiColorful">Transparent by Design</Text>
              <Text variant="h5">Never second guess the source of your yield</Text>
              <Text variant="p2" className={permissionlessVaultsStyles.powerCardText}>
                Summer ensures you never second guess the source of your yield. With our automated
                rebalances, every decision is fully traceable and optimized transparently.
              </Text>
              <Image
                src={liquidityImage}
                alt="liquidity"
                className={permissionlessVaultsStyles.liquidityImage}
              />
            </div>
            <div className={permissionlessVaultsStyles.powerCard}>
              <Text variant="p3semiColorful">Instant Liquidity</Text>
              <Text variant="h5">Exit anytime, no lockups or withdrawal delays</Text>
              <Text variant="p2" className={permissionlessVaultsStyles.powerCardText}>
                With Summer, you can withdraw from your position at anytime as long as the capital
                is available from the underlying protocols (which is almost always). No queues or
                waiting for withdrawals to be processed.{' '}
              </Text>
              <Image
                src={depositSidePanelImage}
                alt="deposit side panel"
                className={permissionlessVaultsStyles.depositImage}
              />
            </div>
            <div
              className={clsx(
                permissionlessVaultsStyles.powerCard,
                permissionlessVaultsStyles.permissionlessCard,
              )}
            >
              <div className={permissionlessVaultsStyles.permissionlessCardContent}>
                <Text variant="p3semiColorful">Permissionless</Text>
                <Text variant="h5">Always Non-Custodial, Always in Your Control</Text>
                <Text variant="p2" className={permissionlessVaultsStyles.powerCardText}>
                  Built entirely on-chain, Summer gives you unrestricted access and complete control
                  over your assets—no middle-men and no opaque third parties with control over your
                  capital.
                </Text>
              </div>
              <Image
                src={alwaysNonCustodialImage}
                alt="always non-custodial"
                className={permissionlessVaultsStyles.alwaysNonCustodialImage}
              />
            </div>
          </div>
        </SubLandingPageSection>
        <div className={permissionlessVaultsStyles.startEarningWrapper}>
          <StartEarningNow id="permissionless-vaults" />
        </div>
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
      <div className={permissionlessVaultsStyles.faqWrapper}>
        <LandingPermissionlessDefiVaultsFaqSection />
      </div>
    </>
  )
}
