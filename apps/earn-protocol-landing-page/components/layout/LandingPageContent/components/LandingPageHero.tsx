'use client'
import { Carousel, Text, useMobileCheck } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { type GetVaultsApyResponse } from '@/app/server-handlers/vaults-apy'
import { SummerFiProBox } from '@/components/layout/LandingPageContent'
import { LandingPageVaultPicker } from '@/components/organisms/LandingPageVaultPicker/LandingPageVaultPicker'
import { sdkApiUrl } from '@/constants/sdk'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'

import landingPageHeroStyles from '@/components/layout/LandingPageContent/components/LandingPageHero.module.scss'

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
            <LandingPageVaultPicker
              vault={vault}
              key={vault.id}
              apy={
                vaultsApyByNetworkMap[`${vault.id}-${subgraphNetworkToId(vault.protocol.network)}`]
              }
            />
          ))}
          contentWidth={515}
        />
        <SummerFiProBox />
      </div>
    </SDKContextProvider>
  )
}
