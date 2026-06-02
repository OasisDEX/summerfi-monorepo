import { useEarnProtocolChain, useEarnProtocolWallet } from '@summerfi/app-earn-ui'
import { useSDK } from '@summerfi/sdk-client-react'

import { RWA_CLIENT_ID } from '@/constants/rwa'

/**
 * SDK instance for RWA (rounds-based) vault calls.
 *
 * RWA handlers live only on the institutional SDK surface (`ISDKInstiManager`), and the SDK server
 * needs the `Client-Id` + `Insti-Version` headers to resolve the RWA deployment/subgraph — both of
 * which `makeInstiSdk` sends. Passing `clientId` + `insti` selects that path.
 *
 * Kept separate from `useAppSDK` (the public client used for standard vaults) so standard-vault
 * calls are NOT routed through the institutional deployment.
 */
export const useRwaSDK = () => {
  const { chain } = useEarnProtocolChain()
  const { address: userWalletAddress } = useEarnProtocolWallet()

  return useSDK({
    chainId: chain.id,
    walletAddress: userWalletAddress,
    clientId: RWA_CLIENT_ID,
    insti: true,
  })
}
