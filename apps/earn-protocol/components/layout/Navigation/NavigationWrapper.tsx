'use client'

import { type FC, useEffect } from 'react'
import {
  Button,
  getNavigationItems,
  Navigation,
  NavigationConfig,
  NavigationExtraComponents,
  SkeletonLine,
  useCurrentUrl,
  useMobileCheck,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

import { AutoConnectSafe } from '@/components/molecules/AutoConnectSafe/AutoConnectSafe'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { NavConfigContent } from '@/features/nav-config/components/NavConfigContent/NavConfigContent'
import { EarnProtocolEvents } from '@/helpers/mixpanel'

const WalletLabel = dynamic(() => import('../../molecules/WalletLabel/WalletLabel'), {
  ssr: false,
  loading: () => (
    <Button variant="secondarySmall">
      <SkeletonLine width={100} height={10} style={{ opacity: 0.2 }} />
    </Button>
  ),
})

export const NavigationWrapper: FC<{ sumrPriceUsd?: number }> = ({ sumrPriceUsd }) => {
  const currentPath = usePathname()
  const path = useCurrentUrl()
  const { userWalletAddress } = useUserWallet()
  const { features, setRunningGame, setIsGameByInvite } = useSystemConfig()
  const { deviceType } = useDeviceType()
  const { isMobileOrTablet } = useMobileCheck(deviceType)
  const startGame = () => {
    setRunningGame?.(true)
  }

  const onNavItemClick = ({
    buttonName,
    isEarnApp,
  }: {
    buttonName: string
    isEarnApp?: boolean
  }) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `${isEarnApp ? 'ep' : 'lp'}-navigation-${buttonName}`,
      page: currentPath,
    })
  }

  const isCampaignPage = currentPath.startsWith('/campaigns')

  const beachClubEnabled = !!features?.BeachClub

  // check if the current URL has a `game` query parameter

  useEffect(() => {
    const url = new URL(`${path.startsWith('/') ? window.location.origin : ''}${path}`)

    const isLinkedToGame = url.searchParams.has('game')

    if (isLinkedToGame) {
      // scroll to the top of the page
      window.scrollTo(0, 0)
      setRunningGame?.(true)
      setIsGameByInvite?.(true) // Set the game as being started by an invite link
      // remove the `game` from the URL search params
      if (typeof window !== 'undefined') {
        url.searchParams.delete('game')
        window.history.replaceState({}, '', url.toString())
      }
    }
  }, [setRunningGame, setIsGameByInvite, path])

  return (
    <Navigation
      isEarnApp
      userWalletAddress={userWalletAddress}
      currentPath={currentPath}
      logo="/earn/img/branding/logo-dark.svg"
      logoSmall="/earn/img/branding/dot-dark.svg"
      links={getNavigationItems({
        userWalletAddress,
        isEarnApp: true,
        features,
        onNavItemClick,
      })}
      walletConnectionComponent={!isCampaignPage ? <WalletLabel /> : null}
      mobileWalletConnectionComponents={{
        primary: <WalletLabel variant="logoutOnly" />,
        secondary: <WalletLabel variant="addressOnly" />,
      }}
      configComponent={
        <NavigationConfig isMobileOrTablet={isMobileOrTablet}>
          {(handleOpenClose) => (
            <NavConfigContent handleOpenClose={handleOpenClose} sumrPriceUsd={sumrPriceUsd} />
          )}
        </NavigationConfig>
      }
      onLogoClick={() => {
        onNavItemClick({ buttonName: 'logo', isEarnApp: true })
        // because router will use base path...
        window.location.replace('/')
      }}
      startTheGame={features?.Game ? startGame : undefined}
      featuresConfig={features}
      extraComponents={
        <>
          <AutoConnectSafe />
          <NavigationExtraComponents
            beachClubEnabled={beachClubEnabled}
            isEarnApp
            userWalletAddress={userWalletAddress}
            onNavItemClick={onNavItemClick}
          />
        </>
      }
    />
  )
}
