import { useChain } from '@account-kit/react'
import { useSDK } from '@summerfi/sdk-client-react'

import { useUserWallet } from './use-user-wallet'

export const useAppSDK = () => {
  const chain = useChain()
  const chainId = chain.chain.id

  const { userWalletAddress } = useUserWallet()

  const walletAddress = userWalletAddress

  return useSDK({ chainId, walletAddress })
}
