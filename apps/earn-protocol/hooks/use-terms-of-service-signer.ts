import { useCallback } from 'react'
import { useEarnProtocolSignMessage } from '@summerfi/app-earn-ui'
import { type TOSSignMessage } from '@summerfi/app-tos'

/**
 * Hook to handle signing Terms of Service messages for both EOA and Smart Contract accounts
 * @returns Object containing signTosMessage function to sign TOS data
 */
export const useTermsOfServiceSigner = () => {
  const { signMessageAsync } = useEarnProtocolSignMessage()

  const signTosMessage: TOSSignMessage = useCallback(
    async (data: string) => await signMessageAsync({ message: data }),
    [signMessageAsync],
  )

  return signTosMessage
}
