import { useChain, useUser } from '@account-kit/react'
import { useSDK } from '@summerfi/sdk-client-react'

export const useAppSDK = () => {
  const user = useUser()
  const chain = useChain()
  const chainId = chain.chain.id
  const walletAddress = user?.address

  return useSDK({ chainId, walletAddress })
}
