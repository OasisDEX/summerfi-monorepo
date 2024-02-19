import { SDKManager } from '~sdk/entrypoint'
import { SDKManagerClientImpl } from './SDKManagerImplementation'
import { registerMockProtocols } from '~sdk/mocks'

/**
 * @function makeSDK
 * @returns The SDKManager singleton
 */
export function makeSDK(): SDKManager {
  // TODO: remove this mock call
  registerMockProtocols()

  return new SDKManagerClientImpl()
}
