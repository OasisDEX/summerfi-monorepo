import { Maybe } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { ProtocolClient } from '../implementation/ProtocolClient'

/**
 * @interface IProtocolsManagerClient
 * @description Interface of the ProtocolsManager for the SDK Client. Allows to retrieve information for a Protocol
 * @see IProtocolsManager
 */
export interface IProtocolsManagerClient {
  /**
   * @method getProtocol
   * @description Retrieves a protocol by its name
   *
   * @param name The name of the protocol to retrieve
   *
   * @returns The protocol with the given name
   */
  getProtocol(params: { name: ProtocolName }): Promise<Maybe<ProtocolClient>>
}
