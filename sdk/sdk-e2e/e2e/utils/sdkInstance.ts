import { makeAdminSDK, makeSDK } from '@summerfi/sdk-client'
import { SDKApiUrl } from './testConfig'

const clientId = 'test-client'

/**
 * Creates a configured SDK instance for e2e tests
 * @returns Configured SDKManager instance
 */
export function createTestSDK() {
  if (!SDKApiUrl) {
    throw new Error('E2E_SDK_API_URL environment variable not set')
  }

  if (clientId) {
    return makeAdminSDK({
      apiDomainUrl: SDKApiUrl,
      clientId,
    })
  }

  return makeSDK({
    apiDomainUrl: SDKApiUrl,
  })
}
