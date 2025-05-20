'use client'
import { useEffect, useState } from 'react'
import { useAuthModal, useLogout, useSignerStatus } from '@account-kit/react'
import {
  Button,
  type ButtonClassNames,
  Icon,
  LoadableAvatar,
  SkeletonLine,
  Text,
  type TextClassNames,
  Tooltip,
  useIsIframe,
} from '@summerfi/app-earn-ui'
import { formatAddress, safeBTOA, sdkChainIdToHumanNetwork } from '@summerfi/app-utils'

import { networkSDKChainIdIconMap } from '@/constants/network-id-to-icon'
import { useClientChainId } from '@/hooks/use-client-chain-id'
import { useUserWallet } from '@/hooks/use-user-wallet'

import walletLabelStyles from './WalletLabel.module.css'

type WalletLabelVariant = 'default' | 'addressOnly' | 'logoutOnly'

interface WalletLabelProps {
  variant?: WalletLabelVariant
  className?: string
  maxAddressChars?: number
  hideNetworkIcon?: boolean
}

// Types for internal components
interface WalletAvatarProps {
  address: string
  chainId: number
  size?: number
  iconSize?: number
  hideNetworkIcon?: boolean
}

interface AddressDisplayProps {
  address: string
  textVariant?: keyof typeof TextClassNames
  paddingLeft?: string
  maxChars?: number
}

interface CopyAddressButtonProps {
  address: string
  onCopy: (address: string) => void
  copied: boolean
  variant?: keyof typeof ButtonClassNames
}

interface LogoutButtonProps {
  onLogout: () => void
  variant?: keyof typeof ButtonClassNames
}

interface WalletTooltipContentProps {
  chainName: string
  address: string
  onCopy: (address: string) => void
  copied: boolean
  onLogout: () => void
}

// Avatar with network icon
const WalletAvatar = ({
  address,
  chainId,
  size = 24,
  iconSize = 12,
  hideNetworkIcon = false,
}: WalletAvatarProps) => (
  <>
    <LoadableAvatar
      size={size}
      name={safeBTOA(address)}
      variant="pixel"
      colors={['#B90061', '#EC58A2', '#F8A4CE', '#FFFFFF']}
    />
    {!hideNetworkIcon && (
      <div
        style={{
          position: 'absolute',
          top: size * 0.75,
          left: size * 0.9,
        }}
      >
        {networkSDKChainIdIconMap(chainId, iconSize)}
      </div>
    )}
  </>
)

// Address display component
const AddressDisplay = ({
  address,
  textVariant = 'p3semi',
  paddingLeft = 'var(--general-space-8)',
  maxChars = 6,
}: AddressDisplayProps) => (
  <Text variant={textVariant} style={{ color: 'white', paddingLeft }}>
    {formatAddress(address.toString(), { first: maxChars })}
  </Text>
)

// Copy address button
const CopyAddressButton = ({
  address,
  onCopy,
  copied,
  variant = 'textSecondarySmall',
}: CopyAddressButtonProps) => (
  <Button variant={variant} onClick={() => onCopy(address)}>
    {copied ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
        <Icon iconName="checkmark" size={12} />
        <span>Copied</span>
      </div>
    ) : (
      'Copy address'
    )}
  </Button>
)

// Logout button
const LogoutButton = ({ onLogout, variant = 'primaryMedium' }: LogoutButtonProps) => (
  <Button variant={variant} onClick={onLogout}>
    Log out
  </Button>
)

// Tooltip content for wallet info
const WalletTooltipContent = ({
  chainName,
  address,
  onCopy,
  copied,
  onLogout,
}: WalletTooltipContentProps) => (
  <div className={walletLabelStyles.popupWrapper}>
    <div className={walletLabelStyles.walletAddressPopup}>
      <div>
        <Text variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
          Connected on {chainName.toLowerCase()}:
        </Text>
        <br />
        <Text variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
          {formatAddress(address.toString(), { first: 6 })}
        </Text>
      </div>
      <Button
        variant="textPrimarySmall"
        className={walletLabelStyles.copyButton}
        onClick={() => onCopy(address)}
      >
        {copied ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
            <Icon iconName="checkmark" size={12} />
            <span>copied</span>
          </div>
        ) : (
          'copy address'
        )}
      </Button>
    </div>
    <div className={walletLabelStyles.popupDivider} />
    <Button variant="primaryMedium" onClick={onLogout} className={walletLabelStyles.logoutButton}>
      Log out
    </Button>
  </div>
)

export default function WalletLabel({
  variant = 'default',
  className = '',
  maxAddressChars,
  hideNetworkIcon = false,
}: WalletLabelProps) {
  const [addressCopied, setAddressCopied] = useState(false)
  const { userWalletAddress } = useUserWallet()
  const { clientChainId } = useClientChainId()

  const chainName = sdkChainIdToHumanNetwork(clientChainId)

  const { openAuthModal, isOpen: isAuthModalOpen } = useAuthModal()
  const { isInitializing: isSignerInitializing, isAuthenticating: isSignerAuthenticating } =
    useSignerStatus()
  const { logout } = useLogout()
  const isIframe = useIsIframe()

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

  // we are not showing the skeleton in iframe, because isSignerInitializing never goes to true
  if ((isSignerInitializing || isAuthModalOpen || isSignerAuthenticating) && !isIframe) {
    return (
      <Button variant="secondaryMedium">
        <SkeletonLine width={100} height={10} style={{ opacity: 0.2 }} />
      </Button>
    )
  }

  if (!userWalletAddress) {
    if (variant === 'addressOnly') return null

    return (
      <Button
        variant="secondaryMedium"
        onClick={openAuthModal}
        className={walletLabelStyles.wrapper}
      >
        Log in
      </Button>
    )
  }

  // Address-only variant - compact display of just the wallet address with network icon
  if (variant === 'addressOnly') {
    return (
      <div className={`${walletLabelStyles.addressOnlyWrapper} ${className}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-16)' }}>
          {addressCopied && (
            <div className={`${walletLabelStyles.copiedNotification}`}>
              <Icon iconName="checkmark" size={12} color="var(--earn-protocol-primary-100)" />
              <Text variant="p4semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
                Copied
              </Text>
            </div>
          )}

          <Button
            variant="secondaryMedium"
            className={walletLabelStyles.addressOnlyButton}
            onClick={() => handleCopyAddress(userWalletAddress)}
            style={{ height: '34px' }}
          >
            <WalletAvatar
              address={userWalletAddress}
              chainId={clientChainId}
              size={16}
              iconSize={8}
              hideNetworkIcon={hideNetworkIcon}
            />
            <AddressDisplay
              address={userWalletAddress}
              textVariant="p3semi"
              paddingLeft="var(--general-space-4)"
              maxChars={maxAddressChars ?? 4}
            />
          </Button>
        </div>
      </div>
    )
  }

  //  Logout-only variant - just the logout button without the address display
  if (variant === 'logoutOnly') {
    return (
      <div className={`${walletLabelStyles.actionsOnlyWrapper} ${className}`}>
        <LogoutButton onLogout={handleLogout} />
      </div>
    )
  }

  // Default full variant with all functionality
  return (
    <div>
      <Tooltip
        persistWhenOpened
        tooltip={
          <WalletTooltipContent
            chainName={chainName}
            address={userWalletAddress}
            onCopy={handleCopyAddress}
            copied={addressCopied}
            onLogout={handleLogout}
          />
        }
        tooltipCardVariant="cardSecondarySmallPaddings"
        tooltipWrapperStyles={{
          marginLeft: '-170px',
          paddingTop: 'var(--general-space-20)',
        }}
      >
        <div className={walletLabelStyles.mainActionsWrapper}>
          <Button variant="secondarySmall" className={walletLabelStyles.mainButtonWrapper}>
            <WalletAvatar
              address={userWalletAddress}
              chainId={clientChainId}
              size={24}
              iconSize={12}
              hideNetworkIcon={hideNetworkIcon}
            />
            <AddressDisplay address={userWalletAddress} maxChars={maxAddressChars ?? 6} />
          </Button>
        </div>
      </Tooltip>
      <div className={walletLabelStyles.mobileCopyLogoutButtons}>
        <LogoutButton onLogout={handleLogout} variant="primaryMedium" />
        <CopyAddressButton
          address={userWalletAddress.toString()}
          onCopy={handleCopyAddress}
          copied={addressCopied}
          variant="textSecondaryMedium"
        />
      </div>
    </div>
  )
}
