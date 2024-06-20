'use client'

import { FC } from 'react'
import { LoadingSpinner, Navigation, NavigationMenuPanelType } from '@summerfi/app-ui'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

import { WalletButtonFallback } from '@/components/molecules/WalletButton/WalletButtonFallback'

const WalletButton = dynamic(() => import('@/components/molecules/WalletButton/WalletButton'), {
  ssr: false,
  loading: () => <WalletButtonFallback />,
})

interface NavigationWrapperProps {
  panels?: NavigationMenuPanelType[]
  connectedWalletAddress?: string
}
const NavigationModuleBridge = () => <LoadingSpinner />
const NavigationModuleSwap = () => <LoadingSpinner />

export const NavigationWrapper: FC<NavigationWrapperProps> = ({
  panels,
  connectedWalletAddress,
}) => {
  const currentPath = usePathname()

  return (
    <Navigation
      currentPath={currentPath}
      logo="/rays/img/branding/logo-dark.svg"
      logoSmall="/rays/img/branding/dot-dark.svg"
      links={
        connectedWalletAddress
          ? [
              {
                label: 'Portfolio',
                link: `/portfolio/${connectedWalletAddress}`,
              },
            ]
          : undefined
      }
      panels={panels}
      navigationModules={{
        NavigationModuleBridge,
        NavigationModuleSwap,
      }}
      walletConnectionComponent={<WalletButton />}
      onLogoClick={() => {
        window.location.href = '/'
      }}
    />
  )
}
