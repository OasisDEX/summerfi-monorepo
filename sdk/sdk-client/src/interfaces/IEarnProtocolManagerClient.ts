import { IAddress } from '@summerfi/sdk-common'
import { Maybe } from '@summerfi/sdk-common/common'
import { IEarnProtocolFleetClient } from './IEarnProtocolFleetClient'

/**
 * @interface IEarnProtocolManagerClient
 * @description Interface of the FleetCommander manager for the SDK Client. Allows to instantiate
 *              FleetCommanders to interact with them
 */
export interface IEarnProtocolManagerClient {
  /**
   * @method getFleet
   * @description Retrieves a fleet by it's address
   *
   * @param name The name of the protocol to retrieve
   *
   * @returns The protocol with the given name
   */
  getFleet(params: { address: IAddress }): Maybe<IEarnProtocolFleetClient>
}