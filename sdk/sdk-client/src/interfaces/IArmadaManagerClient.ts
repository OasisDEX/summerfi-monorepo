import { IAddress } from '@summerfi/sdk-common'
import { Maybe } from '@summerfi/sdk-common/common'
import { IArmadaFleetClient } from './IArmadaFleetClient'

/**
 * @interface IArmadaManagerClient
 * @description Interface of the FleetCommander manager for the SDK Client. Allows to instantiate
 *              FleetCommanders to interact with them
 */
export interface IArmadaManagerClient {
  /**
   * @method getFleet
   * @description Retrieves a fleet by it's address
   *
   * @param name The name of the protocol to retrieve
   *
   * @returns The protocol with the given name
   */
  getFleet(params: { address: IAddress }): Maybe<IArmadaFleetClient>
}
