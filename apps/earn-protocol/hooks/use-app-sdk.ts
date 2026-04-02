import { useEarnProtocolChain, useEarnProtocolWallet } from '@summerfi/app-earn-ui'
import { useSDK } from '@summerfi/sdk-client-react'

/**
 * Custom hook that provides access to the SummerFi SDK with the current chain and wallet configuration
 * @returns SDK instance configured with the current chain ID and wallet address
 */
export const useAppSDK = () => {
  const { chain } = useEarnProtocolChain()
  const { address: userWalletAddress } = useEarnProtocolWallet()

  const walletAddress = userWalletAddress

  return useSDK({ chainId: chain.id, walletAddress })
}
