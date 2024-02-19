import { SDKManager } from '~sdk-common/entrypoint'
import { SDKManagerClientImpl } from './SDKManagerImplementation'
import { registerMockProtocols } from '~sdk-common/mocks/mockProtocol'

/**
 * @function makeSDK
 * @returns The SDKManager singleton
 */
export function makeSDK(): SDKManager {
  // TODO: remove this mock call
  registerMockProtocols()

  return new SDKManagerClientImpl()
}
