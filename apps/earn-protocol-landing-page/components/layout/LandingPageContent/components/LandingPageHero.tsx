'use client'
import { Carousel, Text, useMobileCheck } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { SummerFiProBox } from '@/components/layout/LandingPageContent'
import { LandingPageVaultPicker } from '@/components/organisms/LandingPageVaultPicker/LandingPageVaultPicker'
import { sdkApiUrl } from '@/constants/sdk'

import landingPageHeroStyles from '@/components/layout/LandingPageContent/components/LandingPageHero.module.scss'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'

export const LandingPageHero = ({ vaultsList }: { vaultsList: SDKVaultishType[] }) => {
  const { deviceType } = useDeviceType()
  const { isMobile, isTablet } = useMobileCheck(deviceType)

  const headerPartA = (
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
  )

  const headerPartB = (
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
        <Text as="span" variant="p2" style={{ position: 'absolute', top: '-6px', right: '-8px' }}>
          1
        </Text>
      </span>
    </Text>
  )

  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <div className={landingPageHeroStyles.landingPageHeroWrapper}>
        <div className={landingPageHeroStyles.heroHeader}>
          {isMobile || isTablet ? (
            <div className={landingPageHeroStyles.heroHeaderMobile}>
              {headerPartA}
              {headerPartB}
            </div>
          ) : (
            headerPartA
          )}
          {isMobile || isTablet ? null : headerPartB}
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
