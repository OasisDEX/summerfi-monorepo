import { Protocol } from '~sdk/protocols'
import { ProtocolName } from './ProtocolName'

/**
 * @class ProtocolsRegistry
 * @description Allows to register and retrieve protocols by name
 *
 * @dev This class offers runtime storage of protocols and it is used to easy the registration and retrieval of protocols
 */
export class ProtocolsRegistry {
  private static _protocols: Map<ProtocolName, Protocol>

  // Private because this class should not be instantiated
  private constructor() {}

  public static registerProtocol(params: { name: ProtocolName; protocol: Protocol }): void {
    if (!this._protocols) {
      this._protocols = new Map()
    }

    if (this._protocols.has(params.name)) {
      throw new Error(`Protocol ${params.name} already registered`)
    }

    this._protocols.set(params.name, params.protocol)
  }

  public static getProtocol<ProtocolType extends Protocol>(name: ProtocolName): ProtocolType {
    const protocol = this._protocols.get(name)
    if (!protocol) {
      throw new Error(`Protocol ${name} not found`)
    }
    return protocol as ProtocolType
  }

  public static getSupportedProtocols(): ProtocolName[] {
    return Array.from(this._protocols.keys())
  }
}
