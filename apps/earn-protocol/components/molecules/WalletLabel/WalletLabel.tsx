import { useAuthModal, useLogout, useSignerStatus, useUser } from '@account-kit/react'
import { Button, LoadableAvatar, SkeletonLine, Text } from '@summerfi/app-earn-ui'
import { formatAddress } from '@summerfi/app-utils'

export default function WalletLabel() {
  const user = useUser()
  const { openAuthModal, isOpen: isAuthModalOpen } = useAuthModal()
  const { isInitializing: isSignerInitializing, isAuthenticating: isSignerAuthenticating } =
    useSignerStatus()
  const { logout } = useLogout()

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

  if (user) {
    return (
      <Button
        variant="secondarySmall"
        onClick={handleLogout}
        style={{
          padding: '0 var(--general-space-12) 0 var(--general-space-4)',
        }}
      >
        <LoadableAvatar
          size={24}
          name={btoa(user.address)}
          variant="pixel"
          colors={['#B90061', '#EC58A2', '#F8A4CE', '#FFFFFF']}
        />
        <Text variant="p3semi" style={{ color: 'white', paddingLeft: 'var(--general-space-8)' }}>
          {formatAddress(user.address, { first: 6 })}
        </Text>
      </Button>
    )
  }

  return (
    <Button variant="secondarySmall" onClick={openAuthModal}>
      Log in
    </Button>
  )
}
