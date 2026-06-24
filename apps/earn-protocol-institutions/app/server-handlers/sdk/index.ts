import { makeAdminSDK, makeInstiSdk, type SDKAdminManager } from '@summerfi/sdk-client'

const apiClientsList: {
  [institutionName: string]: SDKAdminManager
} = {}

const rwaApiClientsList: {
  [clientId: string]: SDKAdminManager
} = {}

export const getInstitutionsSDK: (institutionName: string) => SDKAdminManager = (
  institutionName: string,
) => {
  if (!process.env.EARN_APP_URL) {
    throw new Error('EARN_APP_URL is not set')
  }
  if (!institutionName) {
    throw new Error('Institution ID is required')
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!apiClientsList[institutionName]) {
    apiClientsList[institutionName] = makeAdminSDK({
      clientId: institutionName, // institution ID
      apiDomainUrl: process.env.EARN_APP_URL, // serves as SDK proxy
      version: 'v2',
    })
  }

  return apiClientsList[institutionName]
}

/**
 * SDK instance for RWA (rounds-based) vault calls. RWA vaults are served by the institutions-v2
 * deployment, which requires the `Insti-Version: v2` header that `makeInstiSdk` sends — `makeAdminSDK`
 * (used by {@link getInstitutionsSDK}) hardcodes 'v1' and would resolve the wrong deployment/subgraph.
 * `clientId` is the vault's `vaultInstitutionId` fleet-config field, NOT necessarily the institution
 * name (e.g. an institution can own vaults under `Name_v2` / `Name_3`). One instance per clientId.
 */
export const getInstitutionsRwaSDK: (clientId: string) => SDKAdminManager = (clientId: string) => {
  if (!process.env.EARN_APP_URL) {
    throw new Error('EARN_APP_URL is not set')
  }
  if (!clientId) {
    throw new Error('RWA clientId is required')
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!rwaApiClientsList[clientId]) {
    rwaApiClientsList[clientId] = makeInstiSdk({
      clientId,
      apiDomainUrl: process.env.EARN_APP_URL, // serves as SDK proxy
      version: 'v2',
      instiVersion: 'v2', // RWA / institutions-v2 deployment + subgraph
    })
  }

  return rwaApiClientsList[clientId]
}
