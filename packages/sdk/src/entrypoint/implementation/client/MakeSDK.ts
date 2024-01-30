import { SDKManager } from '~sdk/entrypoint'
import { SDKManagerClientImpl } from './SDKManagerImplementation'

/**
 * @function makeSDK
 * @returns The SDKManager singleton
 */
export function makeSDK(): SDKManager {
  return new SDKManagerClientImpl()
}
