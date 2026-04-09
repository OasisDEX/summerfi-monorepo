import { Emphasis, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import { TagButton } from '@/components/atoms/TagButton'
import { HeroWrapper } from '@/components/layout/HeroWrapper/HeroWrapper'
import { SubLandingPageSection } from '@/components/layout/SubLandingPageSection/SubLandingPageSection'
import { FractalGlassBackground } from '@/components/molecules/FractalGlassBackground/FractalGlassBackground'
import m1CapitalLogo from '@/public/img/landing-page/private-markets/m1_capital.svg'

import rwaVaultsStyles from './RwaVaults.module.css'

import apolloMarketLogo from '@/public/img/landing-page/private-markets/apollo.png'
import mapleMarketLogo from '@/public/img/landing-page/private-markets/maple.png'
import stacMarketLogo from '@/public/img/landing-page/private-markets/stac.png'
import superstateMarketLogo from '@/public/img/landing-page/private-markets/superstate.png'
import vaneckMarketLogo from '@/public/img/landing-page/private-markets/vaneck.png'
import wisdomTreeMarketLogo from '@/public/img/landing-page/private-markets/wisdomtree.png'

export default function RwaVaults() {
  return (
    <>
      <HeroWrapper className={rwaVaultsStyles.heroWrapper}>
        <div className={rwaVaultsStyles.heroBackground}>
          <FractalGlassBackground />
        </div>
        <div className={rwaVaultsStyles.heroContent}>
          <TagButton>Permissioned RWA Vault</TagButton>
          <Text variant="h1">
            <Emphasis variant="h1colorful">Institutional grade DeFi yield.</Emphasis>
            <br />
            Private, diversified and automated.
          </Text>
          <Text variant="p1" className={rwaVaultsStyles.heroParagraph}>
            The Summer.fi Institutional private access RWA Vault, managed by M1 Capital, gives
            automated access to the highest quality RWA markets designed exclusively for qualified
            investors.
          </Text>
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
            <Image
              alt="WisdomTree"
              src={wisdomTreeMarketLogo}
              className={rwaVaultsStyles.partnerLogo}
            />
            <Image alt="Maple" src={mapleMarketLogo} className={rwaVaultsStyles.partnerLogo} />
            <Image alt="Vaneck" src={vaneckMarketLogo} className={rwaVaultsStyles.partnerLogo} />
            <Image alt="Stac" src={stacMarketLogo} className={rwaVaultsStyles.partnerLogo} />
            <Image alt="Apollo" src={apolloMarketLogo} className={rwaVaultsStyles.partnerLogo} />
            <Image
              alt="Superstate"
              src={superstateMarketLogo}
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
          </div>
          <div className={rwaVaultsStyles.partnerLogoFrame}>
            <Image alt="M1 Capital" src={m1CapitalLogo} width={290} />
          </div>
        </div>
      </SubLandingPageSection>
    </>
  )
}
