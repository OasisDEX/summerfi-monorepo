import { Maybe } from '../../common/aliases/Maybe'
import { Protocol } from '../../protocols/implementation/Protocol'
import { IProtocol } from '../../protocols/interfaces/IProtocol'

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
  getSupportedProtocols(): IProtocol[]

  /**
   * @method getProtocol
   * @description Retrieves a protocol by its name
   *
   * @param name The name of the protocol to retrieve
   *
   * @returns The protocol with the given name
   */
  getProtocol(params: { protocol: IProtocol }): Promise<Maybe<Protocol>>
}
