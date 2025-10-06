import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import { SDKApiUrl } from './testConfig'

/**
 * Creates a configured SDK instance for e2e tests
 * @returns Configured SDKManager instance
 */
export function createTestSDK(): SDKManager {
  if (!SDKApiUrl) {
    throw new Error('E2E_SDK_API_URL environment variable not set')
  }

  return makeSDK({
    apiDomainUrl: SDKApiUrl,
  })
}
