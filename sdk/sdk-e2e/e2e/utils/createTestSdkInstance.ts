import { makeAdminSDK, makeInstiSdk, makeSDK } from '@summerfi/sdk-client'
import { SDKApiUrl } from './testConfig'
import type { InstiVersion } from '@summerfi/sdk-common'

/**
 * Creates a configured SDK instance for e2e tests
 * @returns Configured SDKManager instance
 */
export function createTestSdkInstance(
  clientId?: string,
  instiVersion?: InstiVersion,
): ReturnType<typeof makeSDK> | ReturnType<typeof makeAdminSDK> | ReturnType<typeof makeInstiSdk> {
  if (clientId) {
    if (instiVersion) {
      return makeInstiSdk({
        apiDomainUrl: SDKApiUrl,
        clientId,
        instiVersion,
        logging: process.env.SDK_LOGGING_ENABLED === 'true',
      })
    } else {
      return makeAdminSDK({
        apiDomainUrl: SDKApiUrl,
        clientId,
        // version: 'v1',
        logging: process.env.SDK_LOGGING_ENABLED === 'true',
      })
    }
  }

  return makeSDK({
    apiDomainUrl: SDKApiUrl,
    logging: process.env.SDK_LOGGING_ENABLED === 'true',
  })
}
