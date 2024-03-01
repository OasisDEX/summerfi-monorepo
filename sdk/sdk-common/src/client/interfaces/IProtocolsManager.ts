import type { Maybe } from '~sdk-common/common/aliases'
import type { Protocol } from '~sdk-common/protocols/interfaces/Protocol'
import type { ProtocolName } from '~sdk-common/protocols/interfaces/ProtocolName'

/**
 * @interface IProtocolsManager
 * @description Manages the list of protocols supported by the SDK for the current network
 */
export interface IProtocolsManager {
  /**
   * @method getSupportedProtocols
   * @description Retrieves the list of supported protocols for the current network
   *
   * @returns The list of supported protocols
   */
  getSupportedProtocols(): ProtocolName[]

  /**
   * @method getProtocol
   * @description Retrieves a protocol by its name
   *
   * @param name The name of the protocol to retrieve
   *
   * @returns The protocol with the given name
   */
  getProtocolByName<ProtocolType extends Protocol>(params: {
    name: ProtocolName
  }): Promise<Maybe<ProtocolType>>
}
