import { useState } from 'react'
import { useSignMessage, useSmartAccountClient } from '@account-kit/react'
import { accountType, useUserWallet } from '@summerfi/app-earn-ui'
import { useRouter } from 'next/navigation'

import { getLoginSignature } from '@/helpers/get-login-signature'
import { setLoginCookie } from '@/helpers/handle-login-cookie'

export const useSignUp = () => {
  const [signatureError, setSignatureError] = useState<string | null>(null)
  const router = useRouter()
  const { userWalletAddress } = useUserWallet()
  const { client } = useSmartAccountClient({ type: accountType })
  const { signMessageAsync } = useSignMessage({
    client,
  })
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

  return {
    signatureError,
    handleSignMessage,
  }
}
