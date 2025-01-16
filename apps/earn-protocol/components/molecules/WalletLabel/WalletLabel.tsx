import { useEffect } from 'react'
import { useAuthModal, useLogout, useSignerStatus } from '@account-kit/react'
import { Button, LoadableAvatar, SkeletonLine, Text } from '@summerfi/app-earn-ui'
import { formatAddress } from '@summerfi/app-utils'

import { useUserWallet } from '@/hooks/use-user-wallet'

import classNames from './WalletLabel.module.scss'

export default function WalletLabel() {
  const { userWalletAddress } = useUserWallet()

  const { openAuthModal, isOpen: isAuthModalOpen } = useAuthModal()
  const { isInitializing: isSignerInitializing, isAuthenticating: isSignerAuthenticating } =
    useSignerStatus()
  const { logout } = useLogout()

  const handleLogout = () => {
    logout()
  }

  // removes dark mode from the document
  // to ensure that account-kit modal is always in light mode
  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  if (isSignerInitializing || isAuthModalOpen || isSignerAuthenticating) {
    return (
      <Button variant="secondarySmall">
        <SkeletonLine width={100} height={10} style={{ opacity: 0.2 }} />
      </Button>
    )
  }

  if (userWalletAddress) {
    return (
      <Button
        variant="secondarySmall"
        onClick={handleLogout}
        style={{
          padding: '0 var(--general-space-12) 0 6px',
        }}
        className={classNames.wrapper}
      >
        <LoadableAvatar
          size={24}
          name={btoa(userWalletAddress)}
          variant="pixel"
          colors={['#B90061', '#EC58A2', '#F8A4CE', '#FFFFFF']}
        />
        <Text variant="p3semi" style={{ color: 'white', paddingLeft: 'var(--general-space-8)' }}>
          {formatAddress(userWalletAddress.toString(), { first: 6 })}
        </Text>
      </Button>
    )
  }

  return (
    <Button variant="secondarySmall" onClick={openAuthModal} className={classNames.wrapper}>
      Log in
    </Button>
  )
}
