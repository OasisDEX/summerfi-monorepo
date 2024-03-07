import type { Maybe } from '@summerfi/sdk-common/common'
import type { IProtocol, Protocol } from '@summerfi/sdk-common/protocols'

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
