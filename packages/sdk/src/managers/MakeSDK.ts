import { SDKManager } from '.'
import { SDKManagerClientImpl } from './implementation/client/SDKManagerImplementation'

/**
 * @function makeSDK
 * @returns The SDKManager singleton
 */
export function makeSDK(): SDKManager {
  return SDKManagerClientImpl.getInstance()
}
