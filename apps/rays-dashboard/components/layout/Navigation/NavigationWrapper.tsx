'use client'

import { FC } from 'react'
import { Button, LoadingSpinner, Navigation, NavigationMenuPanelType, Text } from '@summerfi/app-ui'
import { usePathname } from 'next/navigation'

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
      logo="img/branding/logo-dark.svg"
      logoSmall="img/branding/dot-dark.svg"
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
      walletConnectionComponent={
        <Button variant="secondarySmall" style={{ backgroundColor: 'var(--color-neutral-10)' }}>
          <Text
            variant="p4"
            style={{
              marginRight: 'var(--space-xl)',
              marginLeft: 'var(--space-xl)',
            }}
          >
            loaded wallet :)
          </Text>
        </Button>
      }
    />
  )
}
