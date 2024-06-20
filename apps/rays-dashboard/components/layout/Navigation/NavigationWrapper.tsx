'use client'

import { FC } from 'react'
import { LoadingSpinner, Navigation, NavigationMenuPanelType } from '@summerfi/app-ui'
import { useConnectWallet } from '@web3-onboard/react'
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

export const NavigationWrapper: FC<NavigationWrapperProps> = ({ panels }) => {
  const currentPath = usePathname()
  const [{ wallet }] = useConnectWallet()

  return (
    <Navigation
      currentPath={currentPath}
      logo="/rays/img/branding/logo-dark.svg"
      logoSmall="/rays/img/branding/dot-dark.svg"
      links={
        wallet?.accounts[0].address
          ? [
              {
                label: 'Portfolio',
                link: `/portfolio/${wallet.accounts[0].address}`,
                active: true,
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
