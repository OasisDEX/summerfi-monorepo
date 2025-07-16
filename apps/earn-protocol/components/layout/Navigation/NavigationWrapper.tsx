'use client'

import { type FC, useEffect } from 'react'
import {
  Button,
  getNavigationItems,
  Navigation,
  SkeletonLine,
  useCurrentUrl,
} from '@summerfi/app-earn-ui'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { NavConfig } from '@/features/nav-config/components/NavConfig/NavConfig'
import { useUserWallet } from '@/hooks/use-user-wallet'

const WalletLabel = dynamic(() => import('../../molecules/WalletLabel/WalletLabel'), {
  ssr: false,
  loading: () => (
    <Button variant="secondarySmall">
      <SkeletonLine width={100} height={10} style={{ opacity: 0.2 }} />
    </Button>
  ),
})

export const NavigationWrapper: FC = () => {
  const currentPath = usePathname()
  const path = useCurrentUrl()
  const { userWalletAddress } = useUserWallet()
  const { features, setRunningGame, setIsGameByInvite } = useSystemConfig()

  const startGame = () => {
    setRunningGame?.(true)
  }

  const isCampaignPage = currentPath.startsWith('/campaigns')

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
      })}
      walletConnectionComponent={!isCampaignPage ? <WalletLabel /> : null}
      mobileWalletConnectionComponents={{
        primary: <WalletLabel variant="logoutOnly" />,
        secondary: <WalletLabel variant="addressOnly" />,
      }}
      configComponent={<NavConfig />}
      onLogoClick={() => {
        // because router will use base path...
        window.location.replace('/')
      }}
      startTheGame={features?.Game ? startGame : undefined}
      featuresConfig={features}
    />
  )
}
