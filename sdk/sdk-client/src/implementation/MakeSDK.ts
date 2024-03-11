import { registerMockProtocols } from '~sdk-client/mocks/mockProtocol'
import { SDKManager } from './SDKManager'

/**
 * @function makeSDK
 * @returns The SDKManager singleton
 */
export function makeSDK() {
  // TODO: remove this mock call
  registerMockProtocols()

  return new SDKManager()
}
