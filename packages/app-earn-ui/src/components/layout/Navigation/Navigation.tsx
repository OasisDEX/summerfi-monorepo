'use client'

import { type CSSProperties, type FC, type ReactNode, useEffect, useMemo, useState } from 'react'
import { type EarnAppConfigType, type NavigationMenuPanelLinkType } from '@summerfi/app-types'

import { NavigationActions } from '@/components/layout/Navigation/NavigationActions'
import { NavigationBranding } from '@/components/layout/Navigation/NavigationBranding'
import { type NavigationItemsProps } from '@/components/layout/Navigation/NavigationItems'
import { NavigationMenu } from '@/components/layout/Navigation/NavigationMenu'
import { NavigationMenuMobile } from '@/components/layout/Navigation/NavigationMenuMobile'
import {
  MobileDrawer,
  MobileDrawerDefaultWrapper,
} from '@/components/molecules/MobileDrawer/MobileDrawer'
import { useMobileCheck } from '@/hooks/use-mobile-check'

import navigationStyles from '@/components/layout/Navigation/Navigation.module.css'

export interface EarnNavigationProps {
  isEarnApp?: boolean
  currentPath: string
  logo: string
  logoSmall: string
  links?: (Omit<NavigationMenuPanelLinkType, 'link' | 'onClick'> & {
    id: string
    itemsList?: NavigationItemsProps['items']
    dropdownContent?: ReactNode
    link?: string
    target?: '_blank' | '_self'
    disabled?: boolean
    prefetchDisabled?: boolean
    onClick?: () => void
    style?: CSSProperties
  })[]
  walletConnectionComponent?: ReactNode
  mobileWalletConnectionComponents?: {
    primary?: ReactNode
    secondary?: ReactNode
  }
  configComponent?: ReactNode
  signupComponent?: ReactNode
  extraComponents?: ReactNode
  noNavMargin?: boolean
  onLogoClick?: () => void
  startTheGame?: () => void
  featuresConfig?: EarnAppConfigType['features']
  userWalletAddress?: string
}

export const Navigation: FC<EarnNavigationProps> = ({
  isEarnApp = false,
  logo,
  logoSmall,
  links,
  currentPath,
  walletConnectionComponent,
  mobileWalletConnectionComponents,
  configComponent,
  signupComponent,
  extraComponents,
  noNavMargin = false,
  onLogoClick,
  startTheGame,
  featuresConfig,
  userWalletAddress,
}) => {
  const [tempCurrentPath, setTempCurrentPath] = useState(currentPath)
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false)
  const { isMobile, isTablet } = useMobileCheck()
  const defaultBodyOverflow = useMemo(() => {
    if (typeof document !== 'undefined') {
      return document.body.style.overflow
    }

    return undefined
  }, [])

  const toggleMobileMenu = () => {
    const nextValue = !mobileMenuOpened

    if (nextValue) {
      // mobile menu
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden'
      }
    } else if (typeof document !== 'undefined' && defaultBodyOverflow) {
      document.body.style.overflow = defaultBodyOverflow
    }
    setMobileMenuOpened(!mobileMenuOpened)
  }

  useEffect(() => {
    if (tempCurrentPath !== currentPath) {
      setTempCurrentPath(currentPath)
      setMobileMenuOpened(false)
      if (defaultBodyOverflow) {
        document.body.style.overflow = defaultBodyOverflow
      }
    }
  }, [currentPath, tempCurrentPath, defaultBodyOverflow])

  return (
    <div
      className={`${navigationStyles.wrapper} ${noNavMargin ? navigationStyles.noNavMargin : ''}`}
    >
      <header className={navigationStyles.container}>
        <NavigationBranding logo={logo} logoSmall={logoSmall} onLogoClick={onLogoClick} />
        {!isMobile && <NavigationMenu links={links} currentPath={currentPath} />}
        <NavigationActions
          walletConnectionComponent={walletConnectionComponent}
          signUpComponent={signupComponent}
          toggleMobileMenu={toggleMobileMenu}
          configComponent={configComponent}
          startTheGame={startTheGame}
          extraComponents={extraComponents}
        />
      </header>
      {(isMobile || isTablet) && (
        <MobileDrawer
          isOpen={mobileMenuOpened}
          onClose={() => setMobileMenuOpened(false)}
          slideFrom="top"
          height="auto"
          variant="default"
          zIndex={1001}
        >
          <MobileDrawerDefaultWrapper slideFrom="top">
            <NavigationMenuMobile
              featuresConfig={featuresConfig}
              logo={logoSmall}
              links={links}
              currentPath={currentPath}
              toggleMobileMenu={toggleMobileMenu}
              walletConnectionComponent={
                mobileWalletConnectionComponents?.primary ?? walletConnectionComponent
              }
              secondaryWalletConnectionComponent={
                mobileWalletConnectionComponents?.secondary ?? walletConnectionComponent
              }
              signUpComponent={signupComponent}
              userWalletAddress={userWalletAddress}
              isEarnApp={isEarnApp}
            />
          </MobileDrawerDefaultWrapper>
        </MobileDrawer>
      )}
    </div>
  )
}
