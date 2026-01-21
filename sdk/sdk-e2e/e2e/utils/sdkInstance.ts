import { makeAdminSDK, makeSDK } from '@summerfi/sdk-client'
import { SDKApiUrl } from './testConfig'

/**
 * Creates a configured SDK instance for e2e tests
 * @returns Configured SDKManager instance
 */
export function createTestSDK(
  clientId?: string,
): ReturnType<typeof makeSDK> | ReturnType<typeof makeAdminSDK> {
  if (clientId) {
    return makeAdminSDK({
      apiDomainUrl: SDKApiUrl,
      clientId,
      // version: 'v1',
    })
  }

  return makeSDK({
    apiDomainUrl: SDKApiUrl,
  })
}
