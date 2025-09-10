'use client'

import { type FC } from 'react'
import {
  Button,
  Card,
  Icon,
  Navigation,
  NavigationConfig,
  SkeletonLine,
  Text,
  useMobileCheck,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContext/AuthContext'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'

const WalletLabel = dynamic(() => import('../../molecules/WalletLabel/WalletLabel'), {
  ssr: false,
  loading: () => (
    <Button variant="secondarySmall">
      <SkeletonLine width={100} height={10} style={{ opacity: 0.2 }} />
    </Button>
  ),
})

export const NavigationWrapper: FC = () => {
  const { deviceType } = useDeviceType()
  const { isMobileOrTablet } = useMobileCheck(deviceType)
  const router = useRouter()
  const currentPath = usePathname()
  const { userWalletAddress } = useUserWallet()
  const { features } = useSystemConfig()
  const { signOut } = useAuth()

  const isLoginPage = currentPath === '/'

  return (
    <Navigation
      isEarnApp
      userWalletAddress={userWalletAddress}
      currentPath={currentPath}
      logo="/img/branding/logo-dark.svg"
      logoSmall="/img/branding/dot-dark.svg"
      walletConnectionComponent={
        !isLoginPage ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button
              variant="secondaryMedium"
              onClick={signOut}
              style={{ display: 'flex', gap: '14px', alignItems: 'center' }}
            >
              <Icon iconName="user" size={14} />
              Log out
            </Button>
            <WalletLabel buttonVariant="secondaryMedium" />
          </div>
        ) : undefined
      }
      mobileWalletConnectionComponents={
        !isLoginPage
          ? {
              primary: <WalletLabel variant="logoutOnly" />,
              secondary: <WalletLabel variant="addressOnly" />,
            }
          : undefined
      }
      configComponent={
        !isLoginPage ? (
          <NavigationConfig isMobileOrTablet={isMobileOrTablet}>
            {() => (
              <Card style={{ minWidth: '200px' }}>
                <Text as="p" variant="p2semi">
                  TBD
                </Text>
              </Card>
            )}
          </NavigationConfig>
        ) : undefined
      }
      onLogoClick={() => router.push('/')}
      featuresConfig={features}
    />
  )
}
