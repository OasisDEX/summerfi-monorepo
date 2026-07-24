'use client'

import { type FC, useEffect, useRef } from 'react'
import {
  Button,
  getNavigationItems,
  Navigation,
  NavigationConfig,
  SkeletonLine,
  useEarnProtocolLogin,
  useEarnProtocolWallet,
  useMobileCheck,
} from '@summerfi/app-earn-ui'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
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
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const { login, isOpen } = useEarnProtocolLogin()
  const { deviceType } = useDeviceType()
  const { isMobileOrTablet } = useMobileCheck(deviceType)

  const loginResolverRef = useRef<((value: `0x${string}` | undefined) => void) | null>(null)
  const loginTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!loginResolverRef.current) {
      return () => {}
    }

    if (userWalletAddress) {
      loginResolverRef.current(userWalletAddress)
      loginResolverRef.current = null

      if (loginTimeoutRef.current) {
        clearTimeout(loginTimeoutRef.current)
        loginTimeoutRef.current = null
      }

      return () => {}
    }

    if (!isOpen && !loginTimeoutRef.current) {
      loginTimeoutRef.current = window.setTimeout(() => {
        if (loginResolverRef.current) {
          loginResolverRef.current(undefined)
          loginResolverRef.current = null
        }
        loginTimeoutRef.current = null
      }, 500)
    }

    return () => {
      if (loginTimeoutRef.current) {
        clearTimeout(loginTimeoutRef.current)
        loginTimeoutRef.current = null
      }
    }
  }, [isOpen, userWalletAddress])

  const handleLogIn = (): Promise<`0x${string}` | undefined> => {
    if (userWalletAddress) {
      return Promise.resolve(userWalletAddress)
    }

    login()

    return new Promise((resolve) => {
      if (loginResolverRef.current) {
        loginResolverRef.current(undefined)
      }
      loginResolverRef.current = resolve
    })
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

  const navigationItems = getNavigationItems({
    userWalletAddress,
    isEarnApp: true,
    onNavItemClick,
    logIn: handleLogIn,
  })

  return (
    <Navigation
      isEarnApp
      currentPath={currentPath}
      logo="/earn/img/branding/logo-dark.svg"
      logoSmall="/earn/img/branding/dot-dark.svg"
      links={navigationItems}
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
        window.location.replace('/earn')
      }}
    />
  )
}
