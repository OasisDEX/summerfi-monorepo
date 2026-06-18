import { useEarnProtocolChain, useEarnProtocolWallet } from '@summerfi/app-earn-ui'
import { useSDK } from '@summerfi/sdk-client-react'

/**
 * SDK instance for RWA (rounds-based) vault calls, scoped to the institution that owns the vault.
 *
 * `clientId` is the vault's `vaultInstitutionId` (resolved via `getVaultRwaClientId`); it sets the
 * `Client-Id` header so the SDK server resolves that institution's deployment contracts + subgraph.
 * RWA handlers live only on the institutional SDK surface (`ISDKInstiManager`), which `clientId` +
 * `insti: true` selects.
 *
 * `clientId` is optional because the vault views call this hook unconditionally (it must run on every
 * render), but the returned RWA handlers are only ever invoked for RWA vaults — where a real client id
 * is always present. For non-RWA vaults `clientId` is empty and the result goes unused. The `?? ''`
 * keeps the static type on the full institutional surface so consumers retain the RWA methods.
 *
 * Kept separate from `useAppSDK` (the public client used for standard vaults) so standard-vault calls
 * are NOT routed through an institutional deployment.
 */
export const useRwaSDK = (clientId?: string) => {
  const { chain } = useEarnProtocolChain()
  const { address: userWalletAddress } = useEarnProtocolWallet()

  return useSDK({
    chainId: chain.id,
    walletAddress: userWalletAddress,
    clientId: clientId ?? '',
    insti: true,
  })
}
