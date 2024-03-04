import { SDKManager } from './SDKManager'
import { registerMockProtocols } from '~sdk-common/mocks/mockProtocol'

/**
 * @function makeSDK
 * @returns The SDKManager singleton
 */
export function makeSDK() {
  // TODO: remove this mock call
  registerMockProtocols()

  return new SDKManager()
}
