import { Maybe } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { Protocol } from '../implementation/Protocol'

/**
 * @interface IProtocolsManager
 * @description Manages the list of protocols supported by the SDK for the current network
 */
export interface IProtocolsManager {
  /**
   * @method getProtocol
   * @description Retrieves a protocol by its name
   *
   * @param name The name of the protocol to retrieve
   *
   * @returns The protocol with the given name
   */
  getProtocol(params: { name: ProtocolName }): Promise<Maybe<Protocol>>
}
