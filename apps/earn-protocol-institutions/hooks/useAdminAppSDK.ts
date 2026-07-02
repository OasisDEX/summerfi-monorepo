import { useEarnProtocolChain, useEarnProtocolWallet } from '@summerfi/app-earn-ui'
import { useSDK } from '@summerfi/sdk-client-react'

/**
 * Custom hook that provides access to the SummerFi SDK with the current chain and wallet configuration
 * @returns SDK instance configured with the current chain ID and wallet address
 */
export const useAdminAppSDK = (clientId: string) => {
  const { chain } = useEarnProtocolChain()
  const chainId = chain.id

  const { address: userWalletAddress } = useEarnProtocolWallet()

  const walletAddress = userWalletAddress

  return useSDK({ chainId, walletAddress, clientId })
}

/**
 * SDK instance for RWA (rounds-based) vault calls. RWA handlers must run on the institutions-v2
 * deployment, selected by `insti: true` (sends the `Insti-Version: v2` header) — the plain
 * {@link useAdminAppSDK} resolves the v1 deployment and would read the wrong subgraph. `clientId` is
 * the vault's `vaultInstitutionId`, not the institution name.
 */
export const useAdminAppRwaSDK = (clientId: string) => {
  const { chain } = useEarnProtocolChain()
  const chainId = chain.id

  const { address: userWalletAddress } = useEarnProtocolWallet()

  return useSDK({ chainId, walletAddress: userWalletAddress, clientId, insti: true })
}
