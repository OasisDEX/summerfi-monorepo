import { useChain } from '@account-kit/react'
import { useSDK } from '@summerfi/sdk-client-react'

import { useUserWallet } from './use-user-wallet'

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
