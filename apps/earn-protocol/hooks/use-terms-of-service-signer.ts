import { useCallback } from 'react'
import { useSigner, useSignMessage, useSmartAccountClient, useUser } from '@account-kit/react'
import { AccountKitAccountType, accountType } from '@summerfi/app-earn-ui'
import { type TOSSignMessage } from '@summerfi/app-tos'

/**
 * Hook to handle signing Terms of Service messages for both EOA and Smart Contract accounts
 * @returns Object containing signTosMessage function to sign TOS data
 */
export const useTermsOfServiceSigner = () => {
  const user = useUser()
  const { client } = useSmartAccountClient({ type: accountType })
  const { signMessageAsync } = useSignMessage({
    client,
  })
  const signer = useSigner()

  const signTosMessage: TOSSignMessage = useCallback(
    async (data: string) => {
      if (user?.type === AccountKitAccountType.EOA) {
        return await signMessageAsync({ message: data })
      }
      // different handling for SCA, since signMessageAsync returns signature string
      // that is completely different from signer.signMessage
      else return await signer?.signMessage(data)
    },
    // skipped signMessageAsync on purpose
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signer, user?.type],
  )

  return signTosMessage
}
