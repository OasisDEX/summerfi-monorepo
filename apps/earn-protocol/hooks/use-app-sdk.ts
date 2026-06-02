import { useEarnProtocolChain, useEarnProtocolWallet } from '@summerfi/app-earn-ui'
import { useSDK } from '@summerfi/sdk-client-react'

/**
 * Custom hook that provides access to the public SummerFi SDK with the current chain and wallet
 * configuration. Used for standard (non-RWA) vaults.
 *
 * RWA (institutional) calls use {@link useRwaSDK} instead — the RWA namespace lives only on the
 * institutional SDK surface and must not route standard-vault calls through it.
 */
export const useAppSDK = () => {
  const { chain } = useEarnProtocolChain()
  const { address: userWalletAddress } = useEarnProtocolWallet()

  const walletAddress = userWalletAddress

  return useSDK({ chainId: chain.id, walletAddress })
}
