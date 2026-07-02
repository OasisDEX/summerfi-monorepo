import { makeInstiSdk, makeSDK } from '@summerfi/sdk-client'

import { RWA_INSTI_VERSION } from '@/constants/rwa'

if (!process.env.SDK_API_URL) {
  throw new Error('SDK_API_URL is not set')
}

export const backendSDK = makeSDK({
  apiURL: `${process.env.SDK_API_URL}/sdk/trpc`,
  version: 'v2',
})

// One institutional SDK instance per RWA client id. `makeInstiSdk` bakes `clientId` into the
// `Client-Id` header on every request, and the SDK server resolves that institution's deployment
// contracts + institutions-v2 subgraph from it — so per-vault reads/tx-builds must run on the instance
// whose client id owns the vault. Memoised so repeated reads for the same institution reuse one client.
const instiSdkByClientId = new Map<string, ReturnType<typeof makeInstiSdk>>()

/**
 * Returns the institutional backend SDK for a given RWA institution `clientId`, creating + caching it on
 * first use. Built with `makeInstiSdk` so the request carries the `Client-Id` + `Insti-Version` headers
 * the SDK server needs to resolve the RWA / institutions-v2 deployment config + subgraph (it defaults to
 * 'v1' otherwise). The client id for a vault comes from its `vaultInstitutionId` fleet-config field.
 */
export const getBackendInstiSDK = (clientId: string) => {
  const existing = instiSdkByClientId.get(clientId)

  if (existing) {
    return existing
  }

  const sdk = makeInstiSdk({
    apiURL: `${process.env.SDK_API_URL}/sdk/trpc`,
    version: 'v2',
    clientId,
    instiVersion: RWA_INSTI_VERSION,
  })

  instiSdkByClientId.set(clientId, sdk)

  return sdk
}
