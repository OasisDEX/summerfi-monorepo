import { useUserWallet } from '@summerfi/app-earn-ui'
import { useSDK } from '@summerfi/sdk-client-react'

import { useChain } from '@/providers/privy/account-kit-react-compat'

/**
 * Custom hook that provides access to the SummerFi SDK with the current chain and wallet configuration
 * @returns SDK instance configured with the current chain ID and wallet address
 */
export const useAppSDK = () => {
  const chain = useChain()
  const chainId = chain.chain.id

  const { userWalletAddress } = useUserWallet()

  const walletAddress = userWalletAddress

  return useSDK({ chainId, walletAddress })
}
