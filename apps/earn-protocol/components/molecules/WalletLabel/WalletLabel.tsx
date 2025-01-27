import { useEffect, useState } from 'react'
import { useAuthModal, useChain, useLogout, useSignerStatus } from '@account-kit/react'
import {
  Button,
  LoadableAvatar,
  SkeletonLine,
  Text,
  Tooltip,
  useMobileCheck,
} from '@summerfi/app-earn-ui'
import { formatAddress } from '@summerfi/app-utils'

import { networkSDKChainIdIconMap } from '@/constants/network-id-to-icon'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { useUserWallet } from '@/hooks/use-user-wallet'

import walletLabelStyles from './WalletLabel.module.scss'

export default function WalletLabel() {
  const [addressCopied, setAddressCopied] = useState(false)
  const { userWalletAddress } = useUserWallet()
  const { chain } = useChain()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

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

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setAddressCopied(true)
    setTimeout(() => {
      setAddressCopied(false)
    }, 2000)
  }

  if (isSignerInitializing || isAuthModalOpen || isSignerAuthenticating) {
    return (
      <Button variant="secondarySmall">
        <SkeletonLine width={100} height={10} style={{ opacity: 0.2 }} />
      </Button>
    )
  }

  if (userWalletAddress) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <Tooltip
          persistWhenOpened
          tooltip={
            <div className={walletLabelStyles.popupWrapper}>
              <div className={walletLabelStyles.walletAddressPopup}>
                <div>
                  <b>Connected on {chain.name.toLowerCase()}:</b>
                  <br />
                  {formatAddress(userWalletAddress.toString(), { first: 6 })}
                </div>
                <p
                  style={{ display: 'inline-block', cursor: 'pointer' }}
                  onClick={() => {
                    handleCopyAddress(userWalletAddress.toString())
                  }}
                >
                  {addressCopied ? 'copied!' : 'copy address'}
                </p>
              </div>
              <div className={walletLabelStyles.popupDivider} />
              <Button
                variant="primarySmall"
                onClick={handleLogout}
                className={walletLabelStyles.logoutButton}
              >
                Log out
              </Button>
            </div>
          }
          tooltipCardVariant="cardSecondarySmallPaddings"
          tooltipWrapperStyles={{
            marginLeft: '-170px',
            paddingTop: 'var(--general-space-20)',
          }}
        >
          <Button variant="secondarySmall" className={walletLabelStyles.mainButtonWrapper}>
            <LoadableAvatar
              size={24}
              name={btoa(userWalletAddress)}
              variant="pixel"
              colors={['#B90061', '#EC58A2', '#F8A4CE', '#FFFFFF']}
            />
            <div
              style={{
                position: 'absolute',
                top: '18px',
                left: '22px',
              }}
            >
              {networkSDKChainIdIconMap(chain.id, 12)}
            </div>
            <Text
              variant="p3semi"
              style={{ color: 'white', paddingLeft: 'var(--general-space-8)' }}
            >
              {formatAddress(userWalletAddress.toString(), { first: 6 })}
            </Text>
          </Button>
        </Tooltip>
        <div className={walletLabelStyles.mobileCopyLogoutButtons}>
          <Button
            variant="secondarySmall"
            onClick={() => {
              handleCopyAddress(userWalletAddress.toString())
            }}
          >
            Copy address
          </Button>
          <Button variant="primarySmall" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button variant="secondarySmall" onClick={openAuthModal} className={walletLabelStyles.wrapper}>
      Log in
    </Button>
  )
}
