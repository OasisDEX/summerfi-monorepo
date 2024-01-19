import { SDKManager } from '~sdk/managers'
import { SDKManagerClientImpl } from './SDKManagerImplementation'

/**
 * @function makeSDK
 * @returns The SDKManager singleton
 */
export function makeSDK(): SDKManager {
  return SDKManagerClientImpl.getInstance()
}
