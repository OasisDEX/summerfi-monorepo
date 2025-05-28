'use client'

import { type FC, useState } from 'react'
import {
  Button,
  getNavigationItems,
  Navigation,
  SkeletonLine,
  useHoldAlt,
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

const TheGame = dynamic(() => import('../../../features/game/components/MainGameView'), {
  ssr: false,
})

export const NavigationWrapper: FC = () => {
  const currentPath = usePathname()
  const { userWalletAddress } = useUserWallet()
  const isHoldingAlt = useHoldAlt()
  const [runningGame, setRunningGame] = useState(false)
  const { features } = useSystemConfig()

  return (
    <>
      <Navigation
        currentPath={currentPath}
        logo="/earn/img/branding/logo-dark.svg"
        logoSmall="/earn/img/branding/dot-dark.svg"
        links={getNavigationItems({
          userWalletAddress,
          isEarnApp: true,
        })}
        walletConnectionComponent={<WalletLabel />}
        mobileWalletConnectionComponents={{
          primary: <WalletLabel variant="logoutOnly" />,
          secondary: <WalletLabel variant="addressOnly" />,
        }}
        configComponent={<NavConfig />}
        onLogoClick={() => {
          // because router will use base path...
          window.location.replace('/')
        }}
        startTheGame={isHoldingAlt ? () => setRunningGame(true) : undefined}
        featuresConfig={features}
      />
      {runningGame && <TheGame closeGame={() => setRunningGame(false)} />}
    </>
  )
}
