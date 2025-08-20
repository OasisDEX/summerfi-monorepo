'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuthModal, useLogout } from '@account-kit/react'
import { Button, EXTERNAL_LINKS, Text, useUserWallet } from '@summerfi/app-earn-ui'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    okxwallet?: {
      isOkxWallet: boolean
      selectedAddress?: string
    }
  }
}

const handleConnectedWallet = ({
  parsedAddress,
  setIsOkxWalletSetUp,
  setIsSettingUpOkxWallet,
}: {
  parsedAddress: string
  setIsOkxWalletSetUp: (isOkxWalletSetUp: boolean) => void
  setIsSettingUpOkxWallet: (isSettingUpOkxWallet: boolean) => void
}) => {
  setIsSettingUpOkxWallet(true)
  setIsOkxWalletSetUp(false)
  fetch(`/earn/api/campaigns/okx/${parsedAddress}`).then((getResponse) => {
    if (getResponse.ok) {
      getResponse.json().then((getData) => {
        setIsOkxWalletSetUp(getData.okxWallet)
        setIsSettingUpOkxWallet(false)
        if (!getData.okxWallet) {
          fetch(`/earn/api/campaigns/okx/${parsedAddress}`, {
            method: 'POST',
            body: JSON.stringify({
              address: parsedAddress,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }).then((postResponse) => {
            if (postResponse.ok) {
              setIsSettingUpOkxWallet(false)
              postResponse.json().then((postData) => {
                setIsOkxWalletSetUp(postData.okxWallet)
              })
            }
          })
        }
      })
    } else {
      setIsOkxWalletSetUp(false)
    }
  })
}

export const OkxConnectButton = () => {
  const { push } = useRouter()
  const [isSettingUpOkxWallet, setIsSettingUpOkxWallet] = useState(false)
  const [isOkxWalletSetUp, setIsOkxWalletSetUp] = useState(false)
  const { openAuthModal, isOpen: isAuthModalOpen, closeAuthModal } = useAuthModal()
  const { logout } = useLogout()
  const { userWalletAddress } = useUserWallet()
  const isConnected = !!userWalletAddress
  const isOkxWalletAvailable = useMemo(() => {
    return !!window.okxwallet?.isOkxWallet
  }, [])

  const okxWalletConnected = useMemo(() => {
    return window.okxwallet?.selectedAddress
  }, [])

  const isSameWallet = useMemo(() => {
    return (
      userWalletAddress && userWalletAddress.toLowerCase() === okxWalletConnected?.toLowerCase()
    )
  }, [userWalletAddress, okxWalletConnected])

  const tryAgainAction = useMemo(() => {
    return () => {
      setIsOkxWalletSetUp(false)
      setIsSettingUpOkxWallet(false)
      closeAuthModal()
      logout()
      setTimeout(() => {
        openAuthModal()
      }, 500)
    }
  }, [logout, openAuthModal, closeAuthModal])

  useEffect(() => {
    if (isOkxWalletAvailable && isConnected && isSameWallet) {
      const parsedAddress = userWalletAddress.toLowerCase()

      handleConnectedWallet({ parsedAddress, setIsOkxWalletSetUp, setIsSettingUpOkxWallet })
    }
  }, [isConnected, isOkxWalletAvailable, userWalletAddress, isSameWallet])

  const buttonLabel = useMemo(() => {
    if (!isOkxWalletAvailable) {
      return 'OKX wallet is not installed'
    }
    if (isConnected && !isSameWallet) {
      return 'You are currently connected with a non-OKX wallet'
    }
    if ((isConnected && !isOkxWalletSetUp) || isAuthModalOpen || isSettingUpOkxWallet) {
      return 'Loading'
    }
    if (!isConnected) {
      return 'Connect your OKX wallet'
    }
    if (isOkxWalletSetUp) {
      return 'Your OKX wallet is connected'
    }

    return 'Your OKX wallet is connected'
  }, [
    isConnected,
    isOkxWalletAvailable,
    isOkxWalletSetUp,
    isAuthModalOpen,
    isSameWallet,
    isSettingUpOkxWallet,
  ])

  const buttonHasAction = !isConnected && isOkxWalletAvailable
  const secondaryButtonHasAction =
    Boolean(isConnected && !isSameWallet) ||
    Boolean(isOkxWalletSetUp && isSameWallet) ||
    Boolean(!isOkxWalletAvailable)

  const secondaryButtonAction = useCallback(() => {
    if (isConnected && !isSameWallet) {
      tryAgainAction()
    }
    if (isOkxWalletSetUp && isSameWallet) {
      push('/?networks=BASE')
    }
    if (!isOkxWalletAvailable) {
      window.open(EXTERNAL_LINKS.OKX, '_blank')
    }

    return null
  }, [isConnected, isSameWallet, isOkxWalletSetUp, tryAgainAction, push, isOkxWalletAvailable])

  return (
    <>
      <Button
        variant="primaryLargeColorful"
        onClick={buttonHasAction ? openAuthModal : undefined}
        disabled={!buttonHasAction}
      >
        {buttonLabel}
      </Button>
      <Text
        variant="p2semiColorful"
        style={{
          margin: 0,
          padding: 0,
          cursor: secondaryButtonHasAction ? 'pointer' : 'default',
        }}
        onClick={secondaryButtonAction}
      >
        {!isOkxWalletAvailable ? 'Get OKX wallet now' : <>&nbsp;</>}
        {isOkxWalletSetUp && isSameWallet ? 'Earn now' : <>&nbsp;</>}
        {isConnected && !isSameWallet && isOkxWalletAvailable ? (
          'Click to connect your OKX Wallet'
        ) : (
          <>&nbsp;</>
        )}
      </Text>
    </>
  )
}
