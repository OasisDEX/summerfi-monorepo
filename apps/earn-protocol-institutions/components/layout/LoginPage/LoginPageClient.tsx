'use client'

import { useEffect, useState } from 'react'
import { useChain, useSignMessage, useSmartAccountClient } from '@account-kit/react'
import { accountType, Button, Text } from '@summerfi/app-earn-ui'
import { usePathname, useRouter } from 'next/navigation'

import WalletLabel from '@/components/molecules/WalletLabel/WalletLabel'
import { getLoginSignature } from '@/helpers/get-login-signature'
import { setLoginCookie } from '@/helpers/handle-login-cookie'
import { switchUserInstitution } from '@/helpers/switch-user-institution'
import { useUserWallet } from '@/hooks/use-user-wallet'

export const InstitutionsLoginPageClient = ({ loginCookie }: { loginCookie?: string }) => {
  const [signatureError, setSignatureError] = useState<string | null>(null)
  const router = useRouter()
  const currentPath = usePathname()
  const {
    chain: { id: chainId },
  } = useChain()
  const { userWalletAddress } = useUserWallet()
  const { client } = useSmartAccountClient({ type: accountType })
  const { signMessageAsync } = useSignMessage({
    client,
  })

  const isLoginPage = currentPath === '/'

  useEffect(() => {
    let cancelled = false

    if (isLoginPage && userWalletAddress && loginCookie) {
      switchUserInstitution({
        userWalletAddress,
      })
        .then((response) => {
          if (cancelled) return
          // Redirect to the dashboard or home page after switching institution
          router.push(`/${response}`)
        })
        .catch((error) => {
          if (cancelled) return
          // eslint-disable-next-line no-console
          console.error('Failed to switch institution:', error)
          setSignatureError('Failed to switch institution, please try again later.')
        })
    }

    return () => {
      cancelled = true
    }
  }, [isLoginPage, userWalletAddress, router, loginCookie])

  const handleSignMessage = async () => {
    setSignatureError(null)
    if (!userWalletAddress) {
      // eslint-disable-next-line no-console
      console.error('User wallet address is required to sign the message')
      setSignatureError('User wallet address is required to sign the message (please log in)')

      return
    }

    try {
      const signature = await signMessageAsync({
        message: getLoginSignature(userWalletAddress),
      })

      // Handle the signature
      const setCookieResponse = await setLoginCookie({
        loginSignature: signature,
        userWalletAddress,
        chainId,
      })

      if (setCookieResponse.ok) {
        router.refresh() // Refresh the page to reflect the new login state
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to set login cookie:', setCookieResponse.statusText)
        setSignatureError('Failed to set login cookie')
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error signing message:', error)
      setSignatureError('Failed to sign message')
    }
  }

  if (loginCookie) {
    // We should be getting redirected
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px',
          padding: '20px',
        }}
      >
        <Text variant="h1colorful">Redirecting...</Text>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        padding: '20px',
      }}
    >
      <Text variant="h1colorful">Welcome to the new thing</Text>
      {!userWalletAddress && (
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}
        >
          <Text variant="h4">please connect your wallet</Text>
          <WalletLabel buttonVariant="primaryLarge" />
        </div>
      )}
      {userWalletAddress && !loginCookie && (
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}
        >
          <Text variant="h4">please sign message</Text>
          {signatureError && (
            <Text variant="p2" style={{ color: 'red' }}>
              {signatureError}
            </Text>
          )}
          <Button variant="primaryLarge" onClick={handleSignMessage}>
            Sign Message
          </Button>
          <WalletLabel buttonVariant="secondaryLarge" variant="logoutOnly" />
        </div>
      )}
    </div>
  )
}
