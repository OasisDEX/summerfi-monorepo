'use client'

import { FC, useEffect, useState } from 'react'
import { Navigation, NavigationMenuPanelType } from '@summerfi/app-ui'
import { useConnectWallet } from '@web3-onboard/react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

import {
  NavigationModuleBridge,
  NavigationModuleSwap,
} from '@/components/layout/Navigation/NavigationModules'
import { BridgeSwapHandlerLoader } from '@/components/molecules/BridgeSwap/BridgeSwapLoader'
import { BridgeSwapWrapper } from '@/components/molecules/BridgeSwap/BridgeSwapWrapper'
import { RaysCountComponent } from '@/components/molecules/RaysCountComponent/RaysCountComponent'
import { WalletButtonFallback } from '@/components/molecules/WalletButton/WalletButtonFallback'

const WalletButton = dynamic(() => import('@/components/molecules/WalletButton/WalletButton'), {
  ssr: false,
  loading: () => <WalletButtonFallback />,
})

const BridgeSwap = !process.env.NEXT_PUBLIC_SWAP_WIDGET_ONBOARDING_HIDDEN
  ? dynamic(() => import('@/components/molecules/BridgeSwap/BridgeSwap'), {
      ssr: false,
      loading: () => <BridgeSwapHandlerLoader />,
    })
  : () => null

interface NavigationWrapperProps {
  panels?: NavigationMenuPanelType[]
}

export const NavigationWrapper: FC<NavigationWrapperProps> = ({ panels }) => {
  const [{ wallet }] = useConnectWallet()
  const [showNavigationModule, setShowNavigationModule] = useState<'swap' | 'bridge'>()
  // to prevent suddenly dissapearing bridge/swap module
  // once loaded, stays loaded
  const [onceLoaded, setOnceLoaded] = useState(false)
  const currentPath = usePathname()

  useEffect(() => {
    if (showNavigationModule && !onceLoaded) {
      setOnceLoaded(true)
    }
  }, [showNavigationModule, onceLoaded])

  return (
    <Navigation
      currentPath={currentPath}
      logo="/img/branding/logo-dark.svg"
      logoSmall="/img/branding/dot-dark.svg"
      links={
        wallet?.accounts[0].address
          ? [
              {
                label: 'Portfolio',
                link: `/portfolio/${wallet.accounts[0].address}`,
              },
            ]
          : undefined
      }
      panels={panels}
      navigationModules={{
        NavigationModuleBridge: (
          <NavigationModuleBridge setShowNavigationModule={setShowNavigationModule} />
        ),
        NavigationModuleSwap: (
          <NavigationModuleSwap setShowNavigationModule={setShowNavigationModule} />
        ),
      }}
      additionalModule={
        <BridgeSwapWrapper
          showNavigationModule={showNavigationModule}
          setShowNavigationModule={setShowNavigationModule}
        >
          {onceLoaded && (
            <BridgeSwap
              showNavigationModule={showNavigationModule}
              setShowNavigationModule={setShowNavigationModule}
            />
          )}
        </BridgeSwapWrapper>
      }
      raysCountComponent={<RaysCountComponent />}
      walletConnectionComponent={<WalletButton />}
      onLogoClick={() => {
        // because router will use base path...
        window.location.href = '/'
      }}
    />
  )
}
