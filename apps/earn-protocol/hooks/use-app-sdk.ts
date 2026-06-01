import { useEarnProtocolChain, useEarnProtocolWallet } from '@summerfi/app-earn-ui'
import { useSDK } from '@summerfi/sdk-client-react'

import { RWA_CLIENT_ID, RWA_INSTI_VERSION } from '@/constants/rwa'

/**
 * Custom hook that provides access to the SummerFi SDK with the current chain and wallet configuration
 * @returns SDK instance configured with the current chain ID and wallet address
 *
 * The RWA namespace is served by an institutional SDK (`makeInstiSdk`) via `rwaClientId` so RWA
 * calls carry the institutional headers; all other (non-RWA) handlers keep using the standard sdk.
 */
export const useAppSDK = () => {
  const { chain } = useEarnProtocolChain()
  const { address: userWalletAddress } = useEarnProtocolWallet()

  const walletAddress = userWalletAddress

  return useSDK({
    chainId: chain.id,
    walletAddress,
    rwaClientId: RWA_CLIENT_ID,
    instiVersion: RWA_INSTI_VERSION,
  })
}
