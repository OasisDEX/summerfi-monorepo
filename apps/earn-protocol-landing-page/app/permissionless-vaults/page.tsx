'use client'

import { Emphasis, Text, VaultCardsCarousel } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import { TagButton } from '@/components/atoms/TagButton'
import { LandingPageBlobs } from '@/components/layout/LandingMasterPage/LandingPageBlobs'
import { CheckLine } from '@/components/layout/LandingPageContent/components/CheckLine'
import { HeroWrapper } from '@/components/layout/sub-pages/HeroWrapper'
import { ProtocolIconsWithMore } from '@/components/layout/sub-pages/ProtocolIconsWithMore'
import { SubLandingPageSection } from '@/components/layout/sub-pages/SubLandingPageSection'
import { useLandingPageData } from '@/contexts/LandingPageContext'

import permissionlessVaultsStyles from './PermissionlessVaults.module.css'

import vaultExposureScreenshot from '@/public/img/landing-page/vault-exposure-screenshot.png'

export default function PermissionlessVaults() {
  const { landingPageData } = useLandingPageData()

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
        <SubLandingPageSection
          className={`${permissionlessVaultsStyles.subLandingPageSectionFirst}`}
        >
          <div className={permissionlessVaultsStyles.subLandingPageSectionFirstData}>
            <div className={permissionlessVaultsStyles.subLandingPageTextColumn}>
              <Text variant="p3colorful">Consistently outperform benchmark yield</Text>
              <Text variant="h3">
                Lazy Summer keeps your capital continuously allocated across the DeFi yield market
              </Text>
              <Text variant="p1" className={permissionlessVaultsStyles.subLandingPageSubtext}>
                Lazy Summer’s approach to risk is holistic and not siloed by a single protocol, with
                Block Analitica providing independent, continuous oversight.
              </Text>
              <CheckLine text="Outperform single protocol strategies by staying allocated to the best available rates." />
              <CheckLine text="Capture fluctuating rate movements" />
              <CheckLine text="Compounding rewards, and consistently outperforming the benchmarks." />
              <ProtocolIconsWithMore limit={5} />
            </div>
            <div className={permissionlessVaultsStyles.vaultExposureScreenshotWrapper}>
              <Image src={vaultExposureScreenshot} alt="vault exposure screenshot" />
            </div>
          </div>
        </SubLandingPageSection>
        <SubLandingPageSection>divasd</SubLandingPageSection>
        <SubLandingPageSection>divasd</SubLandingPageSection>
      </div>
    </>
  )
}
