'use client'
import { HomepageCarousel, Text, useMobileCheck, WithArrow } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'
import Link from 'next/link'

import { type GetVaultsApyResponse } from '@/app/server-handlers/vaults-apy'
import { sdkApiUrl } from '@/constants/sdk'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'

import landingPageHeroStyles from '@/components/layout/LandingPageContent/components/LandingPageHero.module.css'

export const LandingPageHero = ({
  vaultsList,
  vaultsApyByNetworkMap,
}: {
  vaultsList: SDKVaultishType[]
  vaultsApyByNetworkMap: GetVaultsApyResponse
}) => {
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

  const isMobileOrTablet = isMobile || isTablet

  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <div className={landingPageHeroStyles.landingPageHeroWrapper}>
        <div className={landingPageHeroStyles.heroHeader}>
          {isMobileOrTablet ? (
            <div className={landingPageHeroStyles.heroHeaderMobile}>
              {headerPartA}
              {headerPartB}
            </div>
          ) : (
            headerPartA
          )}
          {!isMobileOrTablet && headerPartB}
        </div>
        <HomepageCarousel vaultsList={vaultsList} vaultsApyByNetworkMap={vaultsApyByNetworkMap} />
        <Link href="/earn">
          <Text className={landingPageHeroStyles.viewAllStrategies} variant="p3semi">
            <WithArrow style={{ color: 'white' }}>
              View all {vaultsList.length} strategies
            </WithArrow>
          </Text>
        </Link>
      </div>
    </SDKContextProvider>
  )
}
