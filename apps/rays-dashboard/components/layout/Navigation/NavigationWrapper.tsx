'use client'

import { FC } from 'react'
import { LoadingSpinner, Navigation, NavigationMenuPanelType } from '@summerfi/app-ui'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

import { WalletButtonFallback } from '@/components/molecules/WalletButton/WalletButtonFallback'
import { basePath } from '@/helpers/base-path'

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

export const NavigationWrapper: FC<NavigationWrapperProps> = ({ panels }) => {
  const currentPath = usePathname()

  return (
    <Navigation
      currentPath={currentPath}
      logo={`${basePath}/img/branding/logo-dark.svg`}
      logoSmall={`${basePath}/img/branding/dot-dark.svg`}
      links={undefined}
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
