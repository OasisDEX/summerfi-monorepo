import type { IArmadaManagerClient } from './ArmadaManager/IArmadaManagerClient'
import type { IDcaManagerClient } from './ArmadaManager/IDcaManagerClient'
import type { IChainsManagerClient } from './IChainsManager'
import type { IOracleManagerClient } from './IOracleManagerClient'
import type { ISwapManagerClient } from './ISwapManagerClient'
import type { ITokensManagerClient2 } from './ITokensManagerClient2'
import type { IUsersManager } from './IUsersManager'
import type { IIntentSwapClient } from './IIntentSwapClient'
import type { IAllowanceManagerClient } from './IAllowanceManagerClient'

/**
 * SDKManager is the main entry point for interacting with the SDK in the client side
 *
 * It contains all the available services that can be used to interact with the SDK
 */
export interface ISDKManager {
  /** Chains Manager for interacting with the different chains supported in the SDK */
  readonly chains: IChainsManagerClient
  /** Tokens Manager for interacting with the different tokens supported in the SDK */
  readonly tokens: ITokensManagerClient2
  /** Users Manager for retrieving information about a user */
  readonly users: IUsersManager
  /** Armada Manager for interacting with the Armada protocol */
  readonly armada: IArmadaManagerClient
  /** Swap Manager for interacting with the swaps */
  readonly swaps: ISwapManagerClient
  /** Swap Manager for interacting with the swaps */
  readonly oracle: IOracleManagerClient
  /** Intent Swap Client for interacting with CoW Protocol intent swaps */
  readonly intentSwaps: IIntentSwapClient
  /** Allowance Manager Client for Permit2 authorization checks, transactions and typed data */
  readonly allowance: IAllowanceManagerClient
  /** DCA Manager for interacting with DCA strategies and buy orders */
  readonly dca: IDcaManagerClient
}
