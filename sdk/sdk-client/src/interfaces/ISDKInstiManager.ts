import type { IRwaManagerClient } from './ArmadaManager/IRwaManagerClient'
import type { ISDKManager } from './ISDKManager'

/**
 * SDKManager is the main entry point for interacting with the SDK in the client side
 *
 * It contains all the available services that can be used to interact with the SDK
 */
export interface ISDKInstiManager extends ISDKManager {
  /** RWA Manager for interacting with Real-World Asset vaults */
  readonly rwa: IRwaManagerClient
}
