'use client'
import { Carousel, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { SummerFiProBox } from '@/components/layout/LandingPageContent'
import { LandingPageVaultPicker } from '@/components/organisms/LandingPageVaultPicker/LandingPageVaultPicker'
import { sdkApiUrl } from '@/constants/sdk'

import landingPageHeroStyles from '@/components/layout/LandingPageContent/components/LandingPageHero.module.scss'

export const LandingPageHero = ({ vaultsList }: { vaultsList: SDKVaultishType[] }) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <div className={landingPageHeroStyles.landingPageHeroWrapper}>
        <div className={landingPageHeroStyles.heroHeader}>
          <Text
            as="h1"
            variant="h1"
            style={{
              color: 'var(--earn-protocol-secondary-100)',
              textAlign: 'center',
              fontWeight: '600',
            }}
          >
            Automated Exposure to DeFi’s
          </Text>
          <Text
            as="h1"
            variant="h1"
            style={{
              color: 'var(--earn-protocol-primary-100)',
              textAlign: 'center',
              fontWeight: '600',
            }}
          >
            Highest Quality{' '}
            <span style={{ position: 'relative' }}>
              Yield
              <Text
                as="span"
                variant="p2"
                style={{ position: 'absolute', top: '-6px', right: '-8px' }}
              >
                1
              </Text>
            </span>
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
    </SDKContextProvider>
  )
}
