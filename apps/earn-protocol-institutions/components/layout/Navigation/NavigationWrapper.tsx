'use client'

import { type FC } from 'react'
import { Card, Navigation, NavigationConfig, Text, useMobileCheck } from '@summerfi/app-earn-ui'
import { usePathname, useRouter } from 'next/navigation'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
// import { useUserWallet } from '@/hooks/use-user-wallet'

// const WalletLabel = dynamic(() => import('../../molecules/WalletLabel/WalletLabel'), {
//   ssr: false,
//   loading: () => (
//     <Button variant="secondarySmall">
//       <SkeletonLine width={100} height={10} style={{ opacity: 0.2 }} />
//     </Button>
//   ),
// })

export const NavigationWrapper: FC = () => {
  const { deviceType } = useDeviceType()
  const { isMobileOrTablet } = useMobileCheck(deviceType)
  const router = useRouter()
  const currentPath = usePathname()
  // const { userWalletAddress } = useUserWallet()
  const { features } = useSystemConfig()

  return (
    <Navigation
      isEarnApp
      // userWalletAddress={userWalletAddress}
      userWalletAddress={undefined}
      currentPath={currentPath}
      logo="/img/branding/logo-dark.svg"
      logoSmall="/img/branding/dot-dark.svg"
      links={[]}
      // walletConnectionComponent={!isCampaignPage ? <WalletLabel /> : null}
      // mobileWalletConnectionComponents={{
      //   primary: <WalletLabel variant="logoutOnly" />,
      //   secondary: <WalletLabel variant="addressOnly" />,
      // }}
      configComponent={
        <NavigationConfig isMobileOrTablet={isMobileOrTablet}>
          {() => (
            <Card style={{ minWidth: '200px' }}>
              <Text as="p" variant="p2semi">
                TBD
              </Text>
            </Card>
          )}
        </NavigationConfig>
      }
      onLogoClick={() => router.push('/')}
      featuresConfig={features}
    />
  )
}
