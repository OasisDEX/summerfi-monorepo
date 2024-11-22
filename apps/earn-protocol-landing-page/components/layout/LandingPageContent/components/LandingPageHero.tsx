import { Carousel, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'

import { SummerFiProBox } from '@/components/layout/LandingPageContent'
import { LandingPageVaultPicker } from '@/components/organisms/LandingPageVaultPicker/LandingPageVaultPicker'

import landingPageHeroStyles from '@/components/layout/LandingPageContent/components/LandingPageHero.module.scss'

export const LandingPageHero = ({ vaultsList }: { vaultsList: SDKVaultsListType }) => {
  return (
    <div className={landingPageHeroStyles.landingPageHeroWrapper}>
      <div className={landingPageHeroStyles.heroHeader}>
        <Text
          as="h1"
          variant="h1"
          style={{ color: 'var(--earn-protocol-secondary-100)', textAlign: 'center' }}
        >
          Automated Exposure to DeFi’s
        </Text>
        <Text
          as="h1"
          variant="h1"
          style={{ color: 'var(--earn-protocol-primary-100)', textAlign: 'center' }}
        >
          Highest Quality Yield
        </Text>
      </div>
      <Carousel
        components={vaultsList.map((vault) => (
          <LandingPageVaultPicker vault={vault} key={vault.id} />
        ))}
        contentWidth={515}
      />
      <SummerFiProBox />
    </div>
  )
}
