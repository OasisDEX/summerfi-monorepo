import { makeInstiSdk, makeSDK } from '@summerfi/sdk-client'

import { RWA_CLIENT_ID, RWA_INSTI_VERSION } from '@/constants/rwa'

if (!process.env.SDK_API_URL) {
  throw new Error('SDK_API_URL is not set')
}

export const backendSDK = makeSDK({
  apiURL: `${process.env.SDK_API_URL}/sdk/trpc`,
  version: 'v2',
})

/**
 * Institutional backend SDK for RWA (rounds-based) vault reads. Built with `makeInstiSdk` so the
 * request carries the `Client-Id` + `Insti-Version` headers the SDK server needs to resolve the
 * RWA / institutions-v2 deployment config + subgraph (it defaults to 'v1' otherwise).
 */
export const backendInstiSDK = makeInstiSdk({
  apiURL: `${process.env.SDK_API_URL}/sdk/trpc`,
  version: 'v2',
  clientId: RWA_CLIENT_ID,
  instiVersion: RWA_INSTI_VERSION,
})
