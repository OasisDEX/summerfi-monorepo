import { useAccount, useAuthModal, useLogout, useSignerStatus, useUser } from '@account-kit/react'
import { Button, LoadableAvatar, SkeletonLine, Text } from '@summerfi/app-earn-ui'
import { formatAddress } from '@summerfi/app-utils'

import { accountType } from '@/account-kit/config'

import classNames from './WalletLabel.module.scss'

export default function WalletLabel() {
  const user = useUser()
  const { account } = useAccount({ type: accountType })

  const { openAuthModal, isOpen: isAuthModalOpen } = useAuthModal()
  const { isInitializing: isSignerInitializing, isAuthenticating: isSignerAuthenticating } =
    useSignerStatus()
  const { logout } = useLogout()

  const resolvedAddress = account?.address ?? user?.address

  const handleLogout = () => {
    logout()
  }

  if (isSignerInitializing || isAuthModalOpen || isSignerAuthenticating) {
    return (
      <Button variant="secondarySmall">
        <SkeletonLine width={100} height={10} style={{ opacity: 0.2 }} />
      </Button>
    )
  }

  if (resolvedAddress) {
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
          name={btoa(resolvedAddress)}
          variant="pixel"
          colors={['#B90061', '#EC58A2', '#F8A4CE', '#FFFFFF']}
        />
        <Text variant="p3semi" style={{ color: 'white', paddingLeft: 'var(--general-space-8)' }}>
          {formatAddress(resolvedAddress, { first: 6 })}
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
