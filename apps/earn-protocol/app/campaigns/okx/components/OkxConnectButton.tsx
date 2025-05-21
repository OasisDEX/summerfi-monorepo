'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuthModal } from '@account-kit/react'
import { Button } from '@summerfi/app-earn-ui'

import { useUserWallet } from '@/hooks/use-user-wallet'

declare global {
  interface Window {
    okxwallet?: {
      isOkxWallet: boolean
      selectedAddress?: string
    }
  }
}

export const OkxConnectButton = () => {
  const [isOkxWalletSetUp, setIsOkxWalletSetUp] = useState(false)
  const { openAuthModal, isOpen: isAuthModalOpen } = useAuthModal()
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

  useEffect(() => {
    if (isOkxWalletAvailable && isConnected && isSameWallet) {
      const parsedAddress = userWalletAddress.toLowerCase()

      fetch(`/earn/api/campaigns/okx/${parsedAddress}`).then((getResponse) => {
        if (getResponse.ok) {
          getResponse.json().then((getData) => {
            setIsOkxWalletSetUp(getData.okxWallet)
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
  }, [isConnected, isOkxWalletAvailable, userWalletAddress, isSameWallet])

  const buttonLabel = useMemo(() => {
    if (!isOkxWalletAvailable) {
      return 'OKX wallet is not installed'
    }
    if (isConnected && !isSameWallet) {
      return 'Connected to another wallet (not OKX)'
    }
    if ((isConnected && !isOkxWalletSetUp) || isAuthModalOpen) {
      return 'Loading'
    }
    if (!isConnected) {
      return 'Connect your OKX wallet'
    }
    if (isOkxWalletSetUp) {
      return 'OKX wallet connected'
    }

    return 'OKX wallet connected'
  }, [isConnected, isOkxWalletAvailable, isOkxWalletSetUp, isAuthModalOpen, isSameWallet])

  const buttonHasAction = !isConnected && isOkxWalletAvailable

  return (
    <Button
      variant="primaryLargeColorful"
      onClick={buttonHasAction ? openAuthModal : undefined}
      disabled={!buttonHasAction}
    >
      {buttonLabel}
    </Button>
  )
}
